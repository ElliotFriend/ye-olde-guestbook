<script lang="ts">
    import { getToastStore } from "@skeletonlabs/skeleton";
    const toastStore = getToastStore();

    import Signature from 'lucide-svelte/icons/signature';
    import { contractId } from '$lib/stores/contractId';
    import type { PageData } from './$types';
    import ye_olde_guestbook from "$lib/contracts/ye_olde_guestbook";
    import { account, send } from "$lib/passkeyClient";
    import { keyId } from "$lib/stores/keyId";

    export let data: PageData;
    let messageTitle: string;
    let messageText: string;

    async function signGuestbook() {
        try {
            const { built } = await ye_olde_guestbook.write_message({
                author: $contractId,
                title: messageTitle,
                text: messageText,
            })

            const xdr = await account.sign(built!, { keyId: $keyId})
            let res = await send(xdr)

            console.log(res)

            toastStore.trigger({
                message: 'Huzzah!! You signed my guestbook! Thanks.',
                background: 'variant-filled-success',
            })
        } catch (err: any) {
            console.log(err)
            toastStore.trigger({
                message: 'Something went wrong logging out. Please try again later.',
                background: 'variant-filled-error',
            })
        }
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
    <textarea bind:value={messageText} class="textarea" rows="4" placeholder="Write your message here" />
</label>

<button on:click={signGuestbook} type="button" class="btn variant-filled" disabled={!$contractId}>
    <span><Signature /></span>
    <span>Sign!</span>
</button>
