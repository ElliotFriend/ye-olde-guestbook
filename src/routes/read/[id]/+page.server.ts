import { error } from '@sveltejs/kit';
import guestbook from '$lib/contracts/ye_olde_guestbook';
import { scValToNative } from 'ye_olde_guestbook';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    let result
    try {
        result = await guestbook.read_message({
            message_id: Number(params.id),
        });

        return {
            id: params.id,
            message: scValToNative(result.simulationData.result.retval),
        };
    } catch (err) {
        error(500, {
            message:
                "Sorry, something went wrong. Most likely, the message you're looking for doesn't exist.",
        });
    }
};
