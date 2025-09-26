import { Buffer } from 'buffer';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    MethodOptions,
    Result,
} from '@stellar/stellar-sdk/contract';
import type { u32, i128 } from '@stellar/stellar-sdk/contract';
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: 'Test SDF Network ; September 2015';
        readonly contractId: 'CDNMYIT7G6QZ7WQAYOD3DMZ7IEQRZYUHI6MD67AOP2CBJXTKP6NCBOOK';
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
};
export interface Client {
    /**
     * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Upgrade the contract's Wasm bytecode.
     *
     * # Arguments
     *
     * * `new_wasm_hash` - Hash identifier for the bytecode that should be
     * henceforth used by this contract. The bytecode must already be
     * installed and present on-chain.
     *
     * # Panics
     *
     * * If the Wasm bytecode is not already installed on-chain.
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
     * Write a message to the guestbook.
     *
     * # Arguments
     *
     * * `author` - The sender of the message.
     * * `title` - The title or subject of the guestbook message.
     * * `text` - The body or contents of the guestbook message.
     *
     * # Panics
     *
     * * If the `title` argument is empty or missing.
     * * If the `text` argument is empty or missing.
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
     * Construct and simulate a edit_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Edit a specified message in the guestbook.
     *
     * # Arguments
     *
     * * `message_id` - The ID number of the message to edit.
     * * `title` - The title or subject of the guestbook message.
     * * `text` - The body or contents of the guestbook message.
     *
     * # Panics
     *
     * * If both the `title` AND `text` arguments are empty or missing.
     * * If there is no authorization from the original message author.
     */
    edit_message: (
        {
            message_id,
            title,
            text,
        }: {
            message_id: u32;
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
    ) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a read_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Read a specified message from the guestbook.
     *
     * # Arguments
     *
     * * `message_id` - The ID number of the message to retrieve.
     *
     * # Panics
     *
     * * If the message ID is not associated with a message.
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
     * Read the latest message to be sent to the guestbook.
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
    /**
     * Construct and simulate a claim_donations transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Claim any donations that have been made to the guestbook contract.
     *
     * # Panics
     *
     * * If the contract is not holding any donations balance.
     */
    claim_donations: (
        {
            token,
        }: {
            token: string;
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
    ) => Promise<AssembledTransaction<Result<i128>>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {
            admin,
            title,
            text,
        }: {
            admin: string;
            title: string;
            text: string;
        },
        /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
        options: MethodOptions &
            Omit<ContractClientOptions, 'contractId'> & {
                /** The hash of the Wasm blob, which must already be installed on-chain. */
                wasmHash: Buffer | string;
                /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
                salt?: Buffer | Uint8Array;
                /** The format used to decode `wasmHash`, if it's provided as a string. */
                format?: 'hex' | 'base64';
            },
    ): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
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
        edit_message: (
            json: string,
        ) => AssembledTransaction<
            Result<void, import('@stellar/stellar-sdk/contract').ErrorMessage>
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
        claim_donations: (
            json: string,
        ) => AssembledTransaction<
            Result<bigint, import('@stellar/stellar-sdk/contract').ErrorMessage>
        >;
    };
}
