<script lang="ts">
    import Header from '$lib/components/ui/Header.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';
    import '../app.postcss';

    // Floating UI for Popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<div class="h-screen grid grid-rows-[auto_1fr_auto]">
    <Header />
    <div class="container mx-auto">
        <main class="col-span-1 p-4 space-y-4">
            <slot />
        </main>
    </div>
    <Footer />
</div>
