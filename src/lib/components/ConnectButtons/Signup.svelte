<script lang="ts">
    import { error } from '@sveltejs/kit';
    import { Modal } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';
    import { account, send, fundContract } from '$lib/passkeyClient';
    import { user } from '$lib/state/UserState.svelte';

    let username: string = $state('');
    let openState = $state(false);

    function modalClose() {
        openState = false;
    }

    async function signup() {
        console.log('signing up');
        try {
            const { keyIdBase64, contractId, signedTx } = await account.createWallet(
                'Ye Olde Guestbook',
                username,
            );

            user.set({
                keyId: keyIdBase64,
                contractAddress: contractId,
            });

            console.log('keyId', user.keyId);
            console.log('contractAddress', user.contractAddress);

            if (!signedTx) {
                error(500, {
                    message: 'built transaction missing',
                });
            }

            if (!user.contractAddress) {
                error(500, {
                    message: 'missing user contract address',
                });
            }

            await send(signedTx);
            await fundContract(user.contractAddress);
        } catch (err) {
            console.error(err);
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
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-sm max-w-screen-sm z-100"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet trigger()}Signup{/snippet}
    {#snippet content()}
        <header class="flex justify-between">
            <h2 class="h2">Enter Name</h2>
        </header>
        <article>
            <label class="label">
                <span class="label-text">Please provide a username below.</span>
                <input class="input" type="text" bind:value={username} />
            </label>
        </article>
        <footer class="flex justify-end gap-4">
            <button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
            <button type="button" class="btn preset-filled" onclick={signup}>Confirm</button>
        </footer>
    {/snippet}
</Modal>
