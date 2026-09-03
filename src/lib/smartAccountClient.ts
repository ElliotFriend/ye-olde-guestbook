import { Server, Api } from '@stellar/stellar-sdk/rpc';
import {
    Account,
    Address,
    BASE_FEE,
    Contract,
    TransactionBuilder,
    scValToNative,
    xdr,
} from '@stellar/stellar-sdk';
import { SmartAccountKit, IndexedDBStorage } from 'smart-account-kit';
import { browser } from '$app/environment';

import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_ACCOUNT_WASM_HASH,
    PUBLIC_WEBAUTHN_VERIFIER_ADDRESS,
    PUBLIC_NATIVE_TOKEN_CONTRACT,
} from '$env/static/public';

/**
 * A configured Stellar RPC server instance used to interact with the network.
 */
export const rpc = new Server(PUBLIC_STELLAR_RPC_URL);

/**
 * Transactions are POSTed to our own `/api/send` route, which forwards them on
 * to the OpenZeppelin Relayer Channels service. The Channels API key stays
 * server-side.
 */
export const RELAYER_URL = '/api/send';

/**
 * The smart account client. Wallets are OpenZeppelin smart account contracts,
 * authenticated with WebAuthn passkeys.
 */
export const kit = new SmartAccountKit({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    accountWasmHash: PUBLIC_ACCOUNT_WASM_HASH,
    webauthnVerifierAddress: PUBLIC_WEBAUTHN_VERIFIER_ADDRESS,
    relayerUrl: RELAYER_URL,
    // IndexedDB isn't available while server-rendering, but the kit is only
    // ever driven from the browser anyway.
    storage: browser ? new IndexedDBStorage() : undefined,
    timeoutInSeconds: 30,
});

/**
 * Read an address's native XLM balance by simulating a `balance` call against
 * the native Stellar Asset Contract.
 *
 * @param address - The address whose balance to read
 * @returns The balance, in stroops
 */
export async function getNativeBalance(address: string): Promise<bigint> {
    const transaction = new TransactionBuilder(
        // We use a dummy account for simulation-only transactions.
        new Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0'),
        {
            fee: BASE_FEE,
            networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
        },
    )
        .addOperation(
            new Contract(PUBLIC_NATIVE_TOKEN_CONTRACT).call(
                'balance',
                new Address(address).toScVal(),
            ),
        )
        .setTimeout(30)
        .build();

    const simulation = await rpc.simulateTransaction(transaction);

    if (!Api.isSimulationSuccess(simulation) || !simulation.result) {
        throw new Error('Unable to read balance');
    }

    return scValToNative(simulation.result.retval) as bigint;
}

/**
 * Fetch the value a contract call returned, given the hash of the transaction
 * that made it.
 *
 * The relayer reports a transaction hash rather than the invocation's return
 * value, so anything that needs the return value reads it back from the
 * network afterwards.
 *
 * @param hash - The transaction hash
 * @returns The return value of the contract call
 */
export async function getTransactionReturnValue(hash: string): Promise<xdr.ScVal> {
    const response = await rpc.pollTransaction(hash);

    if (response.status !== Api.GetTransactionStatus.SUCCESS || !response.returnValue) {
        throw new Error(`Transaction ${hash} did not return a value`);
    }

    return response.returnValue;
}
