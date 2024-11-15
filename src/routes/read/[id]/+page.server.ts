import { error } from '@sveltejs/kit';
import guestbook from '$lib/contracts/ye_olde_guestbook';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    try {
        let { result } = await guestbook.read_message({
            message_id: parseInt(params.id),
        });

        return {
            id: params.id,
            message: result.unwrap(),
        };
    } catch (err) {
        error(500, {
            message:
                "Sorry, something went wrong. Most likely, the message you're looking for doesn't exist.",
        });
    }
};
