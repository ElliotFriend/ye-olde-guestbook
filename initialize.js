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

// Function to execute and log shell commands
function exe(command) {
    console.log(command);
    execSync(command, { stdio: 'inherit' });
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

function buildAll() {
    removeFiles(`${dirname}/target/wasm32-unknown-unknown/release/*.wasm`);
    removeFiles(`${dirname}/target/wasm32-unknown-unknown/release/*.d`);
    exe(`stellar contract build`);
}

function filenameNoExtension(filename) {
    return path.basename(filename, path.extname(filename));
}

function deploy(wasm) {
    exe(
        `stellar contract deploy --wasm ${wasm} --alias ${filenameNoExtension(wasm)} --salt 05e04211b7f13ae334fb3d7f3a7927591f7b95b87d5a4d9fd2793434936c2718 -- --admin ${process.env.STELLAR_ACCOUNT} --title "Hello, Initialized Contract!" --text "I would be most honored if you would please sign my humble guestbook."`,
    );
}

function deployAll() {
    const contractsDir = `${dirname}/.stellar/contract-ids`;
    mkdirSync(contractsDir, { recursive: true });

    const wasmFiles = glob(`${dirname}/target/wasm32-unknown-unknown/release/*.wasm`);

    wasmFiles.forEach(deploy);
}

function contracts() {
    const contractFiles = glob(`${dirname}/.stellar/contract-ids/*.json`);

    return contractFiles
        .map((path) => ({
            alias: filenameNoExtension(path),
            ...JSON.parse(readFileSync(path)),
        }))
        .filter((data) => data.ids[process.env.STELLAR_NETWORK_PASSPHRASE])
        .map((data) => ({
            alias: data.alias,
            id: data.ids[process.env.STELLAR_NETWORK_PASSPHRASE],
        }));
}

function bind({ alias, id }) {
    exe(
        `stellar contract bindings typescript --id ${id} --output-dir ${dirname}/packages/${alias} --overwrite`,
    );
}

function bindAll() {
    contracts().forEach(bind);
}

function importContract({ id, alias }) {
    const outputDir = `${dirname}/src/lib/contracts/`;

    mkdirSync(outputDir, { recursive: true });

    const importContent =
        `import * as Client from '${alias}';\n` +
        `import { PUBLIC_STELLAR_RPC_URL } from '$env/static/public';\n\n` +
        `export default new Client.Client({\n` +
        `    ...Client.networks.${process.env.STELLAR_NETWORK},\n` +
        `    rpcUrl: PUBLIC_STELLAR_RPC_URL,\n` +
        `});\n`;

    const outputPath = `${outputDir}/${alias}.ts`;

    writeFileSync(outputPath, importContent);

    console.log(`Created import for ${alias}`);
}

function importAll() {
    contracts().forEach(importContract);
}

// Calling the functions (equivalent to the last part of your bash script)
fundAll();
buildAll();
deployAll();
bindAll();
importAll();
