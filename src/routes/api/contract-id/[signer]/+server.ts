import { server } from '$lib/server/passkeyServer';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    const contractId = await server.getContractId(params.signer!);

    return new Response(String(contractId));
};
