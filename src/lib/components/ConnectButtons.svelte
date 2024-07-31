<script lang="ts">
    import {
        clipboard,
        popup,
        type PopupSettings,
    } from '@skeletonlabs/skeleton';

    const popupFeatured: PopupSettings = {
        event: 'click',
        target: 'popupFeatured',
        placement: 'bottom',
    };

    import { send, getContractId } from '$lib/passkeyClient';
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import base64url from 'base64url';
    import { keyId } from '$lib/stores/keyId';
    import { networks } from 'ye_olde_guestbook';
    import { contractId } from '$lib/stores/contractId';
    import { Settings, ChevronDown, Copy, Wallet, CircleDollarSign, HelpingHand, LogOut } from 'lucide-svelte';
    import Identicon from '$lib/components/ui/Identicon.svelte';
    import TruncatedAddress from '$lib/components/ui/TruncatedAddress.svelte';
    import { seContractLink } from '$lib/stellarExpert';

    async function signup() {
        console.log('signing up')
        // implement the signup function here
    }

    async function login() {
        console.log('logging in')
        // implement the login function here
    }

    async function logout() {
        console.log('logging out')
        // implement the logout function here
    }

    async function fund() {
        console.log('funding')
        // implement the fund function here
    }

    async function donate() {
        console.log('donating')
        // implement the donate function here
    }
</script>

<div class="flex space-x-1 md:space-x-2">
    <button class="btn variant-filled-primary" on:click={signup}>Signup</button>
    <button class="btn variant-soft-primary" on:click={login}>Login</button>
    <button class="btn hover:variant-soft-primary" use:popup={popupFeatured}>
        <span><Settings /></span>
        <span><ChevronDown size="18" /></span>
    </button>

    <div class="card p-4 w-60 shadow-xl z-10" data-popup="popupFeatured">
        <div class="space-y-4">
            <div class="flex gap-4 w-full justify-between">
                <div>
                    <Identicon width="w-12" address={$contractId} />
                </div>
                <div class="flex flex-col gap-0.25">
                    <div class="text-right"><small>Balance</small></div>
                    <div>
                        <h4 class="h4">
                            {parseFloat((Number(13370000000) / 1e7).toFixed(2))}<small
                                >XLM</small
                            >
                        </h4>
                    </div>
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
                            class="btn-icon btn-icon-sm variant-soft-surface"
                            use:clipboard={{ input: 'stellarAddress' }}
                            ><Copy size="14" /></button
                        >
                    </div>
                </div>
            </div>
            <hr class="opacity-50" />
            <nav class="list-nav">
                <ul>
                    <li>
                        <button
                            class="btn variant-soft-success w-full"
                            on:click={fund}
                        >
                            <span><CircleDollarSign /></span>
                            <span>Fund Wallet</span>
                        </button>
                    </li>
                    <li>
                        <a
                            href={seContractLink($contractId)}
                            class="btn variant-soft-surface"
                            target="_blank"
                        >
                            <span><Wallet /></span>
                            <span>View Wallet</span></a
                        >
                    </li>
                    <li>
                        <button class="btn variant-soft-surface w-full" on:click={donate}>
                            <span><HelpingHand /></span>
                            <span>Send Donation</span>
                        </button>
                    </li>
                    <li>
                        <button class="btn variant-soft-error w-full" on:click={logout}>
                            <span><LogOut /></span>
                            <span>Logout</span></button
                        >
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</div>
