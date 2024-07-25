<script lang="ts">
    import Identicon from '$lib/components/ui/Identicon.svelte';
    import { seContractLink, seLedgerLink } from '$lib/stellarExpert';
    import type { Message } from 'ye_olde_guestbook';

    export let message: Message;
</script>

<section class="card w-full">
    <div class="p-4 space-y-4">
        <div class="flex gap-8">
            <div class="space-y-2">
                <h3 class="h3">{message.title}</h3>
                <article>
                    <p>{message.text}</p>
                </article>
            </div>
        </div>
        <hr class="opacity-50" />
        <footer class="p-4 flex justify-start items-center space-x-4">
            <Identicon address={message.author} />
            <div class="flex-auto flex justify-between items-center">
                <h6 class="font-bold">By {@html seContractLink(message.author)}</h6>
                <small>At ledger {@html seLedgerLink(message.ledger)}</small>
            </div>
        </footer>
    </div>
</section>
