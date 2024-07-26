import { server } from '$lib/server/passkeyServer';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    let { xdr } = await request.json();
    let res = await server.send(xdr);
    return json(res);
};
