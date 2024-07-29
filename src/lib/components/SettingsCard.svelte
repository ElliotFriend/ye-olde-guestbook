<script lang="ts">
    export let contractId: string;

</script>

<div class="card p-4 w-60 shadow-xl z-10" data-popup="popupFeatured">
    <div class="space-y-4">
        <Identicon width="w-12" address={contractId} />
        <div>
            <p class="font-bold">Your Wallet</p>
            <p><StellarExpertLink target={contractId} /></p>
        </div>
        <hr class="opacity-50" />
        <nav class="list-nav">
            <ul>
                <li><button class="btn variant-soft-success w-full" on:click={funding}>Fund Wallet</button></li>
                <li><a href="/">View Wallet</a></li>
                <li><a href="/">Send Donation</a></li>
                <li>
                    <button class="btn variant-soft-error w-full" on:click={logout}
                        >Logout</button
                    >
                </li>
            </ul>
        </nav>
    </div>
</div>
