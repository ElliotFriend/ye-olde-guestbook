<script lang="ts">
    import { networks } from 'ye_olde_guestbook';
    import { seContractLink } from '$lib/stellarExpert';
    import StellarExpertLink from './StellarExpertLink.svelte';
    import { contractId } from '$lib/stores/contractId';
</script>

<footer class="flex-none bg-surface-100-800-token p-6">
    <div class="flex justify-center">
        <StellarExpertLink target={networks.testnet.contractId} />
    </div>
</footer>
