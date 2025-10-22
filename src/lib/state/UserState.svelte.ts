class User {
    keyId: string | null = $state(null);
    contractAddress: string | null = $state(null);

    constructor() {
        if (window.localStorage.hasOwnProperty('yog:keyId')) {
            this.keyId = localStorage.getItem('yog:keyId');
        }
        if (window.localStorage.hasOwnProperty('yog:contractAddress')) {
            this.contractAddress = localStorage.getItem('yog:contractAddress');
        }
    }

    set = ({ keyId, contractAddress }: { keyId: string; contractAddress: string }) => {
        this.keyId = keyId;
        window.localStorage.setItem('yog:keyId', keyId);
        this.contractAddress = contractAddress;
        window.localStorage.setItem('yog:contractAddress', contractAddress);
    };

    reset = () => {
        this.keyId = null;
        this.contractAddress = null;
        window.localStorage.clear();
        window.location.reload();
    };
}

export const user = new User();
