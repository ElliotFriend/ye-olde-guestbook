<script lang="ts">
    import Identicon from '$lib/components/ui/Identicon.svelte';
    import type { Message } from 'ye_olde_guestbook';
    import StellarExpertLink from './ui/StellarExpertLink.svelte';

    export let message: Message;
</script>

<section class="card w-full variant-soft-primary">
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
        <footer
            class="w-full p-4 flex flex-col md:flex-row justify-start md:justify-between space-y-2 md:space-y-0 md:space-x-4"
        >
            <div class="flex flex-row space-x-4">
                <div class="self-center">
                    <Identicon width="w-10" address={message.author} />
                </div>
                <div class="flex flex-col space-y-1 overflow-hidden">
                    <h6 class="h6">Author</h6>
                    <StellarExpertLink target={message.author} />
                </div>
            </div>
            <div>
                <small>At ledger <StellarExpertLink target={message.ledger} /></small>
            </div>
        </footer>
    </div>
</section>
