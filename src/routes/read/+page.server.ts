import { getAllMessages, getWelcomeMessage } from '#lib/server/getLedgerEntries.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    return {
        messages: await getAllMessages(),
        welcomeMessage: await getWelcomeMessage(),
    };
};
