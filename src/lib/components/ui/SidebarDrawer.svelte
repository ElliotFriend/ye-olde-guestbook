<script lang="ts">
    import { Modal } from '@skeletonlabs/skeleton-svelte';
    let drawerState: boolean = $state(false);

    import { menuItems } from '$lib/components/ui/Header.svelte'

    // A very simple function to close the expanded drawer menu when a button in
    // the menu is clicked.
    function drawerClose() {
        drawerState = false;
    }

    import Menu from '@lucide/svelte/icons/menu';
</script>

<Modal
    open={drawerState}
    onOpenChange={(e) => (drawerState = e.open)}
    triggerBase="btn-icon hover:preset-tonal"
    contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen"
    positionerJustify="justify-start"
    positionerAlign=""
    positionerPadding=""
    transitionsPositionerIn={{ x: -480, duration: 200 }}
    transitionsPositionerOut={{ x: -480, duration: 200 }}
>
    {#snippet trigger()}
        <Menu />
    {/snippet}
    {#snippet content()}
        <nav class="flex flex-col gap-2">
            {#each menuItems as item}
                {@const Icon = item.icon}
                <a href={item.href} class="btn preset-tonal-surface" onclick={drawerClose}>
                    <span><Icon /></span>
                    <span>{item.name}</span>
                </a>
            {/each}
        </nav>
    {/snippet}
</Modal>
