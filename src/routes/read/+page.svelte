<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import GuestbookMessage from '$lib/components/GuestbookMessage.svelte';

    import type { PageData } from './$types';
    export let data: PageData;

    let welcomeMessage = data.messages
        .filter(
            (message) =>
                message.author === 'GCFCP362XXHRMQIOPWXN45TQWHGR6GQDEBK5PJZY7EDNC5HH3LTUIAQP',
        )
        .pop();
    let messages = data.messages.filter(
        (message) => message.author !== 'GCFCP362XXHRMQIOPWXN45TQWHGR6GQDEBK5PJZY7EDNC5HH3LTUIAQP',
    );
    let sortNewestFirst = true;

    $: if (sortNewestFirst) {
        messages = messages.sort((a, b) => b.ledger - a.ledger);
    } else {
        messages = messages.sort((a, b) => a.ledger - b.ledger);
    }
</script>

<div class="flex flex-col md:flex-row justify-start md:justify-between space-y-4">
    <div class="space-y-4">
        <h1 class="h1">Read the Book</h1>
        <p>Take a gander at all these messages!</p>
    </div>
    <div class="md:self-end">
        <SlideToggle name="sort" bind:checked={sortNewestFirst} active="bg-primary-500" size="sm"
            >Showing <code class="code">{sortNewestFirst ? 'Newest' : 'Oldest'}</code> First</SlideToggle
        >
    </div>
</div>

{#if welcomeMessage}
    <GuestbookMessage message={welcomeMessage} />
    <hr class="!border-t-2" />
{/if}

{#each messages as message}
    <GuestbookMessage {message} />
{/each}
