import 'dotenv/config';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { sync as glob } from 'glob';

// Load environment variables starting with PUBLIC_ into the environment,
// so we don't need to specify duplicate variables in .env
for (const key in process.env) {
    if (key.startsWith('PUBLIC_')) {
        process.env[key.substring(7)] = process.env[key];
    }
}

console.log('###################### Initializing ########################');

// Get dirname (equivalent to the Bash version)
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// Rust targets the Stellar CLI may have built our contracts into
const WASM_TARGETS = ['wasm32v1-none', 'wasm32-unknown-unknown'];

// Function to execute and log shell commands
function exe(command) {
    console.log(command);
    execSync(command, { stdio: 'inherit' });
}

// Same, but returns the command's standard output. Standard error still
// streams to our own, so the Stellar CLI's progress messages stay visible.
function exeCapture(command) {
    console.log(command);
    return execSync(command, { stdio: ['inherit', 'pipe', 'inherit'] })
        .toString()
        .trim();
}

function fundAll() {
    exe(`stellar keys generate ${process.env.STELLAR_ACCOUNT} | true`);
    if (
        process.env.STELLAR_NETWORK_PASSPHRASE !== 'Public Global Stellar Network ; September 2015'
    ) {
        exe(
            `stellar keys fund ${process.env.STELLAR_ACCOUNT} --network ${process.env.STELLAR_NETWORK}`,
        );
    }
}

function removeFiles(pattern) {
    console.log(`remove ${pattern}`);
    glob(pattern).forEach((entry) => rmSync(entry));
}

// The Stellar CLI builds to `wasm32v1-none` these days, but older versions
// used `wasm32-unknown-unknown`, so we look in both places.
function wasmFiles() {
    return WASM_TARGETS.flatMap((target) => glob(`${dirname}/target/${target}/release/*.wasm`));
}

function buildAll() {
    for (const target of WASM_TARGETS) {
        removeFiles(`${dirname}/target/${target}/release/*.wasm`);
        removeFiles(`${dirname}/target/${target}/release/*.d`);
    }
    exe(`stellar contract build`);
}

function filenameNoExtension(filename) {
    return path.basename(filename, path.extname(filename));
}

// The Stellar CLI prints the deployed contract address on standard out, which
// is where we get it from: where the CLI stores its aliases has moved around
// between versions.
function deploy(wasm) {
    const alias = filenameNoExtension(wasm);
    const id = exeCapture(
        `stellar contract deploy --wasm ${wasm} --alias ${alias} --salt 05e04211b7f13ae334fb3d7f3a7927591f7b95b87d5a4d9fd2793434936c2718 -- --admin ${process.env.STELLAR_ACCOUNT} --title "Hello, Initialized Contract!" --text "I would be most honored if you would please sign my humble guestbook."`,
    );

    return { alias, id };
}

function deployAll() {
    return wasmFiles().map(deploy);
}

function bind({ alias, id }) {
    const packageDir = `${dirname}/packages/${alias}`;

    exe(`stellar contract bindings typescript --id ${id} --output-dir ${packageDir} --overwrite`);

    // The generated package.json only defines `build`. Adding `prepare` gets
    // the bindings compiled on a clean `pnpm install`, so `dist/` never has to
    // be committed. Note that pnpm only runs `prepare` when it actually has
    // installing to do: against an up-to-date workspace it reports "Already up
    // to date" and skips lifecycle scripts, which is why the root `bindings`
    // script, not this, is what guarantees `dist/` exists before a build.
    const manifestPath = `${packageDir}/package.json`;
    const manifest = JSON.parse(readFileSync(manifestPath));
    manifest.scripts = { ...manifest.scripts, prepare: 'tsc' };
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);

    // Since the bindings are compiled on install, the compiled output doesn't
    // belong in version control either.
    const ignorePath = `${packageDir}/.gitignore`;
    const ignored = readFileSync(ignorePath, 'utf8');
    if (!ignored.split('\n').includes('dist/')) {
        writeFileSync(ignorePath, `${ignored.trimEnd()}\ndist/\n`);
    }

    // The CLI writes a standalone package, but inside a workspace the root
    // lockfile is the only one that matters.
    rmSync(`${packageDir}/pnpm-lock.yaml`, { force: true });
}

function bindAll(contracts) {
    contracts.forEach(bind);
}

function importContract({ alias }) {
    const outputDir = `${dirname}/src/lib/contracts/`;

    mkdirSync(outputDir, { recursive: true });

    const importContent =
        `import { Client, networks } from '${alias}';\n` +
        `import { PUBLIC_STELLAR_RPC_URL } from '$env/static/public';\n\n` +
        `export default new Client({\n` +
        `    ...networks.${process.env.STELLAR_NETWORK},\n` +
        `    rpcUrl: PUBLIC_STELLAR_RPC_URL,\n` +
        `});\n`;

    const outputPath = `${outputDir}/${alias}.ts`;

    writeFileSync(outputPath, importContent);

    console.log(`Created import for ${alias}`);
}

function importAll(contracts) {
    contracts.forEach(importContract);
}

// Calling the functions (equivalent to the last part of your bash script)
fundAll();
buildAll();
const deployed = deployAll();
bindAll(deployed);
importAll(deployed);
