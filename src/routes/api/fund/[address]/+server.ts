import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

import { Keypair } from '@stellar/stellar-sdk';
import { basicNodeSigner } from '@stellar/stellar-sdk/contract';
import { native } from '$lib/passkeyClient';

import { PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';
import { PRIVATE_FUNDER_SECRET_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ params, fetch }) => {
    const fundKeypair = Keypair.fromSecret(PRIVATE_FUNDER_SECRET_KEY);
    const fundSigner = basicNodeSigner(fundKeypair, PUBLIC_STELLAR_NETWORK_PASSPHRASE);

    try {
        // build a transfer invocation, sending 25 XLM to the address provided
        const { built, ...transfer } = await native.transfer({
            from: fundKeypair.publicKey(),
            to: params.address,
            amount: BigInt(25 * 10_000_000),
        });

        // sign the auth entry in the operation, so we aren't depending on the
        // transaction source for authorization to send XLM. this lets us...
        await transfer.signAuthEntries({
            address: fundKeypair.publicKey(),
            signAuthEntry: (auth) => fundSigner.signAuthEntry(auth),
        });

        // send the transaction via Launchtube. see, even our server-side
        // transactions can benefit from this!
        await fetch('/api/send', {
            method: 'POST',
            body: JSON.stringify({
                xdr: built!.toXDR(),
            }),
        });

        // return a success message
        return json({
            status: 200,
            message: 'Smart wallet successfully funded',
        });
    } catch (err) {
        // throw an error
        console.error(err);
        error(500, {
            message: 'Error when funding smart wallet',
        });
    }
};
