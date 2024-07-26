<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    import { error } from '@sveltejs/kit';
    import { account, send, getContractId } from '$lib/passkeyClient';
    import { PUBLIC_SITE_NAME } from '$env/static/public';
    import base64url from 'base64url';
    import { keyId } from '$lib/stores/keyId';
    import { contractId } from '$lib/stores/contractId';

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
        } catch (err: any) {
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
        } catch (err: any) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong logging in. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    async function logout() {
        try {
            keyId.reset();
            contractId.set('');
            localStorage.removeItem('yog:keyId');
            window.location.reload();
        } catch (err: any) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong logging out. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }
</script>

<div class="btn-group variant-filled">
    <button class="btn" on:click={signup}>Signup</button>
    <button class="btn" on:click={login}>Login</button>
    <button class="btn" on:click={logout}>Logout</button>
</div>
