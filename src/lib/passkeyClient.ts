import { SorobanRpc } from '@stellar/stellar-sdk';
import { PasskeyKit, SACClient } from 'passkey-kit';

import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_FACTORY_CONTRACT_ADDRESS,
    PUBLIC_NATIVE_CONTRACT_ADDRESS,
} from '$env/static/public';

// implement the PasskeyKit client and the native SAC in this file.

// The functions and constants below are utilities to assist in interacting
// between the client and server.
export const rpc = new SorobanRpc.Server(PUBLIC_STELLAR_RPC_URL);

export const sac = new SACClient({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
});

export const native = sac.getSACClient(PUBLIC_NATIVE_CONTRACT_ADDRESS);

export async function send(xdr: string) {
    return fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
            xdr,
        }),
    }).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}

export async function getContractId(signer: string) {
    return fetch(`/api/contract-id/${signer}`).then(async (res) => {
        if (res.ok) return res.text();
        else throw await res.text();
    });
}

export async function fundContract(address: string) {
    return fetch(`/api/fund/${address}`).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}
