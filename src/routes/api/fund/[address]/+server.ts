import { error, json } from '@sveltejs/kit';
import { PRIVATE_FUNDER_SECRET_KEY } from '$env/static/private';
import { native } from '$lib/passkeyClient';
import type { RequestHandler } from './$types';
import { Keypair } from '@stellar/stellar-sdk';
import { basicNodeSigner } from '@stellar/stellar-sdk/contract';
import { PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';

export const GET: RequestHandler = async ({ params, fetch }) => {
    const fundKeypair = Keypair.fromSecret(PRIVATE_FUNDER_SECRET_KEY);
    const fundSigner = basicNodeSigner(fundKeypair, PUBLIC_STELLAR_NETWORK_PASSPHRASE);

    try {
        const { built, ...transfer } = await native.transfer({
            from: fundKeypair.publicKey(),
            to: params.address,
            amount: BigInt(25 * 10_000_000),
        });

        await transfer.signAuthEntries({
            address: fundKeypair.publicKey(),
            signAuthEntry: (auth) => fundSigner.signAuthEntry(auth),
        });

        await fetch('/api/send', {
            method: 'POST',
            body: JSON.stringify({
                xdr: built!.toXDR(),
            }),
        });

        return json({
            status: 200,
            message: 'Smart wallet successfully funded',
        });
    } catch (err) {
        console.error(err);
        error(500, {
            message: 'Error when funding smart wallet',
        });
    }
};
