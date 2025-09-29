<script lang="ts">
    import { page } from '$app/state';
    let { item } = $props();
    let className = $derived(
        `btn hover:variant-soft-primary${page.url.pathname.startsWith(item.href) ? ' preset-tonal-primary' : ''}`,
    );
</script>

<a href={item.href} class={className}>
    <span><item.icon /></span>
    <span>{item.name}</span>
</a>
