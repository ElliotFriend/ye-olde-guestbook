import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CCI3ZI5J45L2NPJOINBTO2IB42HMXXHEY5N6Q4JLLCGAW27SCUOHMBTO",
    }
};
export const Errors = {
    1: { message: "NotInitialized" },
    2: { message: "AlreadyInitialized" },
    3: { message: "InvalidMessage" },
    4: { message: "NoSuchMessage" },
    5: { message: "UnauthorizedToEdit" }
};
export class Client extends ContractClient {
    options;
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAbtJbml0aWFsaXplcyB0aGUgZ3Vlc3Rib29rIHdpdGggYSB3YXJtIHdlbGNvbWUgbWVzc2FnZSBmb3IgcHJvc3BlY3RpdmUKc2lnbmVycyB0byByZWFkLgoKIyBBcmd1bWVudHMKCiogYGFkbWluYCAtIFRoZSBhZGRyZXNzIHdoaWNoIHdpbGwgYmUgdGhlIG93bmVyIGFuZCBhZG1pbmlzdHJhdG9yIG9mIHRoZQpndWVzdGJvb2suCiogYHRpdGxlYCAtIFRoZSB0aXRsZSBvciBzdWJqZWN0IG9mIHRoZSB3ZWxjb21lIG1lc3NhZ2UuCiogYHRleHRgIC0gVGhlIGJvZHkgb3IgY29udGVudHMgb2YgdGhlIHdlbGNvbWUgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBhbHJlYWR5IGluaXRpYWxpemVkLgoqIElmIHRoZSBgdGl0bGVgIGFyZ3VtZW50IGlzIGVtcHR5IG9yIG1pc3NpbmcuCiogSWYgdGhlIGB0ZXh0YCBhcmd1bWVudCBpcyBlbXB0eSBvciBtaXNzaW5nLgAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAV0aXRsZQAAAAAAABAAAAAAAAAABHRleHQAAAAQAAAAAQAAA+kAAAAEAAAAAw==",
            "AAAAAAAAAUFVcGdyYWRlIHRoZSBjb250cmFjdCdzIFdhc20gYnl0ZWNvZGUuCgojIEFyZ3VtZW50cwoKKiBgbmV3X3dhc21faGFzaGAgLSBIYXNoIGlkZW50aWZpZXIgZm9yIHRoZSBieXRlY29kZSB0aGF0IHNob3VsZCBiZQpoZW5jZWZvcnRoIHVzZWQgYnkgdGhpcyBjb250cmFjdC4gVGhlIGJ5dGVjb2RlIG11c3QgYWxyZWFkeSBiZQppbnN0YWxsZWQgYW5kIHByZXNlbnQgb24tY2hhaW4uCgojIFBhbmljcwoKKiBJZiB0aGUgY29udHJhY3QgaXMgbm90IGluaXRpYWxpemVkLgoqIElmIHRoZSBXYXNtIGJ5dGVjb2RlIGlzIG5vdCBhbHJlYWR5IGluc3RhbGxlZCBvbi1jaGFpbi4AAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAVpXcml0ZSBhIG1lc3NhZ2UgdG8gdGhlIGd1ZXN0Ym9vay4KCiMgQXJndW1lbnRzCgoqIGBhdXRob3JgIC0gVGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS4KKiBgdGl0bGVgIC0gVGhlIHRpdGxlIG9yIHN1YmplY3Qgb2YgdGhlIGd1ZXN0Ym9vayBtZXNzYWdlLgoqIGB0ZXh0YCAtIFRoZSBib2R5IG9yIGNvbnRlbnRzIG9mIHRoZSBndWVzdGJvb2sgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQuCiogSWYgdGhlIGB0aXRsZWAgYXJndW1lbnQgaXMgZW1wdHkgb3IgbWlzc2luZy4KKiBJZiB0aGUgYHRleHRgIGFyZ3VtZW50IGlzIGVtcHR5IG9yIG1pc3NpbmcuAAAAAAANd3JpdGVfbWVzc2FnZQAAAAAAAAMAAAAAAAAABmF1dGhvcgAAAAAAEwAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAR0ZXh0AAAAEAAAAAEAAAPpAAAABAAAAAM=",
            "AAAAAAAAAZdFZGl0IGEgc3BlY2lmaWVkIG1lc3NhZ2UgaW4gdGhlIGd1ZXN0Ym9vay4KCiMgQXJndW1lbnRzCgoqIGBtZXNzYWdlX2lkYCAtIFRoZSBJRCBudW1iZXIgb2YgdGhlIG1lc3NhZ2UgdG8gZWRpdC4KKiBgdGl0bGVgIC0gVGhlIHRpdGxlIG9yIHN1YmplY3Qgb2YgdGhlIGd1ZXN0Ym9vayBtZXNzYWdlLgoqIGB0ZXh0YCAtIFRoZSBib2R5IG9yIGNvbnRlbnRzIG9mIHRoZSBndWVzdGJvb2sgbWVzc2FnZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQuCiogSWYgYm90aCB0aGUgYHRpdGxlYCBBTkQgYHRleHRgIGFyZ3VtZW50cyBhcmUgZW1wdHkgb3IgbWlzc2luZy4KKiBJZiB0aGVyZSBpcyBubyBhdXRob3JpemF0aW9uIGZyb20gdGhlIG9yaWdpbmFsIG1lc3NhZ2UgYXV0aG9yLgAAAAAMZWRpdF9tZXNzYWdlAAAAAwAAAAAAAAAKbWVzc2FnZV9pZAAAAAAABAAAAAAAAAAFdGl0bGUAAAAAAAAQAAAAAAAAAAR0ZXh0AAAAEAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAANxSZWFkIGEgc3BlY2lmaWVkIG1lc3NhZ2UgZnJvbSB0aGUgZ3Vlc3Rib29rLgoKIyBBcmd1bWVudHMKCiogYG1lc3NhZ2VfaWRgIC0gVGhlIElEIG51bWJlciBvZiB0aGUgbWVzc2FnZSB0byByZXRyaWV2ZS4KCiMgUGFuaWNzCgoqIElmIHRoZSBjb250cmFjdCBpcyBub3QgaW5pdGlhbGl6ZWQuCiogSWYgdGhlIG1lc3NhZ2UgSUQgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIG1lc3NhZ2UuAAAADHJlYWRfbWVzc2FnZQAAAAEAAAAAAAAACm1lc3NhZ2VfaWQAAAAAAAQAAAABAAAD6QAAB9AAAAAHTWVzc2FnZQAAAAAD",
            "AAAAAAAAAGVSZWFkIHRoZSBsYXRlc3QgbWVzc2FnZSB0byBiZSBzZW50IHRvIHRoZSBndWVzdGJvb2suCgojIFBhbmljcwoKKiBJZiB0aGUgY29udHJhY3QgaXMgbm90IGluaXRpYWxpemVkLgAAAAAAAAtyZWFkX2xhdGVzdAAAAAAAAAAAAQAAA+kAAAfQAAAAB01lc3NhZ2UAAAAAAw==",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMTWVzc2FnZUNvdW50AAAAAQAAAAAAAAAHTWVzc2FnZQAAAAABAAAABA==",
            "AAAAAQAAAAAAAAAAAAAAB01lc3NhZ2UAAAAABAAAAAAAAAAGYXV0aG9yAAAAAAATAAAAAAAAAAZsZWRnZXIAAAAAAAQAAAAAAAAABHRleHQAAAAQAAAAAAAAAAV0aXRsZQAAAAAAABA=",
            "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABQAAAAAAAAAOTm90SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAgAAAAAAAAAOSW52YWxpZE1lc3NhZ2UAAAAAAAMAAAAAAAAADU5vU3VjaE1lc3NhZ2UAAAAAAAAEAAAAAAAAABJVbmF1dGhvcml6ZWRUb0VkaXQAAAAAAAU="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        upgrade: (this.txFromJSON),
        write_message: (this.txFromJSON),
        edit_message: (this.txFromJSON),
        read_message: (this.txFromJSON),
        read_latest: (this.txFromJSON)
    };
}
