<script lang="ts">
    import { Switch } from '@skeletonlabs/skeleton-svelte';
    import GuestbookMessage from '$lib/components/GuestbookMessage.svelte';
    import type { PageData } from './$types';

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let sortNewestFirst = $state(true);
    let messages = $state(data.messages);

    $effect(() => {
        if (sortNewestFirst) {
            messages = messages.sort((a, b) => b.id - a.id);
        } else {
            messages = messages.sort((a, b) => a.id - b.id);
        }
    });
</script>

<div class="flex flex-col md:flex-row justify-start md:justify-between space-y-4">
    <div class="space-y-4">
        <h1 class="h1">Read the Book</h1>
        <p>Take a gander at all these messages!</p>
    </div>
    <div class="md:self-end">
        <Switch
            name="sort"
            checked={sortNewestFirst}
            onCheckedChange={(e) => (sortNewestFirst = e.checked)}
            >Showing <code class="code">{sortNewestFirst ? 'Newest' : 'Oldest'}</code> First</Switch
        >
    </div>
</div>

<GuestbookMessage message={data.welcomeMessage} messageId={1} />
<hr class="border-t-2!" />

{#each messages as message (message.id)}
    <GuestbookMessage {message} messageId={message.id} />
{/each}
