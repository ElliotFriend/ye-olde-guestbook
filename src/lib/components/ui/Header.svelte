<script lang="ts">
    import Signature from 'lucide-svelte/icons/signature';
    import BookOpenText from 'lucide-svelte/icons/book-open-text';
    import NavbarButton from '$lib/components/ui/NavbarButton.svelte';

    import { page } from '$app/stores';

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

<header class="flex flex-col bg-surface-100-800-token space-y-4 p-4">
    <div class="grid grid-cols-[auto_1fr_auto] gap-8">
        <div class="flex-none flex items-center">
            <a href="/" title="Old Guestbook Homepage">
                <span><strong class="text-xl">Old Guestbook</strong></span>
            </a>
        </div>
        <div class="flex space-x-4">
            {#each menuItems as item}
                <NavbarButton {item} />
            {/each}
        </div>
    </div>
</header>
