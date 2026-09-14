import { Server, Api } from '@stellar/stellar-sdk/rpc';
import {
    Account,
    Address,
    BASE_FEE,
    Contract,
    TransactionBuilder,
    scValToNative,
} from '@stellar/stellar-sdk';
import {
    SmartAccountKit,
    IndexedDBStorage,
    WalletAmbiguousError,
    WalletCodeNotAcceptedError,
    WalletOwnershipError,
    WalletProvenanceError,
} from 'smart-account-kit';
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
 * The smart account client. Wallets are OpenZeppelin smart account contracts,
 * authenticated with WebAuthn passkeys.
 */
export const account = new SmartAccountKit({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    accountWasmHash: PUBLIC_ACCOUNT_WASM_HASH,
    webauthnVerifierAddress: PUBLIC_WEBAUTHN_VERIFIER_ADDRESS,
    // Transactions are POSTed to our own `/api/send` route, which forwards them
    // on to the OpenZeppelin Relayer Channels service. The Channels API key
    // stays server-side.
    relayerUrl: '/api/send',
    // IndexedDB isn't available while server-rendering, but the kit is only
    // ever driven from the browser anyway.
    storage: browser ? new IndexedDBStorage() : undefined,
    // the "relying-party" name will be displayed in the passkey prompt from the
    // user's authenticator
    rpName: 'Ye Olde Guestbook',
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
 * Turn one of the kit's fail-closed connection errors into something we can
 * actually show a user.
 *
 * `connectWallet()` verifies how a wallet was created, what code it runs, and
 * that the passkey is a live signer on it. A failed check throws instead of
 * connecting, and most of those are not worth retrying with the same passkey.
 *
 * @param err - The error thrown by `connectWallet()`
 * @returns A toast title and description, or `null` if this wasn't a
 * connection-verification failure and the caller should fall back to its own
 * generic message
 */
export function describeConnectionError(
    err: unknown,
): { title: string; description: string } | null {
    if (err instanceof WalletAmbiguousError) {
        return {
            title: 'More than one wallet',
            description:
                'This passkey is registered to several smart accounts, and the guestbook has no way to ask which one you meant. Try the passkey you created here.',
        };
    }

    if (err instanceof WalletOwnershipError) {
        return {
            title: 'Passkey not recognized',
            description:
                "This passkey isn't a live signer on that smart account. Log in with the passkey you used when you signed up.",
        };
    }

    if (err instanceof WalletProvenanceError) {
        // This one is genuinely ambiguous. It covers a wallet whose creation
        // history failed verification (permanent) and an indexer that is
        // incomplete or lagging the network (transient), so the copy has to
        // leave room for waiting it out.
        return {
            title: "Couldn't verify this wallet",
            description:
                'We could not confirm how this smart account was created. If you just signed up, the indexer may still be catching up, so give it a moment and try again.',
        };
    }

    if (err instanceof WalletCodeNotAcceptedError) {
        return {
            title: 'Unsupported wallet',
            description:
                'That smart account runs contract code this app does not accept, which usually means it was upgraded elsewhere.',
        };
    }

    return null;
}

/**
 * Figure out if authenticating with a passkey was simply the user
 * dismissing the prompt. This can present itself in a few different ways,
 * depending on a user's computer/browser/etc.
 */
export function userDismissedPasskey(err: unknown): boolean {
    const nameOf = (e: unknown) => (e as { name?: string } | null)?.name;
    const name = nameOf(err) ?? nameOf((err as { cause?: unknown } | null)?.cause);
    return name === 'NotAllowedError' || name === 'AbortError';
}
