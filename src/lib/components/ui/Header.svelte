<script lang="ts">
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    const drawerStore = getDrawerStore();

    import BookOpenText from 'lucide-svelte/icons/book-open-text';
    import Menu from 'lucide-svelte/icons/Menu';
    import Signature from 'lucide-svelte/icons/signature';
    import NavbarButton from '$lib/components/ui/NavbarButton.svelte';
    import ConnectButtons from '$lib/components/ConnectButtons.svelte';

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

<header class="flex-none shadow-xl z-5">
    <div class="flex flex-col bg-surface-100-800-token space-y-4 p-3 md:p-4">
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 md:gap-8">
            <div class="md:!hidden self-center">
                <button class="btn-icon btn-icon-sm" on:click={() => drawerStore.open()}>
                    <Menu />
                </button>
            </div>
            <div class="flex-none flex items-center">
                <a href="/" title="Ye Olde Guestbook Home">
                    <span class="text-lg md:text-xl"
                        ><div
                            class="leading-5 bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
                            style="font-family: 'Jacquard 12';"
                        >
                            Ye Olde
                        </div>
                        <div
                            class="leading-5 bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
                        >
                            Guestbook
                        </div></span
                    >
                </a>
            </div>
            <div class="hidden md:block flex space-x-1 md:space-x-4">
                {#each menuItems as item}
                    <NavbarButton {item} />
                {/each}
            </div>
            <div>
                <ConnectButtons />
            </div>
        </div>
    </div>
</header>
