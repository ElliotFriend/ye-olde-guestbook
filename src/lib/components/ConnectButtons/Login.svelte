<script lang="ts">
    import {
        account,
        describeConnectionError,
        userDismissedPasskey,
    } from '$lib/smartAccountClient';
    import { toaster } from '$lib/toaster';
    import { wallet } from '$lib/state/UserState.svelte';

    async function login() {
        console.log('logging in');
        try {
            // `prompt: true` asks the user's authenticator to pick a passkey;
            // SmartAccountKit uses the selected credential to look up the
            // matching smart account contract via its IndexedDB index.
            await account.connectWallet({ prompt: true });
            console.log('[login] contractAddress', wallet.contractAddress);
        } catch (err: unknown) {
            if (userDismissedPasskey(err)) {
                toaster.warning({
                    title: 'Cancelled',
                    description: 'Passkey prompt dismissed.',
                });
                return;
            }

            console.error('[login]', err);

            // The kit verifies provenance, code, and signer state before it
            // connects, and refuses to connect when a check fails. Those
            // failures deserve better advice than "try again later".
            const connectionError = describeConnectionError(err);
            if (connectionError) {
                toaster.error(connectionError);
                return;
            }

            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging in. Please try again later.',
            });
        }
    }
</script>

<button class="btn preset-tonal-primary" onclick={login}>Login</button>
