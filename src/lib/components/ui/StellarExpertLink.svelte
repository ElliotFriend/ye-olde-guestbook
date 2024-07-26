<script lang="ts">
    import {
        seAccountLink,
        seContractLink,
        seLedgerLink,
        seTransactionLink,
    } from '$lib/stellarExpert';
    export let target: string | number;
    let targetHref: string;

    $: switch (typeof target) {
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
</script>

<a href={targetHref} target="_blank"><code class="code">{target}</code></a>
