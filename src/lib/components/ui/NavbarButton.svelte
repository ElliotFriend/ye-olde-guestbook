<script lang="ts">
    export let item;
    import { page } from '$app/stores';
    $: className = `btn hover:variant-soft-primary${$page.url.pathname.startsWith(item.href) ? ' variant-soft-primary' : ''}`;
</script>

<a href={item.href} class={className}>
    <span><svelte:component this={item.icon} /></span>
    <span>{item.name}</span>
</a>
