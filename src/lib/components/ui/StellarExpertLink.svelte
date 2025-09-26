<script lang="ts">
    import { run } from 'svelte/legacy';

    import {
        seAccountLink,
        seContractLink,
        seLedgerLink,
        seTransactionLink,
    } from '$lib/stellarExpert';
    import TruncatedAddress from './TruncatedAddress.svelte';
    interface Props {
        target: string | number;
    }

    let { target }: Props = $props();
    let targetHref: string = $state();

    run(() => {
        switch (typeof target) {
            case 'number':
                targetHref = seLedgerLink(target);
                break;
            case 'string':
                targetHref = target.startsWith('C')
                    ? seContractLink(target)
                    : target.startsWith('G')
                      ? seAccountLink(target)
                      : seTransactionLink(target);
                break;
            default:
                targetHref = 'https://stellar.expert';
                break;
        }
    });
</script>

<a href={targetHref} target="_blank">
    {#if typeof target !== 'number' && (target.startsWith('C') || target.startsWith('G'))}
        <TruncatedAddress address={target} />
    {:else}
        <code class="code">{target}</code>
    {/if}
</a>
