<script lang="ts">
    import Header from '$lib/components/ui/Header.svelte';
    import SidebarDrawer from '$lib/components/ui/SidebarDrawer.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';
    import '../app.css';

    // Floating UI for Popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    // storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    import { Toaster } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';
    interface Props {
        children: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<Toaster {toaster} />
<!-- <Modal /> -->

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <PageContent>
        {@render children()}
    </PageContent>
    <Footer />
</div>
