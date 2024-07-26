<script lang="ts">
    import { networks } from 'ye_olde_guestbook';
    import { seContractLink } from '$lib/stellarExpert';
</script>

<footer class="flex-none bg-surface-100-800-token p-6">
    <div class="flex justify-center">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html seContractLink(networks.testnet.contractId)}
    </div>
</footer>
