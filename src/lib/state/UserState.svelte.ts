import { kit } from '$lib/smartAccountClient';

class Wallet {
    contractAddress: string | null = $state(null);

    constructor() {
        kit.events.on('walletConnected', ({ contractId }) => (this.contractAddress = contractId));
        kit.events.on('walletDisconnected', () => (this.contractAddress = null));
    }
}

export const wallet = new Wallet();
