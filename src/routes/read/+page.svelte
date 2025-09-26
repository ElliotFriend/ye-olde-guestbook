<script lang="ts">
    import { run } from 'svelte/legacy';

    import { SlideToggle } from '@skeletonlabs/skeleton';
    import GuestbookMessage from '$lib/components/GuestbookMessage.svelte';

    import type { PageData } from './$types';
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let sortNewestFirst = $state(true);
    let messages = $state(data.messages);

    run(() => {
        if (sortNewestFirst) {
            messages = messages.sort((a, b) => b.ledger - a.ledger);
        } else {
            messages = messages.sort((a, b) => a.ledger - b.ledger);
        }
    });
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

<GuestbookMessage message={data.welcomeMessage} messageId={1} />
<hr class="border-t-2!" />

{#each messages as message, i (message.ledger)}
    <GuestbookMessage {message} messageId={i + 2} />
{/each}
