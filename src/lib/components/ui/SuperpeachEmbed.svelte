<script lang="ts">
    import { PUBLIC_SUPERPEACH_URL } from '$env/static/public';
    import { getContractId, account } from '$lib/passkeyClient';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { onDestroy, onMount, type SvelteComponent } from 'svelte';

    export let parent: SvelteComponent;
    const modalStore = getModalStore();

    onMount(async () => {
        window.addEventListener('message', messenger);
    });

    function close() {
        window.removeEventListener('message', messenger);
        parent.onClose();
    }

    async function messenger(event: MessageEvent<any>) {
        try {
            console.log('here is an event!', event);
            if (
                event.data.name === 'superpeach' &&
                event.data.message === 'OK' &&
                event.origin === spUrl
            ) {
                console.log('am i here now?');
                const wallet = await account.connectWallet({
                    keyId: $modalStore[0].meta.kid,
                    getContractId,
                });

                $modalStore[0].response!({ contractId: wallet.contractId });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const cBase = 'relative w-modal shadow-xl';
    const cButton = 'absolute -top-3 -right-3 z-1 btn-icon variant-filled';
    const cIframe = 'bg-white w-full rounded-container-token overflow-hidden';

    $: spUrl = $modalStore[0].meta.spUrl || PUBLIC_SUPERPEACH_URL;
    $: iframeUrl = `${spUrl}/add-signer?from=${encodeURIComponent(location.origin)}&keyId=${$modalStore[0].meta.kid}&publicKey=${$modalStore[0].meta.publicKey}`;
</script>

{#if $modalStore[0]}
    <div class={cBase}>
        <button class={cButton} on:click={close}>✕</button>
        <iframe
            class={cIframe}
            src={iframeUrl}
            title="Superpeach Connect"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
    </div>
{/if}
