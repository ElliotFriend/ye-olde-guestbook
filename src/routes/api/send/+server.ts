import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

import { server } from '$lib/server/passkeyServer';

export const POST: RequestHandler = async ({ request }) => {
    const { xdr } = await request.json();
    const res = await server.send(xdr);
    return json(res);
};
