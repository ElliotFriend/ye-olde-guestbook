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
        contractId: 'CBA4XYVW2VFIO3DPUURBXWUROJGSCWVNVYZTXZ6RJCXJVJQYYDH45MH6',
    },
};
export const Errors = {
    1: { message: 'NotInitialized' },
    2: { message: 'AlreadyInitialized' },
    3: { message: 'InvalidMessage' },
    4: { message: 'NoSuchMessage' },
    5: { message: 'UnauthorizedToEdit' },
};
export class Client extends ContractClient {
    options;
    constructor(options) {
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
        this.options = options;
    }
    fromJSON = {
        initialize: this.txFromJSON,
        upgrade: this.txFromJSON,
        write_message: this.txFromJSON,
        read_message: this.txFromJSON,
        read_latest: this.txFromJSON,
    };
}
