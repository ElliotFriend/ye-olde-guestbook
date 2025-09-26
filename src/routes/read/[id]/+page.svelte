<script lang="ts">
    import GuestbookMessage from '$lib/components/GuestbookMessage.svelte';
    import type { PageData } from './$types';

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<h1 class="h1">Read Message {data.id}</h1>
<p>
    You're viewing just message {data.id}. You can
    <a class="anchor" href="/read">read all of them here</a>, as well.
</p>

<GuestbookMessage message={data.message} messageId={parseInt(data.id)} />
