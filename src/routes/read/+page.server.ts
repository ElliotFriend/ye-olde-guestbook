import { getAllMessages } from '$lib/server/getLedgerEntries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    const { messageCount } = await parent();
    return {
        messages: await getAllMessages(messageCount),
    };
};
