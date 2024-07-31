<script lang="ts">
    import { getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
    import BookOpenText from 'lucide-svelte/icons/book-open-text';
    import Signature from 'lucide-svelte/icons/signature';
    const drawerStore = getDrawerStore();

    function onClickSidebarItem(): void {
        drawerStore.close();
    }

    const menuItems = [
        {
            name: 'Sign',
            href: '/sign',
            icon: Signature,
        },
        {
            name: 'Read',
            href: '/read',
            icon: BookOpenText,
        },
    ];
</script>

<Drawer>
    <div class="p-4 space-y-4 overflow-y-auto">
        <nav class="list-nav">
            <ul>
                {#each menuItems as item}
                    <a
                        href={item.href}
                        class="btn variant-soft-surface"
                        on:keypress
                        on:click={() => onClickSidebarItem()}
                    >
                        <span><svelte:component this={item.icon} /></span>
                        <span>{item.name}</span>
                    </a>
                {/each}
            </ul>
        </nav>
    </div>
</Drawer>
