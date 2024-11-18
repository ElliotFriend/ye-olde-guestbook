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
    i128,
} from '@stellar/stellar-sdk/contract';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

export const networks = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'CDYMLCNYA6N4DKFHUBYZR76JQTZN5PUOWWCRWHB6GFKVGPXZED5JNYH3',
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

    6: { message: 'NoDonations' },
};

export interface Client {
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Initializes the guestbook with a warm welcome message for prospective
     * signers to read.
     *
     * # Arguments
     *
     * * `admin` - The address which will be the owner and administrator of the
     * guestbook.
     * * `title` - The title or subject of the welcome message.
     * * `text` - The body or contents of the welcome message.
     *
     * # Panics
     *
     * * If the contract is already initialized.
     * * If the `title` argument is empty or missing.
     * * If the `text` argument is empty or missing.
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
     * * If the contract is not initialized.
     * * If the Wasm bytecode is not already installed on-chain.
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
     * * If the contract is not initialized.
     * * If the `title` argument is empty or missing.
     * * If the `text` argument is empty or missing.
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
     * * If the contract is not initialized.
     * * If both the `title` AND `text` arguments are empty or missing.
     * * If there is no authorization from the original message author.
     */
    edit_message: (
        { message_id, title, text }: { message_id: u32; title: string; text: string },
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
     * * If the contract is not initialized.
     * * If the message ID is not associated with a message.
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
     * Read the latest message to be sent to the guestbook.
     *
     * # Panics
     *
     * * If the contract is not initialized.
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
     * * If the contract is not initialized.
     * * If the contract is not holding any donations balance.
     */
    claim_donations: (
        { token }: { token: string },
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
export class Client extends ContractClient {
    constructor(public readonly options: ContractClientOptions) {
        super(
            new ContractSpec([
                'AAAAAAAAAbtJbml0aWFsaXplcyB0aGUgZ3Vlc3Rib29rIHdpdGggYSB3YXJtIHdlbGNvbWUgbWVzc2FnZSBmb3IgcHJvc3BlY3RpdmUKc2lnbmVycyB0byByZWFkLgoKIyBBcmd1bWVudHMKCiogYGFkbWluYCAtIFRoZSBhZGRyZXNzIHdoaWNoIHdpbGwgYmUgdGhlIG93bmVyIGFuZCBhZG1pbmlzdHJhdG9yIG9mIHRoZQpndWVzdGJvb2suCiogYHRpdGxlYCAtIFRoZSB0aXRsZSBvciBzdWJqZWN0IG9mIHRoZSB3ZWxjb21lIG1lc3NhZ2UuCiogYHRleHRgIC0gVGhlIGJvZHkgb3IgY29udGVudHMgb2YgdGhlIHdlbGNvbWUgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBhbHJlYWR5IGluaXRpYWxpemVkLgoqIElmIHRoZSBgdGl0bGVgIGFyZ3VtZW50IGlzIGVtcHR5IG9yIG1pc3NpbmcuCiogSWYgdGhlIGB0ZXh0YCBhcmd1bWVudCBpcyBlbXB0eSBvciBtaXNzaW5nLgAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAABHRleHQAAAAQAAAAAQAAA+kAAAAEAAAAAw==',
                'AAAAAAAAAUFVcGdyYWRlIHRoZSBjb250cmFjdCdzIFdhc20gYnl0ZWNvZGUuCgojIEFyZ3VtZW50cwoKKiBgbmV3X3dhc21faGFzaGAgLSBIYXNoIGlkZW50aWZpZXIgZm9yIHRoZSBieXRlY29kZSB0aGF0IHNob3VsZCBiZQpoZW5jZWZvcnRoIHVzZWQgYnkgdGhpcyBjb250cmFjdC4gVGhlIGJ5dGVjb2RlIG11c3QgYWxyZWFkeSBiZQppbnN0YWxsZWQgYW5kIHByZXNlbnQgb24tY2hhaW4uCgojIFBhbmljcwoKKiBJZiB0aGUgY29udHJhY3QgaXMgbm90IGluaXRpYWxpemVkLgoqIElmIHRoZSBXYXNtIGJ5dGVjb2RlIGlzIG5vdCBhbHJlYWR5IGluc3RhbGxlZCBvbi1jaGFpbi4AAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAAAw==',
                'AAAAAAAAAVpXcml0ZSBhIG1lc3NhZ2UgdG8gdGhlIGd1ZXN0Ym9vay4KCiMgQXJndW1lbnRzCgoqIGBhdXRob3JgIC0gVGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS4KKiBgdGl0bGVgIC0gVGhlIHRpdGxlIG9yIHN1YmplY3Qgb2YgdGhlIGd1ZXN0Ym9vayBtZXNzYWdlLgoqIGB0ZXh0YCAtIFRoZSBib2R5IG9yIGNvbnRlbnRzIG9mIHRoZSBndWVzdGJvb2sgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQuCiogSWYgdGhlIGB0aXRsZWAgYXJndW1lbnQgaXMgZW1wdHkgb3IgbWlzc2luZy4KKiBJZiB0aGUgYHRleHRgIGFyZ3VtZW50IGlzIGVtcHR5IG9yIG1pc3NpbmcuAAAAAAANd3JpdGVfbWVzc2FnZQAAAAAAAAMAAAAAAAAABmF1dGhvcgAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAR0ZXh0AAAAEAAAAAEAAAPpAAAABAAAAAM=',
                'AAAAAAAAAZdFZGl0IGEgc3BlY2lmaWVkIG1lc3NhZ2UgaW4gdGhlIGd1ZXN0Ym9vay4KCiMgQXJndW1lbnRzCgoqIGBtZXNzYWdlX2lkYCAtIFRoZSBJRCBudW1iZXIgb2YgdGhlIG1lc3NhZ2UgdG8gZWRpdC4KKiBgdGl0bGVgIC0gVGhlIHRpdGxlIG9yIHN1YmplY3Qgb2YgdGhlIGd1ZXN0Ym9vayBtZXNzYWdlLgoqIGB0ZXh0YCAtIFRoZSBib2R5IG9yIGNvbnRlbnRzIG9mIHRoZSBndWVzdGJvb2sgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQuCiogSWYgYm90aCB0aGUgYHRpdGxlYCBBTkQgYHRleHRgIGFyZ3VtZW50cyBhcmUgZW1wdHkgb3IgbWlzc2luZy4KKiBJZiB0aGVyZSBpcyBubyBhdXRob3JpemF0aW9uIGZyb20gdGhlIG9yaWdpbmFsIG1lc3NhZ2UgYXV0aG9yLgAAAAAMZWRpdF9tZXNzYWdlAAAAAwAAAAAAAAAKbWVzc2FnZV9pZAAAAAAABAAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAR0ZXh0AAAAEAAAAAEAAAPpAAAD7QAAAAAAAAAD',
                'AAAAAAAAANxSZWFkIGEgc3BlY2lmaWVkIG1lc3NhZ2UgZnJvbSB0aGUgZ3Vlc3Rib29rLgoKIyBBcmd1bWVudHMKCiogYG1lc3NhZ2VfaWRgIC0gVGhlIElEIG51bWJlciBvZiB0aGUgbWVzc2FnZSB0byByZXRyaWV2ZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQuCiogSWYgdGhlIG1lc3NhZ2UgSUQgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIG1lc3NhZ2UuAAAADHJlYWRfbWVzc2FnZQAAAAEAAAAAAAAACm1lc3NhZ2VfaWQAAAAAAAQAAAABAAAD6QAAB9AAAAAHTWVzc2FnZQAAAAAD',
                'AAAAAAAAAGVSZWFkIHRoZSBsYXRlc3QgbWVzc2FnZSB0byBiZSBzZW50IHRvIHRoZSBndWVzdGJvb2suCgojIFBhbmljcwoKKiBJZiB0aGUgY29udHJhY3QgaXMgbm90IGluaXRpYWxpemVkLgAAAAAAAAtyZWFkX2xhdGVzdAAAAAAAAAAAAQAAA+kAAAfQAAAAB01lc3NhZ2UAAAAAAw==',
                'AAAAAAAAAKtDbGFpbSBhbnkgZG9uYXRpb25zIHRoYXQgaGF2ZSBiZWVuIG1hZGUgdG8gdGhlIGd1ZXN0Ym9vayBjb250cmFjdC4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQuCiogSWYgdGhlIGNvbnRyYWN0IGlzIG5vdCBob2xkaW5nIGFueSBkb25hdGlvbnMgYmFsYW5jZS4AAAAAD2NsYWltX2RvbmF0aW9ucwAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAD6QAAAAsAAAAD',
                'AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMTWVzc2FnZUNvdW50AAAAAQAAAAAAAAAHTWVzc2FnZQAAAAABAAAABA==',
                'AAAAAQAAAAAAAAAAAAAAB01lc3NhZ2UAAAAABAAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAZsZWRnZXIAAAAAAAQAAAAAAAAABHRleHQAAAAQAAAAAAAAAAV0aXRsZQAAAAAAABA=',
                'AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABgAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAgAAAAAAAAAOSW52YWxpZE1lc3NhZ2UAAAAAAAMAAAAAAAAADU5vU3VjaE1lc3NhZ2UAAAAAAAAEAAAAAAAAABJVbmF1dGhvcml6ZWRUb0VkaXQAAAAAAAUAAAAAAAAAC05vRG9uYXRpb25zAAAAAAY=',
            ]),
            options,
        );
    }
    public readonly fromJSON = {
        initialize: this.txFromJSON<Result<u32>>,
        upgrade: this.txFromJSON<Result<void>>,
        write_message: this.txFromJSON<Result<u32>>,
        edit_message: this.txFromJSON<Result<void>>,
        read_message: this.txFromJSON<Result<Message>>,
        read_latest: this.txFromJSON<Result<Message>>,
        claim_donations: this.txFromJSON<Result<i128>>,
    };
}
