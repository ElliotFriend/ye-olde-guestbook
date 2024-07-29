import { Account, Keypair, SorobanRpc, StrKey } from '@stellar/stellar-sdk';
import { Buffer } from 'buffer';
import { PasskeyKit, SACClient } from 'passkey-kit';

import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_FACTORY_CONTRACT_ADDRESS,
    PUBLIC_NATIVE_CONTRACT_ADDRESS,
} from '$env/static/public';

export const rpc = new SorobanRpc.Server(PUBLIC_STELLAR_RPC_URL);

export const mockPubkey = StrKey.encodeEd25519PublicKey(Buffer.alloc(32));
export const mockSource = new Account(mockPubkey, '0');

export const account = new PasskeyKit({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    factoryContractId: PUBLIC_FACTORY_CONTRACT_ADDRESS,
});

export const fundKeypair = new Promise<Keypair>(async (resolve) => {
    const now = new Date();

    now.setMinutes(0, 0, 0);

    const nowData = new TextEncoder().encode(now.getTime().toString());
    const hashBuffer = crypto.subtle
        ? await crypto.subtle.digest('SHA-256', nowData)
        : crypto.getRandomValues(new Uint8Array(32));
    const keypair = Keypair.fromRawEd25519Seed(Buffer.from(hashBuffer));

    rpc.requestAirdrop(keypair.publicKey())
        .then(console.log)
        .catch(() => {});

    resolve(keypair);
});
// export const fundPubkey = (await fundKeypair).publicKey()
// export const fundSigner = basicNodeSigner(await fundKeypair, PUBLIC_STELLAR_NETWORK_PASSPHRASE)

export const sac = new SACClient({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
});
export const native = sac.getSACClient(PUBLIC_NATIVE_CONTRACT_ADDRESS);

// export async function fund(to: string) {
//     try {
//         const { built, ...transfer } = await native.transfer({
//             to,
//             from: fundPubkey,
//             amount: BigInt(1000 * 10_000_000),
//         })

//         await transfer.signAuthEntries({
//             publicKey: fundPubkey,
//             signAuthEntry: (auth) => fundSigner.signAuthEntry(auth)
//         })

//         const res = await send(built!.toXDR());

//         console.log(res)
//     } catch (err) {
//         console.error(err)
//     }
// }

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
