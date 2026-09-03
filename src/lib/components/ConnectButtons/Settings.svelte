<script lang="ts">
    import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';

    import Settings from '@lucide/svelte/icons/settings';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import Copy from '@lucide/svelte/icons/copy';
    import Wallet from '@lucide/svelte/icons/wallet';
    import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
    import LogOut from '@lucide/svelte/icons/log-out';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';

    import { toaster } from '$lib/toaster';
    import { wallet } from '$lib/state/UserState.svelte';
    import { seContractLink } from '$lib/stellarExpert';
    import { kit, getNativeBalance } from '$lib/smartAccountClient';
    import { PUBLIC_NATIVE_TOKEN_CONTRACT } from '$env/static/public';
    import Identicon from '$lib/components/ui/Identicon.svelte';
    import TruncatedAddress from '$lib/components/ui/TruncatedAddress.svelte';
    import DonateButton from '$lib/components/ConnectButtons/DonateButton.svelte';

    let balance: string = $state('0');
    let isFunding: boolean = $state(false);

    async function getBalance() {
        console.log('fetching balances');
        try {
            balance = (await getNativeBalance(wallet.contractAddress!)).toString();
        } catch (err) {
            console.log(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong checking your balance. Please try again later.',
            });
        }
    }

    // `kit.fundWallet()` reports expected failures in the result rather than
    // throwing, but `toaster.promise` depends on that rejection.
    async function fundWallet() {
        const result = await kit.fundWallet(PUBLIC_NATIVE_TOKEN_CONTRACT);

        if (!result.success) {
            throw result.error;
        }

        return result;
    }

    async function fund() {
        console.log('funding wallet');
        isFunding = true;

        toaster.promise(fundWallet(), {
            loading: {
                title: 'Loading...',
                description: 'You got it! Awaiting airdrop.',
            },
            success: () => {
                getBalance();
                return {
                    title: 'Success',
                    description: 'Funds received. Congrats!',
                };
            },
            error: () => ({
                title: 'Error',
                description: 'Something went funding smart wallet. Please try again later.',
            }),
            finally: () => {
                isFunding = false;
            },
        });
    }

    async function logout() {
        try {
            await kit.disconnect();
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging out. Please try again later.',
            });
        }
    }
</script>

<Popover>
    <Popover.Trigger class="btn hover:preset-tonal-primary">
        <span><Settings /></span>
        <span><ChevronDown size="18" /></span>
    </Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content class="card shadow-lg bg-surface-200-800 p-4 space-y-4 max-w-[320px]">
                <div class="flex gap-4 w-full justify-between">
                    <div>
                        <Identicon address={wallet.contractAddress!} />
                    </div>
                    <div class="flex flex-col gap-px">
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
                            <TruncatedAddress address={wallet.contractAddress!} />
                            <!-- TODO: this copy/pasting doesn't work... :shrug: -->
                            <input type="hidden" value={wallet.contractAddress} data-address />
                            <button
                                type="button"
                                class="btn-icon btn-icon-sm preset-tonal-surface"
                                data-copy-address><Copy size="14" /></button
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
                    <!-- eslint-disable svelte/no-navigation-without-resolve -->
                    <a
                        href={seContractLink(wallet.contractAddress!)}
                        class="btn preset-tonal-surface"
                        target="_blank"
                    >
                        <!-- eslint-enable svelte/no-navigation-without-resolve -->
                        <span><Wallet /></span>
                        <span>View Wallet</span></a
                    >
                    <DonateButton {getBalance} />
                    <button class="btn preset-tonal-error w-full" onclick={logout}>
                        <span><LogOut /></span>
                        <span>Logout</span></button
                    >
                </nav>
            </Popover.Content>
        </Popover.Positioner>
    </Portal>
</Popover>
