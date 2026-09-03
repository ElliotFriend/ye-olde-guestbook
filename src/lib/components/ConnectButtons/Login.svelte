<script lang="ts">
    import { kit } from '$lib/smartAccountClient';
    import { toaster } from '$lib/toaster';
    import { wallet } from '$lib/state/UserState.svelte';

    async function login() {
        console.log('logging in');
        try {
            const connected = await kit.connectWallet({ prompt: true });

            if (!connected) {
                return;
            }

            console.log('contractAddress', wallet.contractAddress);
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
