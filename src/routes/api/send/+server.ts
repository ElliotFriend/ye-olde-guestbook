import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

import { PUBLIC_OZ_CHANNELS_URL } from '$env/static/public';
import { PRIVATE_OZ_CHANNELS_API_KEY } from '$env/static/private';

/**
 * The smart account kit POSTs either `{ func, auth }` (the usual Soroban path)
 * or `{ xdr }` (a fully signed envelope) to this endpoint. It deliberately
 * sends no credentials, because it runs in the browser. This route adds the
 * OpenZeppelin Relayer Channels API key and forwards the request on, so the
 * key never leaves the server.
 */
export const POST: RequestHandler = async ({ request, fetch }) => {
    const { func, auth, xdr } = await request.json();

    // Channels takes either a signed transaction envelope, or a host function
    // plus its auth entries. But, you must never mix the two shapes!
    const params = xdr ? { xdr } : { func, auth };

    const res = await fetch(`${PUBLIC_OZ_CHANNELS_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PRIVATE_OZ_CHANNELS_API_KEY}`,
        },
        body: JSON.stringify({ params }),
    });

    // Pass the relayer's response through untouched. The kit understands both
    // the `{ success, data }` envelope and a bare transaction result.
    return json(await res.json(), { status: res.ok ? 200 : res.status });
};
