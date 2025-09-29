<script lang="ts">
    // import { type ModalSettings, type PopupSettings } from '@skeletonlabs/skeleton-svelte';
    import { Popover } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';
    // const modalStore = getModalStore();

    import { error } from '@sveltejs/kit';
    import { account, send, getContractId, native, fundContract } from '$lib/passkeyClient';
    import { keyId } from '$lib/stores/keyId';
    import { contractId } from '$lib/stores/contractId';
    import Settings from '@lucide/svelte/icons/settings';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import Copy from '@lucide/svelte/icons/copy';
    import Wallet from '@lucide/svelte/icons/wallet';
    import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
    import HelpingHand from '@lucide/svelte/icons/helping-hand';
    import LogOut from '@lucide/svelte/icons/log-out';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';
    import Identicon from '$lib/components/ui/Identicon.svelte';
    import TruncatedAddress from '$lib/components/ui/TruncatedAddress.svelte';
    import { seContractLink } from '$lib/stellarExpert';
    import { networks } from 'ye_olde_guestbook';
    import SignupButton from '$lib/components/SignupButton.svelte';

    let balance: string = $state('0');
    let isFunding: boolean = $state(false);
    let isDonating: boolean = $state(false);
    let donationAmount: number | undefined = $state();
    let settingsOpenState: boolean = $state(false);
    let username: string = $state('');

    function popoverClose() {
        settingsOpenState = false
    }

    // async function promptDonationAmount() {
    //     new Promise((resolve) => {
    //         const modal: ModalSettings = {
    //             type: 'prompt',
    //             title: 'Your Generosity Knows No Bounds!',
    //             body: 'Donations help this guestbook stay alive. Please enter the quantity of XLM you would like to donate.',
    //             valueAttr: {
    //                 type: 'number',
    //                 required: true,
    //                 min: 1,
    //             },
    //             response: (donation: number) => {
    //                 resolve(donation);
    //             },
    //         };
    //         modalStore.trigger(modal);
    //     }).then((n) => donationAmount = n)
    // }

    async function getBalance() {
        console.log('fetching balances');
        try {
            const { result } = await native.balance({ id: $contractId });
            balance = result.toString();
        } catch (err) {
            console.log(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong checking your balance. Please try again later.',
            });
        }
    }

    async function testModal() {

    }

    async function signup() {
        console.log('signing up');
        try {
            // await new Promise<string>((resolve) => {
            //     const modal: ModalSettings = {
            //         type: 'prompt',
            //         title: 'Enter Name',
            //         body: 'Please provide a username below.',
            //         valueAttr: { type: 'text', required: true },
            //         response: (r: string) => resolve(r),
            //     };
            //     modalStore.trigger(modal);
            // }).then((r: string) => (userName = r));

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
            // getBalance();
        } catch (err) {
            console.log(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing up. Please try again later.',
            });
        }
    }

    async function login() {
        console.log('logging in');
        try {
            const { keyIdBase64, contractId: cid } = await account.connectWallet({
                getContractId,
            });

            keyId.set(keyIdBase64);
            console.log($keyId);

            contractId.set(cid);
            console.log($contractId);
        } catch (err) {
            console.log(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging in. Please try again later.',
            });
        }
    }

    async function fund() {
        console.log('funding wallet');
        isFunding = true;

        const toastId = toaster.promise(fundContract($contractId), {
            loading: {
                title: 'Loading...',
                description: 'You got it! Awaiting airdrop.',
            },
            success: () => ({
                title: 'Success',
                description: 'Funds received. Congrats!',
            }),
            error: () => ({
                title: 'Error',
                description: 'Something went funding smart wallet. Please try again later.',
            })
        });

        isFunding = false;
    }

    async function donate() {
        console.log('starting donation process');
        isDonating = true;
        // let toastId: string = '';
        try {
            // toaster.promise((
            //     const at = await native.transfer({
            //         to: networks.testnet.contractId,
            //         from: $contractId,
            //         amount: BigInt(donation * 10_000_000),
            //     });
            //     await account.sign(at, { keyId: $keyId });
            //     const res = await send(at.built!);
            //     console.log(res);
            // ), {
            //     loading: {
            //         title: 'Loading...'
            //         description: 'Submitting donation. Much appreciated!',
            //     },
            //     success: () => ({
            //         title: 'Success',
            //         description: 'Donation received! You really ARE the goat.',
            //     }),
            //     error: () => ({
            //         title: 'Error',
            //         description: 'Something went wrong donating. Please try again later.',
            //     })
            // })
        } catch (err) {
            console.log(err);
        } finally {
            isDonating = false;
        }
    }

    async function logout() {
        try {
            keyId.reset();
            contractId.set('');
            localStorage.removeItem('yog:keyId');
            window.location.reload();
        } catch (err) {
            console.log(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging out. Please try again later.',
            });
        }
    }

    const popupFeatured = {
        event: 'click',
        target: 'popupFeatured',
        placement: 'bottom',
    };
