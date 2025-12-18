<script lang="ts">
    import { xdr } from '@stellar/stellar-sdk';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    import Signature from '@lucide/svelte/icons/signature';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';

    import { account, send } from '$lib/passkeyClient';
    import { toaster } from '$lib/toaster';
    import { user } from '$lib/state/UserState.svelte';
    import ye_olde_guestbook from '$lib/contracts/ye_olde_guestbook';

    let messageTitle: string = $state('');
    let messageText: string = $state('');
    let isLoading: boolean = $state(false);

    let signButtonDisabled = $derived(isLoading || !user.contractAddress);

    async function signGuestbook() {
        isLoading = true;
        try {
            if (!user.keyId || !user.contractAddress) {
                throw 'user missing keyId';
            }
            const at = await ye_olde_guestbook.write_message({
                author: user.contractAddress,
                title: messageTitle,
                text: messageText,
            });

            let txn = await account.sign(at.built!, { keyId: user.keyId });
            const { returnValue } = await send(txn.built!);
            const messageId = xdr.ScVal.fromXDR(returnValue, 'base64').u32();

            toaster.success({
                title: 'Success',
                description: 'Huzzah!! You signed my guestbook! Thanks.',
            });
            goto(resolve(`/read/${messageId}`));
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing the guestbook. Please try again later.',
            });
        } finally {
            isLoading = false;
        }
    }
</script>

<h1 class="h1">Sign the Book</h1>
<p>Join in on the age-old tradition, and sign my guestbook! Please.</p>

<form class="mx-auto w-full space-y-4">
    <label class="label">
        <span class="label-text">Title</span>
        <input bind:value={messageTitle} class="input" type="text" placeholder="Title" />
    </label>

    <label class="label">
        <span class="label-text">Message</span>
        <textarea
            bind:value={messageText}
            class="textarea"
            rows="4"
            placeholder="Write your message here"
        ></textarea>
    </label>

    <button
        onclick={signGuestbook}
        type="button"
        class="btn preset-filled-primary-500"
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
</form>
