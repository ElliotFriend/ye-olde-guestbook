<script lang="ts">
    import { account } from '$lib/passkeyClient';
    import { toaster } from '$lib/toaster';
    import { user } from '$lib/state/UserState.svelte';

    async function login() {
        console.log('logging in');
        try {
            const { keyIdBase64, contractId } = await account.connectWallet();

            user.set({
                keyId: keyIdBase64,
                contractAddress: contractId,
            });

            console.log('keyId', user.keyId);
            console.log('contractAddress', user.contractAddress);
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging in. Please try again later.',
            });
        }
    }
</script>

<button class="btn preset-tonal-primary" onclick={login}>Login</button>
