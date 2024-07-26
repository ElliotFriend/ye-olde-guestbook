<script lang="ts">
    import { networks } from 'ye_olde_guestbook';
    import StellarExpertLink from './StellarExpertLink.svelte';
</script>

<footer class="flex-none bg-surface-100-800-token p-6">
    <div class="flex justify-center">
        <StellarExpertLink target={networks.testnet.contractId} />
    </div>
</footer>
