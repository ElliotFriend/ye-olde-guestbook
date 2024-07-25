import { getMessageCount } from '$lib/server/getLedgerEntries';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    return {
        messageCount: await getMessageCount(),
    };
};
