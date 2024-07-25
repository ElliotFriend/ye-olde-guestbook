import { Buffer } from 'buffer';
import { Address } from '@stellar/stellar-sdk';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    Result,
    Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
    u32,
    i32,
    u64,
    i64,
    u128,
    i128,
    u256,
    i256,
    Option,
    Typepoint,
    Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

export const networks = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'CBA4XYVW2VFIO3DPUURBXWUROJGSCWVNVYZTXZ6RJCXJVJQYYDH45MH6',
    },
} as const;

export type DataKey =
    | { tag: 'Admin'; values: void }
    | { tag: 'MessageCount'; values: void }
    | { tag: 'Message'; values: readonly [u32] };

export interface Message {
    author: string;
    ledger: u32;
    text: string;
    title: string;
}

export const Errors = {
    1: { message: 'NotInitialized' },

    2: { message: 'AlreadyInitialized' },

    3: { message: 'InvalidMessage' },

    4: { message: 'NoSuchMessage' },

    5: { message: 'UnauthorizedToEdit' },
};

export interface Client {
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    initialize: (
        { admin, title, text }: { admin: string; title: string; text: string },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;

            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;

            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<Result<u32>>>;

    /**
     * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    upgrade: (
        { new_wasm_hash }: { new_wasm_hash: Buffer },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;

            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;

            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<Result<void>>>;

    /**
     * Construct and simulate a write_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    write_message: (
        { author, title, text }: { author: string; title: string; text: string },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;

            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;

            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<Result<u32>>>;

    /**
     * Construct and simulate a read_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    read_message: (
        { message_id }: { message_id: u32 },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;

            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;

            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<Result<Message>>>;

    /**
     * Construct and simulate a read_latest transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    read_latest: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;

        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;

        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<Message>>>;
}
export class Client extends ContractClient {
    constructor(public readonly options: ContractClientOptions) {
        super(
            new ContractSpec([
                'AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAABHRleHQAAAAQAAAAAQAAA+kAAAAEAAAAAw==',
                'AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAAAw==',
                'AAAAAAAAAAAAAAANd3JpdGVfbWVzc2FnZQAAAAAAAAMAAAAAAAAABmF1dGhvcgAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAR0ZXh0AAAAEAAAAAEAAAPpAAAABAAAAAM=',
                'AAAAAAAAAAAAAAAMcmVhZF9tZXNzYWdlAAAAAQAAAAAAAAAKbWVzc2FnZV9pZAAAAAAABAAAAAEAAAPpAAAH0AAAAAdNZXNzYWdlAAAAAAM=',
                'AAAAAAAAAAAAAAALcmVhZF9sYXRlc3QAAAAAAAAAAAEAAAPpAAAH0AAAAAdNZXNzYWdlAAAAAAM=',
                'AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMTWVzc2FnZUNvdW50AAAAAQAAAAAAAAAHTWVzc2FnZQAAAAABAAAABA==',
                'AAAAAQAAAAAAAAAAAAAAB01lc3NhZ2UAAAAABAAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAZsZWRnZXIAAAAAAAQAAAAAAAAABHRleHQAAAAQAAAAAAAAAAV0aXRsZQAAAAAAABA=',
                'AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABQAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAgAAAAAAAAAOSW52YWxpZE1lc3NhZ2UAAAAAAAMAAAAAAAAADU5vU3VjaE1lc3NhZ2UAAAAAAAAEAAAAAAAAABJVbmF1dGhvcml6ZWRUb0VkaXQAAAAAAAU=',
            ]),
            options,
        );
    }
    public readonly fromJSON = {
        initialize: this.txFromJSON<Result<u32>>,
        upgrade: this.txFromJSON<Result<void>>,
        write_message: this.txFromJSON<Result<u32>>,
        read_message: this.txFromJSON<Result<Message>>,
        read_latest: this.txFromJSON<Result<Message>>,
    };
}
