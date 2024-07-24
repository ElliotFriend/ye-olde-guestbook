import * as Client from 'old_guestbook';
import { RPC_URL } from './util';

export default new Client.Client({
    ...Client.networks.testnet,
    rpcUrl: RPC_URL,
    allowHttp: true,
});
