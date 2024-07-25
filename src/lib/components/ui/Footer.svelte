<script lang="ts">
    import { networks } from 'ye_olde_guestbook';
    import { seContractLink } from '$lib/stellarExpert';
</script>

<footer class="bg-surface-100-800-token p-6">
    <div class="flex justify-center">
        {@html seContractLink(networks.testnet.contractId)}
    </div>
</footer>
