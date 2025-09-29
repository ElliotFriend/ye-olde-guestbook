<script lang="ts">
    import { error } from '@sveltejs/kit';
    import { Modal } from "@skeletonlabs/skeleton-svelte";
    import { toaster } from '$lib/toaster';
    import { account, send, fundContract } from "$lib/passkeyClient";
    import { keyId } from "$lib/stores/keyId";
    import { contractId } from "$lib/stores/contractId";

    let { username = $bindable(), getBalance = $bindable() }: { username: string; getBalance: () => Promise<void> } = $props();
    let openState = $state(false);

    function modalClose() {
        openState = false;
    }

    async function signup() {
        console.log('signing up');
        try {
            const {
                keyIdBase64,
                contractId: cid,
                signedTx,
            } = await account.createWallet('Ye Olde Guestbook', username);
            keyId.set(keyIdBase64);
            contractId.set(cid);

            if (!signedTx) {
                error(500, {
                    message: 'built transaction missing',
                });
            }
            await send(signedTx);
            await fundContract($contractId);
            getBalance();
        } catch (err) {
            console.log(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing up. Please try again later.',
            });
        }
    }
</script>

<Modal
    open={openState}
    onOpenChange={(e) => (openState = e.open)}
    triggerBase="btn preset-filled-primary-500"
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm z-100"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet trigger()}Signup{/snippet}
    {#snippet content()}
        <header class="flex justify-between">
            <h2 class="h2">Enter Name</h2>
        </header>
        <article>
            <p class="opacity-60">Please provide a username below.</p>
            <input type="text" bind:value={username} />
        </article>
        <footer class="flex justify-end gap-4">
            <button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
            <button type="button" class="btn preset-filled" onclick={signup}>Confirm</button>
        </footer>
    {/snippet}
</Modal>
