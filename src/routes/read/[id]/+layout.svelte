<script lang="ts">
    import { page } from '$app/state';

    let { children } = $props();
</script>

<ol class="flex items-center gap-4">
    <li><a class="opacity-60 anchor" href="/">Home</a></li>
    <li class="opacity-50" aria-hidden="true">&rsaquo;</li>
    <li><a class="opacity-60 anchor" href="/read">Read</a></li>
    <li class="opacity-50" aria-hidden="true">&rsaquo;</li>
    <li>Message {page.params.id}</li>
</ol>

{@render children?.()}
