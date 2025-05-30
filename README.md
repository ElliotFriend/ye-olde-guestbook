# Ye Olde Guestbook <!-- omit from toc -->

A passkey powered dapp that acts like a smart contract version of the [internet
guestbooks](https://en.wikipedia.org/wiki/Guestbook) from the olden days!

## Table of Contents <!-- omit from toc -->

- [Give it a Spin](#give-it-a-spin)
- [Passkeys](#passkeys)
- [Anatomy of the Repository](#anatomy-of-the-repository)
    - [Smart Contract](#smart-contract)
    - [Frontend](#frontend)
- [More Info](#more-info)

## Give it a Spin

![guestbook screenshot](screenshot.png)

You can get to a Testnet version of the dapp here:

- [ye-olde-guestbook.vercel.app](https://ye-olde-guestbook.vercel.app)

## Passkeys

We utilize Tyler's **amazing**
[passkey-kit](https://github.com/kalepail/passkey-kit) to interact with users
and authenticate with their passkeys. This makes it possible for users to get
on-chain without _any_ of the usual obstacles that can stand in their way.

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
`/packages/ye_olde_guestbook` directory. They're auto-generated each time the
`initialize.js` script is run (you can use `npm run init` for this), so the
generated bindings are always going to be up-to-date with the deployed smart
contract.

### Frontend

The frontend files are found in the `/src` directory. It's a
[SvelteKit](https://kit.svelte.dev/) app. There are server-only API routes
located in the `/src/routes/api` directory. Components and utilities are
included in the `/src/lib` directory.

## More Info

- Source Code: <https://github.com/elliotfriend/ye-olde-guestbook>
- Testnet Dapp: <https://ye-olde-guestbook.vercel.app>
- Developer Documentation:
  <https://developers.stellar.org/docs/build/apps/smart-wallets>
- Passkey-kit: <https://github.com/kalepail/passkey-kit>
- Superpeach: <https://github.com/kalepail/superpeach>
- Launchtube: <https://github.com/kalepail/launchtube>
- Mercury Data Indexer: <https://www.mercurydata.app>
- [Join us on Discord](https://discord.gg/stellardev), and ask questions in the
  `#passkeys` channel
