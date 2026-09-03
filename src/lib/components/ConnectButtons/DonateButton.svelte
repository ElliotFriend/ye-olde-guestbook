<script lang="ts">
    import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
    import { kit } from '$lib/smartAccountClient';
    import { networks } from 'ye_olde_guestbook';
    import { toaster } from '$lib/toaster';
    import { PUBLIC_NATIVE_TOKEN_CONTRACT } from '$env/static/public';

    import HandHelping from '@lucide/svelte/icons/hand-helping';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';

    interface Props {
        getBalance: () => void;
    }
    let { getBalance }: Props = $props();

    let isDonating: boolean = $state(false);
    let donation: number | undefined = $state();

    async function sendDonation() {
        if (!donation) {
            throw 'undefined donation amount';
        }

        // `kit.transfer()` signs with the connected passkey and submits through
        // the relayer in one step. Easy peasy!
        const result = await kit.transfer(
            PUBLIC_NATIVE_TOKEN_CONTRACT,
            networks.testnet.contractId,
            donation,
        );

        if (!result.success) {
            throw result.error;
        }

        console.log(result);
    }

    async function donate() {
        isDonating = true;
        toaster.promise(sendDonation(), {
            loading: {
                title: 'Loading...',
                description: 'Submitting donation. Much appreciated!',
            },
            success: () => ({
                title: 'Success',
                description: 'Donation received! You really ARE the goat.',
            }),
            error: () => ({
                title: 'Error',
                description: 'Something went wrong donating. Please try again later.',
            }),
            finally: () => {
                isDonating = false;
                getBalance();
            },
        });
    }
</script>

<Dialog>
    <Dialog.Trigger class="w-full">
        <button class="btn preset-tonal-surface w-full" disabled={isDonating}>
            <span>
                {#if isDonating}
                    <LoaderCircle class="animate-spin" />
                {:else}
                    <HandHelping />
                {/if}
            </span>
            <span>Send Donation</span>
        </button>
    </Dialog.Trigger>
    <Portal>
        <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50 backdrop-blur-sm" />
        <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
            <Dialog.Content
                class="card bg-surface-100-900 p-4 space-y-4 shadow-xl w-sm max-w-screen-sm z-100"
            >
                <header class="flex justify-between items-center">
                    <Dialog.Title class="text-lg font-bold"
                        >Your Generosity Knows No Bounds!</Dialog.Title
                    >
                </header>
                <Dialog.Description>
                    Donations help this guestbook stay alive. Please enter the quantity of XLM you
                    would like to donate.
                </Dialog.Description>
                <label class="label">
                    <span class="label-text">Donation Amount</span>
                    <input class="input" type="number" placeholder="10" bind:value={donation} />
                </label>
                <footer class="flex justify-end gap-4">
                    <Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
                    <Dialog.CloseTrigger class="btn preset-filled" onclick={donate}
                        >Confirm</Dialog.CloseTrigger
                    >
                </footer>
            </Dialog.Content>
        </Dialog.Positioner>
    </Portal>
</Dialog>
