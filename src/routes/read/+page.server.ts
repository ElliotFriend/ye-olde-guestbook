import { getAllMessages, getWelcomeMessage } from '$lib/server/getLedgerEntries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    return {
        welcomeMessage: await getWelcomeMessage(),
        messages: await getAllMessages(),
    };
};
