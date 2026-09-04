# Ye Olde Guestbook <!-- omit from toc -->

A passkey powered dapp that acts like a smart contract version of the [internet
guestbooks](https://en.wikipedia.org/wiki/Guestbook) from the olden days!

## Table of Contents <!-- omit from toc -->

- [Give it a Spin](#give-it-a-spin)
- [Passkeys](#passkeys)
- [Anatomy of the Repository](#anatomy-of-the-repository)
  - [Smart Contract](#smart-contract)
  - [Frontend](#frontend)
  - [Relayer Proxy](#relayer-proxy)
- [Running Locally](#running-locally)
- [Deploying to Vercel](#deploying-to-vercel)
- [More Info](#more-info)

## Give it a Spin

![guestbook screenshot](screenshot.png)

You can get to a Testnet version of the dapp here:

- [ye-olde-guestbook.vercel.app](https://ye-olde-guestbook.vercel.app)

## Passkeys

We utilize Tyler's **amazing**
[smart-account-kit](https://github.com/stellar/smart-account-kit) to interact
with users and authenticate with their passkeys. Wallets are OpenZeppelin smart
account contracts, and this makes it possible for users to get on-chain without
_any_ of the usual obstacles that can stand in their way.

Users sign transactions with a device passkey (Touch ID, Face ID, or a hardware
key) via WebAuthn. No seed phrases, no browser extensions — the private key
never leaves the authenticator, and the smart account contract verifies the
`secp256r1` signature on-chain.

Smart Account Kit handles the WebAuthn ceremony, deploys an OpenZeppelin Smart
Account per user on first signup, and stores the credential metadata in
IndexedDB so the session survives page reloads.

> Seriously. You have **GOT** to start thinking about passkeys.

## Anatomy of the Repository

### Smart Contract

The [Stellar smart
contract](https://developers.stellar.org/docs/build#smart-contracts) that powers
this dapp is located in the `/contracts/ye_olde_guestbook` directory. It's
simple enough that you can probably get a pretty solid understanding, just by
browsing through the source code.

This smart contract is also used to generate "bindings" that can be imported and
used in the frontend code. The bindings are located in the
`/packages/ye_olde_guestbook` directory. The bindings are auto-generated each
time the `initialize.js` script is run (you can use `pnpm setup` for this), so
the generated bindings are always going to be up-to-date with the deployed smart
contract.

### Frontend

The frontend files are found in the `/src` directory. It's a
[SvelteKit](https://kit.svelte.dev/) app. There are server-only API routes
located in the `/src/routes/api` directory. Components and utilities are
included in the `/src/lib` directory.

- `src/lib/smartAccountClient.ts` wires up Smart Account Kit and exposes the
  `account`, and a `getNativeBalance` helper function.
- `src/routes/api/send/+server.ts` proxies transaction submissions to the
  relayer so the API key never reaches the browser.

### Relayer Proxy

OpenZeppelin's hosted relayer doesn't accept calls from browser origins with the
API key embedded client-side. To keep the key out of the frontend, we run the
`/api/send` route as a same-origin backend route. The smart account client
`POST`s its transaction to `/api/send`, the server forwards to
`https://channels.openzeppelin.com/testnet/<KEY>`, and the hash comes back.

## Running Locally

```bash
pnpm install                  # install dependencies
cp .env.example .env          # fill in values (see comments in the file)
pnpm run setup                # build + deploy the guestbook contract
pnpm run dev                  # start the development server
```

You'll need:

- A Testnet OpenZeppelin Channels API key
  ([generate one here](https://channels.openzeppelin.com/testnet/gen)).
- A modern browser with a registered passkey authenticator.

## Deploying to Vercel

With `@sveltejs/adapter-vercel` the whole app deploys as a single website. This
can be done via the Vercel CLI, or (my personal favorite) directly by pulling
your source code from Github.

Then set the environment variables in the Vercel project settings. (Updating or changing Vercel environment variables requires a re-deploy to take effect.)

## More Info

- Source Code: <https://github.com/elliotfriend/ye-olde-guestbook>
- Testnet Dapp: <https://ye-olde-guestbook.vercel.app>
- Developer Documentation:
  <https://developers.stellar.org/docs/build/apps/smart-wallets>
- Smart Account Kit: <https://github.com/stellar/smart-account-kit>
- OpenZeppelin Stellar Contracts:
  <https://github.com/OpenZeppelin/stellar-contracts>
- OpenZeppelin Relayer Channels:
  <https://docs.openzeppelin.com/relayer/1.5.x/guides/stellar-channels-guide>
- [Join us on Discord](https://discord.gg/stellardev), and ask questions in the
  `#passkeys` channel
