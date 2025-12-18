<script lang="ts">
    import { error } from '@sveltejs/kit';
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
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

<Dialog>
    <Dialog.Trigger class="btn preset-filled">Signup</Dialog.Trigger>
    <Portal>
        <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50 backdrop-blur-sm" />
        <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
            <Dialog.Content
                class="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-sm max-w-screen-sm z-100"
            >
                <header class="flex justify-between items-center">
                    <Dialog.Title class="text-lg font-bold">Enter Name</Dialog.Title>
                </header>
                <Dialog.Description>Please provide your username below.</Dialog.Description>
                <input class="input" type="text" bind:value={username} />
                <footer class="flex justify-end gap-4">
                    <Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
                    <button type="button" class="btn preset-filled" onclick={signup}>Confirm</button
                    >
                </footer>
            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>
