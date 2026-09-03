<script lang="ts">
    import { wallet } from '$lib/state/UserState.svelte';
    import { kit } from '$lib/smartAccountClient';

    import Settings from './Settings.svelte';
    import Signup from './Signup.svelte';
    import Login from './Login.svelte';
    import { onMount } from 'svelte';

    onMount(async () => {
        // The kit keeps its own session, so this restores a returning user
        // without prompting them for their passkey again.
        const restored = await kit.connectWallet();

        if (restored) {
            console.log('contractAddress', wallet.contractAddress);
        }
    });
</script>

<div class="flex space-x-1 md:space-x-2">
    {#if !wallet.contractAddress}
        <Signup />
        <Login />
    {:else}
        <Settings />
    {/if}
</div>
