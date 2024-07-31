import * as Client from 'ye_olde_guestbook';
import { RPC_URL } from '$lib/contracts/util';

export default new Client.Client({
    ...Client.networks.testnet,
    rpcUrl: RPC_URL,
});
