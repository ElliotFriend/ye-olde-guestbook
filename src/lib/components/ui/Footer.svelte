<script lang="ts">
    import { PUBLIC_STELLAR_NETWORK, PUBLIC_FACTORY_CONTRACT_ADDRESS } from '$env/static/public';
</script>

<footer class="bg-surface-100-800-token p-6">
    <div class="flex justify-center">
        <code class="code">
            <a
                href={`https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/contract/${PUBLIC_FACTORY_CONTRACT_ADDRESS}`}
                >{PUBLIC_FACTORY_CONTRACT_ADDRESS}</a
            >
        </code>
    </div>
</footer>
