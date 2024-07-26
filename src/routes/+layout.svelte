<script lang="ts">
    import Header from '$lib/components/ui/Header.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';
    import '../app.postcss';

    // Floating UI for Popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    import { initializeStores, Toast } from '@skeletonlabs/skeleton';
    initializeStores();
</script>

<Toast />
<div class="h-screen grid grid-rows-[auto_1fr_auto]">
    <Header />
    <div class="container mx-auto">
        <main class="col-span-1 p-6 space-y-4 max-w-4xl mx-auto">
            <slot />
        </main>
    </div>
    <Footer />
</div>
