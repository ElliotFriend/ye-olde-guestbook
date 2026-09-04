<script lang="ts">
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';
    import { account, userDismissedPasskey } from '$lib/smartAccountClient';
    import { PUBLIC_NATIVE_TOKEN_CONTRACT } from '$env/static/public';
    import { wallet } from '$lib/state/UserState.svelte';

    import LoaderCircle from '@lucide/svelte/icons/loader-circle';

    let username: string = $state('');
    let isSigningUp: boolean = $state(false);

    async function signup() {
        isSigningUp = true;
        console.log('signing up');
        try {
            const { fundResult, submitResult } = await account.createWallet(
                'Ye Olde Guestbook',
                username,
                {
                    // deploys the smart account through the relayer and
                    // connects once the deployment has landed
                    autoSubmit: true,
                    // tops up the new account from Friendbot so the user has
                    // some Testnet XLM to work with
                    autoFund: true,
                    // required when `autoFund: true`
                    nativeTokenContract: PUBLIC_NATIVE_TOKEN_CONTRACT,
                },
            );

            if (!submitResult?.success) {
                throw submitResult?.error ?? new Error('failed to deploy smart account');
            }

            console.log('[signup] contractAddress', wallet.contractAddress);

            // Funding is a convenience, not a reason to fail signup.
            if (fundResult && !fundResult.success) {
                console.warn('[fund]', fundResult.error);
            }
        } catch (err: unknown) {
            if (userDismissedPasskey(err)) {
                toaster.warning({
                    title: 'Cancelled',
                    description: 'Passkey prompt dismissed.',
                });
                return;
            }

            console.error('[signup]', err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing up. Please try again later.',
            });
        } finally {
            isSigningUp = false;
        }
    }
</script>

<Dialog closeOnInteractOutside={false}>
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
                    <button
                        type="button"
                        class="btn preset-filled"
                        onclick={signup}
                        disabled={isSigningUp}
                    >
                        {#if isSigningUp}
                            <LoaderCircle class="animate-spin" />
                        {:else}
                            Confirm
                        {/if}
                    </button>
                </footer>
            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>
