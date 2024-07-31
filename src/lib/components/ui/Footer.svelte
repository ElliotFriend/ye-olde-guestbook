<script lang="ts">
    import { networks } from 'ye_olde_guestbook';
    import StellarExpertLink from './StellarExpertLink.svelte';
</script>

<footer class="flex-none bg-surface-100-800-token p-6">
    <div class="flex flex-col md:flex-row justify-around align-center mx-auto">
        <div class="space-y-1">
            <h6 class="h6">View Contract</h6>
            <ul class="flex">
                <li class="flex-initial">
                    <StellarExpertLink target={networks.testnet.contractId} />
                </li>
            </ul>
        </div>
        <div class="hidden md:grid grid-cols-1">
            <div class="space-y-1">
                <h6 class="h6">More Info</h6>
                <ul>
                    <li>
                        <a
                            class="anchor"
                            target="_blank"
                            href="https://developers.stellar.org/docs/build/apps/smart-wallets"
                        >
                            Developer Documentation
                        </a>
                    </li>
                    <li>
                        <a
                            class="anchor"
                            target="_blank"
                            href="https://github.com/elliotfriend/ye-olde-guestbook"
                        >
                            <!-- <img class="anchor inline mr-2" src={Github} width=24 alt="Github invertocat logo" />elliotfriend/ye-olde-guestbook -->
                            View Source Code
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</footer>
