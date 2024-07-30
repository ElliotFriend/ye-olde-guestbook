<script lang="ts">
    import Header from '$lib/components/ui/Header.svelte';
    import SidebarDrawer from '$lib/components/ui/SidebarDrawer.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
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
<SidebarDrawer />

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <PageContent>
        <slot />
    </PageContent>
    <Footer />
</div>
