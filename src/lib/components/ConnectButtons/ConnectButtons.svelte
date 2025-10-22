<script lang="ts">
    import { user } from '$lib/state/UserState.svelte';
    import { account } from '$lib/passkeyClient';

    import Settings from './Settings.svelte';
    import Signup from './Signup.svelte';
    import Login from './Login.svelte';
    import { onMount } from 'svelte';

    onMount(async () => {
        if (user.keyId) {
            console.log('keyId', user.keyId);

            const { contractId } = await account.connectWallet({
                keyId: user.keyId,
            });
            user.set({
                keyId: user.keyId,
                contractAddress: contractId,
            });

            console.log('contractAddress', user.contractAddress);
        }
    });
</script>

<div class="flex space-x-1 md:space-x-2">
    {#if !user.contractAddress}
        <Signup />
        <Login />
    {:else}
        <Settings />
    {/if}
</div>
