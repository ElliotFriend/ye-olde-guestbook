<script lang="ts">
    import GuestbookMessage from '$lib/components/GuestbookMessage.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<h1 class="h1">Read the Book</h1>
<p>Take a gander at all these messages!</p>

{#each data.messages as message}
    <GuestbookMessage {message} />
{/each}
