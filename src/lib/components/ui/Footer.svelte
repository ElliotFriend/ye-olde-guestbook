<script lang="ts">
    import { PUBLIC_FACTORY_CONTRACT_ADDRESS } from '$env/static/public';
    import { seContractLink } from '$lib/stellarExpert';
</script>

<footer class="bg-surface-100-800-token p-6">
    <div class="flex justify-center">
        {@html seContractLink(PUBLIC_FACTORY_CONTRACT_ADDRESS)}
    </div>
</footer>
