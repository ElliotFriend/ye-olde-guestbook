import { Server } from '@stellar/stellar-sdk/rpc';
import { PasskeyKit, SACClient } from 'passkey-kit';

import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_WALLET_WASM_HASH,
} from '$env/static/public';
import { Asset } from '@stellar/stellar-sdk';
import type { Tx } from '@stellar/stellar-sdk/contract';

/**
 * A configured Stellar RPC server instance used to interact with the network
 */
export const rpc = new Server(PUBLIC_STELLAR_RPC_URL);

export const account = new PasskeyKit({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    walletWasmHash: PUBLIC_WALLET_WASM_HASH,
    timeoutInSeconds: 30,
});

/**
 * A client allowing us to easily create SAC clients for any asset on the
 * network.
 */
export const sac = new SACClient({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
});

/**
 * A SAC client for the native XLM asset.
 */
export const native = sac.getSACClient(
    Asset.native().contractId(PUBLIC_STELLAR_NETWORK_PASSPHRASE),
);

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/send` endpoint we have created.
 *
 * @param tx - The built, signed transaction. This transaction
 * **must** contain a Soroban operation
 * @returns JSON object containing the RPC's response
 */
export async function send(tx: Tx) {
    return fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
            xdr: tx.toXDR(),
        }),
    }).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/fund/[address]` endpoint we have created.
 *
 * @param address - The contract address to fund on the Testnet
 */
export async function fundContract(address: string) {
    return fetch(`/api/fund/${address}`).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}
