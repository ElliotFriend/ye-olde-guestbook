/// <reference types="node" resolution-mode="require"/>
import { Buffer } from 'buffer';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    Result,
} from '@stellar/stellar-sdk/contract';
import type { u32 } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: 'Test SDF Network ; September 2015';
        readonly contractId: 'CBA4XYVW2VFIO3DPUURBXWUROJGSCWVNVYZTXZ6RJCXJVJQYYDH45MH6';
    };
};
export type DataKey =
    | {
          tag: 'Admin';
          values: void;
      }
    | {
          tag: 'MessageCount';
          values: void;
      }
    | {
          tag: 'Message';
          values: readonly [u32];
      };
export interface Message {
    author: string;
    ledger: u32;
    text: string;
    title: string;
}
export declare const Errors: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    4: {
        message: string;
    };
    5: {
        message: string;
    };
};
export interface Client {
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    initialize: (
        {
            admin,
            title,
            text,
        }: {
            admin: string;
            title: string;
            text: string;
        },
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
        {
            new_wasm_hash,
        }: {
            new_wasm_hash: Buffer;
        },
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
        {
            author,
            title,
            text,
        }: {
            author: string;
            title: string;
            text: string;
        },
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
        {
            message_id,
        }: {
            message_id: u32;
        },
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
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        initialize: (
            json: string,
        ) => AssembledTransaction<
            Result<number, import('@stellar/stellar-sdk/contract').ErrorMessage>
        >;
        upgrade: (
            json: string,
        ) => AssembledTransaction<
            Result<void, import('@stellar/stellar-sdk/contract').ErrorMessage>
        >;
        write_message: (
            json: string,
        ) => AssembledTransaction<
            Result<number, import('@stellar/stellar-sdk/contract').ErrorMessage>
        >;
        read_message: (
            json: string,
        ) => AssembledTransaction<
            Result<Message, import('@stellar/stellar-sdk/contract').ErrorMessage>
        >;
        read_latest: (
            json: string,
        ) => AssembledTransaction<
            Result<Message, import('@stellar/stellar-sdk/contract').ErrorMessage>
        >;
    };
}
