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

    import { initializeStores, Toast, Modal } from '@skeletonlabs/skeleton';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
    initializeStores();
</script>

<Toast />
<SidebarDrawer />
<Modal />

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <PageContent>
        {@render children?.()}
    </PageContent>
    <Footer />
</div>
