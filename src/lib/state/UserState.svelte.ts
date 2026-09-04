import { account } from '$lib/smartAccountClient';

class Wallet {
    contractAddress: string | null = $state(null);

    constructor() {
        account.events.on(
            'walletConnected',
            ({ contractId }) => (this.contractAddress = contractId),
        );
        account.events.on('walletDisconnected', () => (this.contractAddress = null));
    }
}

export const wallet = new Wallet();
