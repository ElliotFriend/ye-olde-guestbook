<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    import Signature from 'lucide-svelte/icons/signature';
    import LoaderCircle from 'lucide-svelte/icons/loader-circle';
    import { contractId } from '$lib/stores/contractId';
    import ye_olde_guestbook from '$lib/contracts/ye_olde_guestbook';
    import { send } from '$lib/passkeyClient';
    import { keyId } from '$lib/stores/keyId';

    let messageTitle: string;
    let messageText: string;
    let isLoading: boolean = false;

    $: signButtonDisabled = isLoading || !$contractId;

    async function signGuestbook() {
        console.log('signing');
        // implement the signGuestbook function here
    }
</script>

<h1 class="h1">Sign the Book</h1>
<p>Join in on the age-old tradition, and sign my guestbook! Please.</p>

<label class="label">
    <span>Title</span>
    <input bind:value={messageTitle} class="input" type="text" placeholder="Title" />
</label>

<label class="label">
    <span>Message</span>
    <textarea
        bind:value={messageText}
        class="textarea"
        rows="4"
        placeholder="Write your message here"
    />
</label>

<button
    on:click={signGuestbook}
    type="button"
    class="btn variant-filled-primary"
    disabled={signButtonDisabled}
>
    <span>
        {#if isLoading}
            <LoaderCircle class="animate-spin" />
        {:else}
            <Signature />
        {/if}
    </span>
    <span>Sign!</span>
</button>
