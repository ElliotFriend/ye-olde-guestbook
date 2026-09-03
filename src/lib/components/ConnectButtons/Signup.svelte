<script lang="ts">
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';
    import { kit } from '$lib/smartAccountClient';
    import { PUBLIC_NATIVE_TOKEN_CONTRACT } from '$env/static/public';
    import { wallet } from '$lib/state/UserState.svelte';

    let username: string = $state('');

    async function signup() {
        console.log('signing up');
        try {
            // `autoSubmit` deploys the wallet through the relayer and connects
            // only once the deployment has landed; `autoFund` then tops it up
            // from Friendbot so the user has some Testnet XLM to work with.
            // const { credentialId, contractId, fundResult } = await kit.createWallet(
            const { fundResult, submitResult } = await kit.createWallet(
                'Ye Olde Guestbook',
                username,
                {
                    autoSubmit: true,
                    autoFund: true,
                    nativeTokenContract: PUBLIC_NATIVE_TOKEN_CONTRACT,
                },
            );

            if (!submitResult?.success) {
                throw submitResult?.error ?? new Error('failed to deploy smart account');
            }

            console.log('contractAddress', wallet.contractAddress);

            // Funding is a convenience, not a reason to fail signup.
            if (fundResult && !fundResult.success) {
                console.error(fundResult.error);
            }
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
