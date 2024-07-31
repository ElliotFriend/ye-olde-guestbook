import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SUPERPEACH_URL } from '$env/static/public';

export const GET: RequestHandler = async ({ params }) => {
    const res = await fetch(`${PUBLIC_SUPERPEACH_URL}/api/contract-id/${params.signer!}`);
    if (!res.ok) {
        error(404, {
            message: 'Contract not found',
        });
    }
    const contractId = await res.text();

    return new Response(String(contractId));
};
