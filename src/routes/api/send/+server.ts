import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

import { PRIVATE_RELAYER_BASE_URL, PRIVATE_RELAYER_API_KEY } from '$env/static/private';

/**
 * The smart account kit POSTs either `{ func, auth }` (a smart contract
 * invocation) or `{ xdr }` (a fully signed envelope) to this endpoint. It
 * deliberately sends no credentials, because it runs in the browser. This route
 * adds the OpenZeppelin Relayer Channels API key and forwards the request on,
 * so the key never leaves the server.
 */
export const POST: RequestHandler = async ({ url, request, fetch }) => {
    // ensure requests are coming from our own frontend
    if (request.headers.get('origin') !== url.origin) {
        error(403, { message: 'hostname mismatch' });
    }

    // parse the request body and get the transaction details
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
        error(400, { message: 'request body must be a JSON object' });
    }
    const { func, auth, xdr }: { func?: string; auth?: string[]; xdr?: string } = body;

    // Channels takes either a signed transaction envelope, or a host function
    // plus its auth entries. But, you must never mix the two shapes!
    if (func && xdr) {
        error(400, { message: 'request body must contain a transaction OR a function, not both' });
    }
    if (!func && !xdr) {
        error(400, { message: 'request body must contain either a function or a transaction' });
    }

    const params = func ? { func, auth } : { xdr };

    try {
        const res = await fetch(`${PRIVATE_RELAYER_BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${PRIVATE_RELAYER_API_KEY}`,
            },
            body: JSON.stringify({ params }),
        });

        // The kit counts a submission as successful only when the status is ok
        // and the body carries a top-level `success: true`. Channels already
        // answers with that `{ success, data }` envelope, so pass it through.
        return json(await res.json(), { status: res.ok ? 200 : res.status });
    } catch (err: unknown) {
        console.error('[send]', err);
        error(502, { message: err instanceof Error ? err.message : 'relayer submission failed' });
    }
};
