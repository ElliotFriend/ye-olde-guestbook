<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$app/paths';

    let { children } = $props();
</script>

<ol class="flex items-center gap-4">
    <li><a class="opacity-60 hover:underline" href={resolve('/')}>Home</a></li>
    <li class="opacity-50" aria-hidden="true">&rsaquo;</li>
    <li><a class="opacity-60 hover:underline" href={resolve('/read')}>Read</a></li>
    <li class="opacity-50" aria-hidden="true">&rsaquo;</li>
    <li>Message {page.params.id}</li>
</ol>

{@render children?.()}
