<script lang="ts">
    import { page } from '$app/state';
    import type { IMenuItem } from '$lib/components/ui/Header.svelte';

    let { item }: { item: IMenuItem } = $props();
    const Icon = item.icon;
</script>

<a
    href={item.href}
    class={[
        'btn hover:preset-tonal-primary',
        page.url.pathname.startsWith(item.href) && 'preset-tonal-primary',
    ]}
>
    <span><Icon /></span>
    <span>{item.name}</span>
</a>