</script>

<div class="flex space-x-1 md:space-x-2">
    {#if !$contractId}
         <SignupButton {username} {getBalance} />
        <button class="btn preset-tonal-primary" onclick={login}>Login</button>
    {:else}
        <Popover
            open={settingsOpenState}
            onOpenChange={(e) => (settingsOpenState = e.open)}
            positioning={{ placement: 'top' }}
            triggerBase="btn hover:preset-tonal-primary"
            contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
            arrow
            arrowBackground="!bg-surface-200 dark:!bg-surface-800"
        >
            {#snippet trigger()}
                <span><Settings /></span>
                <span><ChevronDown size="18" /></span>
            {/snippet}
            {#snippet content()}
                <div class="flex gap-4 w-full justify-between">
                    <div>
                        <Identicon width="w-12" address={$contractId} />
                    </div>
                    <div class="flex flex-col gap-0.25">
                        <div class="text-right"><small>Balance</small></div>
                        {#await getBalance() then}
                            <div>
                                <h4 class="h4">
                                    {parseFloat((Number(balance) / 1e7).toFixed(2))}<small
                                        >XLM</small
                                    >
                                </h4>
                            </div>
                        {/await}
                    </div>
                </div>
                <div>
                    <p class="font-bold">Your Wallet</p>
                    <div class="mt-1">
                        <div class="overflow-hidden flex items-center gap-3">
                            <TruncatedAddress address={$contractId} />
                            <input
                                type="hidden"
                                bind:value={$contractId}
                                data-clipboard="stellarAddress"
                            />
                            <button
                                type="button"
                                class="btn-icon btn-icon-sm preset-tonal-surface"
                                ><Copy size="14" /></button
                            >
                        </div>
                    </div>
                </div>
                <hr class="opacity-50" />
                <nav class="flex flex-col gap-2">
                    <button
                        class="btn preset-tonal-success w-full"
                        onclick={fund}
                        disabled={isFunding}
                    >
                        <span>
                            {#if isFunding}
                                <LoaderCircle class="animate-spin" />
                            {:else}
                                <CircleDollarSign />
                            {/if}
                        </span>
                        <span>Fund Wallet</span>
                    </button>
                    <a
                        href={seContractLink($contractId)}
                        class="btn preset-tonal-surface"
                        target="_blank"
                    >
                        <span><Wallet /></span>
                        <span>View Wallet</span></a
                    >
                    <button class="btn preset-tonal-surface w-full" onclick={donate}>
                        <span>
                            {#if isDonating}
                                <LoaderCircle class="animate-spin" />
                            {:else}
                                <HelpingHand />
                            {/if}
                        </span>
                        <span>Send Donation</span>
                    </button>
                    <button class="btn preset-tonal-error w-full" onclick={logout}>
                        <span><LogOut /></span>
                        <span>Logout</span></button
                    >
                </nav>
            {/snippet}
        </Popover>
    {/if}
</div>
