import { getAllMessages, getWelcomeMessage } from '$lib/server/getLedgerEntries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    console.log('hello there!');
    return {
        messages: await getAllMessages(),
        welcomeMessage: await getWelcomeMessage(),
    };
};
