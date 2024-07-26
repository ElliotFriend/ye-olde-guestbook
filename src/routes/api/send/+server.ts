import { server } from '$lib/server/passkeyServer';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const { xdr } = await request.json();
    const res = await server.send(xdr);
    return json(res);
};
