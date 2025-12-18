<script lang="ts">
    import {
        seAccountLink,
        seContractLink,
        seLedgerLink,
        seTransactionLink,
    } from '$lib/stellarExpert';
    import TruncatedAddress from '$lib/components/ui/TruncatedAddress.svelte';

    interface Props {
        target: string | number;
    }
    let { target }: Props = $props();

    let targetHref: `https://stellar.expert/${string}` = $derived.by(() => {
        switch (typeof target) {
            case 'number':
                return seLedgerLink(target);
            case 'string':
                return target.startsWith('C')
                    ? seContractLink(target)
                    : target.startsWith('G')
                      ? seAccountLink(target)
                      : seTransactionLink(target);
            default:
                return 'https://stellar.expert/';
        }
    });
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a href={targetHref} target="_blank">
    {#if typeof target !== 'number' && (target.startsWith('C') || target.startsWith('G'))}
        <TruncatedAddress address={target} />
    {:else}
        <code class="code">{target}</code>
    {/if}
</a>
