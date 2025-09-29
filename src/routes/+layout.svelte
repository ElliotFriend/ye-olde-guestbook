<script lang="ts">
    import { Toaster } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';
    import '../app.css';

    import Header from '$lib/components/ui/Header.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';

    interface Props {
        children: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<Toaster {toaster} />

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <PageContent>
        {@render children()}
    </PageContent>
    <Footer />
</div>
