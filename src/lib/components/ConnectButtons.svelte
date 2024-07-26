<script lang="ts">
    import { getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    import { error } from '@sveltejs/kit';
    import { account, send, getContractId } from '$lib/passkeyClient';
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import base64url from 'base64url';
    import { keyId } from '$lib/stores/keyId';
    import { contractId } from '$lib/stores/contractId';
    import Settings from 'lucide-svelte/icons/settings';
    import ChevronDown from 'lucide-svelte/icons/chevron-down';
    import Identicon from './ui/Identicon.svelte';
    import StellarExpertLink from './ui/StellarExpertLink.svelte';

    async function signup() {
        try {
            const {
                keyId: kid,
                contractId: cid,
                xdr,
            } = await account.createWallet(PUBLIC_SITE_NAME, 'Guestbook Author');

            const keyId_b64 = base64url(kid);
            keyId.set(keyId_b64);
            contractId.set(cid);

            if (!xdr) {
                error(500, {
                    message: 'XDR transaction missing',
                });
            }
            send(xdr);
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong signing up. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    async function login() {
        try {
            const { keyId: kid, contractId: cid } = await account.connectWallet({
                getContractId,
            });

            const keyId_base64url = base64url(kid);

            keyId.set(keyId_base64url);
            console.log(keyId_base64url);

            contractId.set(cid);
            console.log(cid);
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong logging in. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    async function funding() {
        const toastId = toastStore.trigger({
            message: 'This is currently disabled. Sorry',
            background: 'variant-filled-warning',
        })

        // try {
        //     await fund($contractId)
        //     toastStore.close(toastId)
        //     toastStore.trigger({
        //         message: 'Funds received. Congrats!',
        //         background: 'variant-filled-success',
        //     })
        // } catch (err) {
        //     toastStore.close(toastId)
        //     console.log(err);
        //     toastStore.trigger({
        //         message: 'Something went wrong logging in. Please try again later.',
        //         background: 'variant-filled-error',
        //     });
        // }
    }

    async function logout() {
        try {
            keyId.reset();
            contractId.set('');
            localStorage.removeItem('yog:keyId');
            window.location.reload();
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong logging out. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    const popupFeatured: PopupSettings = {
        event: 'click',
        target: 'popupFeatured',
        placement: 'bottom',
    };
</script>

<div class="flex space-x-1 md:space-x-2">
    {#if !$contractId}
        <button class="btn variant-filled-primary" on:click={signup}>Signup</button>
        <button class="btn variant-soft-primary" on:click={login}>Login</button>
    {:else}
        <button class="btn hover:variant-soft-primary" use:popup={popupFeatured}>
            <span><Settings /></span>
            <span><ChevronDown size="18" /></span>
        </button>

        <div class="card p-4 w-60 shadow-xl z-10" data-popup="popupFeatured">
            <div class="space-y-4">
                <Identicon width="w-12" address={$contractId} />
                <div>
                    <p class="font-bold">Your Wallet</p>
                    <p><StellarExpertLink target={$contractId} /></p>
                </div>
                <hr class="opacity-50" />
                <nav class="list-nav">
                    <ul>
                        <li><button class="btn variant-soft-success w-full" on:click={funding}>Fund Wallet</button></li>
                        <li><a href="/">View Wallet</a></li>
                        <li><a href="/">Send Donation</a></li>
                        <li>
                            <button class="btn variant-soft-error w-full" on:click={logout}
                                >Logout</button
                            >
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    {/if}
</div>
