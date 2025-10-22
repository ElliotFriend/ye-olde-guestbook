import { PasskeyServer } from 'passkey-kit';
import { version } from '../../../package.json';

import { PUBLIC_LAUNCHTUBE_URL, PUBLIC_STELLAR_RPC_URL } from '$env/static/public';
import { PRIVATE_LAUNCHTUBE_JWT } from '$env/static/private';

export const server = new PasskeyServer({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    launchtubeUrl: PUBLIC_LAUNCHTUBE_URL,
    launchtubeJwt: PRIVATE_LAUNCHTUBE_JWT,
    launchtubeHeaders: {
        'X-Client-Name': 'ye-olde-guestbook',
        'X-Client-Version': version,
    },
});
