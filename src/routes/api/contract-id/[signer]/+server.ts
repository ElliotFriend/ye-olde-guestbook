import { error } from '@sveltejs/kit';
// import { server } from '$lib/server/passkeyServer';
import type { RequestHandler } from './$types';
import { PUBLIC_SUPERPEACH_URL } from '$env/static/public';

export const GET: RequestHandler = async ({ params }) => {
    // await server.setMercuryJwt();
    // const contractId = await server.getContractId(params.signer!);

    // Just use superpeach's API for the time-being, because server.getContractId
    // keeps throwing errors on me.
    const res = await fetch(`${PUBLIC_SUPERPEACH_URL}/api/contract-id/${params.signer!}`);
    if (!res.ok) {
        error(404, {
            message: 'Contract not found',
        });
    }
    const contractId = await res.text();

    return new Response(String(contractId));
};
