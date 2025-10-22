<script lang="ts">
    import { Modal } from '@skeletonlabs/skeleton-svelte';
    import { native, account, send } from '$lib/passkeyClient';
    import { networks } from 'ye_olde_guestbook';
    import { user } from '$lib/state/UserState.svelte';
    import { toaster } from '$lib/toaster';

    import HandHelping from '@lucide/svelte/icons/hand-helping';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';

    interface Props {
        getBalance: () => void;
    }
    let { getBalance }: Props = $props();

    let openState: boolean = $state(false);
    let isDonating: boolean = $state(false);
    let donation: number | undefined = $state();

    function modalClose() {
        openState = false;
    }

    async function sendDonation() {
        if (!donation) {
            throw 'undefined donation amount';
        }

        const at = await native.transfer({
            to: networks.testnet.contractId,
            from: user.contractAddress!,
            amount: BigInt(donation * 10_000_000),
        });
        await account.sign(at, { keyId: user.keyId! });
        const res = await send(at.built!);
        console.log(res);
    }

    async function donate() {
        modalClose();
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

<Modal
    open={openState}
    onOpenChange={(e) => (openState = e.open)}
    triggerBase="w-full"
    contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet trigger()}
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
    {/snippet}
    {#snippet content()}
        <header class="flex justify-between">
            <h2 class="h2">Your Generosity Knows No Bounds!</h2>
        </header>
        <article>
            <p class="opacity-60">
                Donations help this guestbook stay alive. Please enter the quantity of XLM you would
                like to donate.
            </p>
            <label class="label">
                <span class="label-text">Donation Amount</span>
                <input class="input" type="number" placeholder="10" bind:value={donation} />
            </label>
        </article>
        <footer class="flex justify-end gap-4">
            <button type="button" class="btn preset-tonal" onclick={modalClose}>Cancel</button>
            <button type="button" class="btn preset-filled" onclick={donate}>Confirm</button>
        </footer>
    {/snippet}
</Modal>
