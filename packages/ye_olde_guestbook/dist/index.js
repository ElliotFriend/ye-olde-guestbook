import { Buffer } from 'buffer';
import { Client as ContractClient, Spec as ContractSpec } from '@stellar/stellar-sdk/contract';
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
        contractId: 'CDNMYIT7G6QZ7WQAYOD3DMZ7IEQRZYUHI6MD67AOP2CBJXTKP6NCBOOK',
    },
};
export const Errors = {
    1: { message: 'InvalidMessage' },
    2: { message: 'NoSuchMessage' },
    3: { message: 'UnauthorizedToEdit' },
    4: { message: 'NoDonations' },
};
export class Client extends ContractClient {
    options;
    static async deploy(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        { admin, title, text },
        /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
        options,
    ) {
        return ContractClient.deploy({ admin, title, text }, options);
    }
    constructor(options) {
        super(
            new ContractSpec([
                'AAAAAAAAAZFJbml0aWFsaXplcyB0aGUgZ3Vlc3Rib29rIHdpdGggYSB3YXJtIHdlbGNvbWUgbWVzc2FnZSBmb3IgcHJvc3BlY3RpdmUKc2lnbmVycyB0byByZWFkLgoKIyBBcmd1bWVudHMKCiogYGFkbWluYCAtIFRoZSBhZGRyZXNzIHdoaWNoIHdpbGwgYmUgdGhlIG93bmVyIGFuZCBhZG1pbmlzdHJhdG9yIG9mIHRoZQpndWVzdGJvb2suCiogYHRpdGxlYCAtIFRoZSB0aXRsZSBvciBzdWJqZWN0IG9mIHRoZSB3ZWxjb21lIG1lc3NhZ2UuCiogYHRleHRgIC0gVGhlIGJvZHkgb3IgY29udGVudHMgb2YgdGhlIHdlbGNvbWUgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBgdGl0bGVgIGFyZ3VtZW50IGlzIGVtcHR5IG9yIG1pc3NpbmcuCiogSWYgdGhlIGB0ZXh0YCBhcmd1bWVudCBpcyBlbXB0eSBvciBtaXNzaW5nLgAAAAAAAA1fX2NvbnN0cnVjdG9yAAAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAABHRleHQAAAAQAAAAAQAAA+kAAAPtAAAAAAAAAAM=',
                'AAAAAAAAARtVcGdyYWRlIHRoZSBjb250cmFjdCdzIFdhc20gYnl0ZWNvZGUuCgojIEFyZ3VtZW50cwoKKiBgbmV3X3dhc21faGFzaGAgLSBIYXNoIGlkZW50aWZpZXIgZm9yIHRoZSBieXRlY29kZSB0aGF0IHNob3VsZCBiZQpoZW5jZWZvcnRoIHVzZWQgYnkgdGhpcyBjb250cmFjdC4gVGhlIGJ5dGVjb2RlIG11c3QgYWxyZWFkeSBiZQppbnN0YWxsZWQgYW5kIHByZXNlbnQgb24tY2hhaW4uCgojIFBhbmljcwoKKiBJZiB0aGUgV2FzbSBieXRlY29kZSBpcyBub3QgYWxyZWFkeSBpbnN0YWxsZWQgb24tY2hhaW4uAAAAAAd1cGdyYWRlAAAAAAEAAAAAAAAADW5ld193YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAEAAAPpAAAD7QAAAAAAAAAD',
                'AAAAAAAAATRXcml0ZSBhIG1lc3NhZ2UgdG8gdGhlIGd1ZXN0Ym9vay4KCiMgQXJndW1lbnRzCgoqIGBhdXRob3JgIC0gVGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS4KKiBgdGl0bGVgIC0gVGhlIHRpdGxlIG9yIHN1YmplY3Qgb2YgdGhlIGd1ZXN0Ym9vayBtZXNzYWdlLgoqIGB0ZXh0YCAtIFRoZSBib2R5IG9yIGNvbnRlbnRzIG9mIHRoZSBndWVzdGJvb2sgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBgdGl0bGVgIGFyZ3VtZW50IGlzIGVtcHR5IG9yIG1pc3NpbmcuCiogSWYgdGhlIGB0ZXh0YCBhcmd1bWVudCBpcyBlbXB0eSBvciBtaXNzaW5nLgAAAA13cml0ZV9tZXNzYWdlAAAAAAAAAwAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAABHRleHQAAAAQAAAAAQAAA+kAAAAEAAAAAw==',
                'AAAAAAAAAXFFZGl0IGEgc3BlY2lmaWVkIG1lc3NhZ2UgaW4gdGhlIGd1ZXN0Ym9vay4KCiMgQXJndW1lbnRzCgoqIGBtZXNzYWdlX2lkYCAtIFRoZSBJRCBudW1iZXIgb2YgdGhlIG1lc3NhZ2UgdG8gZWRpdC4KKiBgdGl0bGVgIC0gVGhlIHRpdGxlIG9yIHN1YmplY3Qgb2YgdGhlIGd1ZXN0Ym9vayBtZXNzYWdlLgoqIGB0ZXh0YCAtIFRoZSBib2R5IG9yIGNvbnRlbnRzIG9mIHRoZSBndWVzdGJvb2sgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIGJvdGggdGhlIGB0aXRsZWAgQU5EIGB0ZXh0YCBhcmd1bWVudHMgYXJlIGVtcHR5IG9yIG1pc3NpbmcuCiogSWYgdGhlcmUgaXMgbm8gYXV0aG9yaXphdGlvbiBmcm9tIHRoZSBvcmlnaW5hbCBtZXNzYWdlIGF1dGhvci4AAAAAAAAMZWRpdF9tZXNzYWdlAAAAAwAAAAAAAAAKbWVzc2FnZV9pZAAAAAAABAAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAR0ZXh0AAAAEAAAAAEAAAPpAAAD7QAAAAAAAAAD',
                'AAAAAAAAALZSZWFkIGEgc3BlY2lmaWVkIG1lc3NhZ2UgZnJvbSB0aGUgZ3Vlc3Rib29rLgoKIyBBcmd1bWVudHMKCiogYG1lc3NhZ2VfaWRgIC0gVGhlIElEIG51bWJlciBvZiB0aGUgbWVzc2FnZSB0byByZXRyaWV2ZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBtZXNzYWdlIElEIGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYSBtZXNzYWdlLgAAAAAADHJlYWRfbWVzc2FnZQAAAAEAAAAAAAAACm1lc3NhZ2VfaWQAAAAAAAQAAAABAAAD6QAAB9AAAAAHTWVzc2FnZQAAAAAD',
                'AAAAAAAAADRSZWFkIHRoZSBsYXRlc3QgbWVzc2FnZSB0byBiZSBzZW50IHRvIHRoZSBndWVzdGJvb2suAAAAC3JlYWRfbGF0ZXN0AAAAAAAAAAABAAAD6QAAB9AAAAAHTWVzc2FnZQAAAAAD',
                'AAAAAAAAAIVDbGFpbSBhbnkgZG9uYXRpb25zIHRoYXQgaGF2ZSBiZWVuIG1hZGUgdG8gdGhlIGd1ZXN0Ym9vayBjb250cmFjdC4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBub3QgaG9sZGluZyBhbnkgZG9uYXRpb25zIGJhbGFuY2UuAAAAAAAAD2NsYWltX2RvbmF0aW9ucwAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABMAAAABAAAD6QAAAAsAAAAD',
                'AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMTWVzc2FnZUNvdW50AAAAAQAAAAAAAAAHTWVzc2FnZQAAAAABAAAABA==',
                'AAAAAQAAAAAAAAAAAAAAB01lc3NhZ2UAAAAABAAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAZsZWRnZXIAAAAAAAQAAAAAAAAABHRleHQAAAAQAAAAAAAAAAV0aXRsZQAAAAAAABA=',
                'AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAOSW52YWxpZE1lc3NhZ2UAAAAAAAEAAAAAAAAADU5vU3VjaE1lc3NhZ2UAAAAAAAACAAAAAAAAABJVbmF1dGhvcml6ZWRUb0VkaXQAAAAAAAMAAAAAAAAAC05vRG9uYXRpb25zAAAAAAQ=',
            ]),
            options,
        );
        this.options = options;
    }
    fromJSON = {
        upgrade: this.txFromJSON,
        write_message: this.txFromJSON,
        edit_message: this.txFromJSON,
        read_message: this.txFromJSON,
        read_latest: this.txFromJSON,
        claim_donations: this.txFromJSON,
    };
}
