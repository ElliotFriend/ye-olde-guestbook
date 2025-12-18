<script lang="ts">
    import { Toast } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';
    import '../app.css';

    import Header from '$lib/components/ui/Header.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';

    let { children } = $props();
</script>

<Toast.Group {toaster}>
    {#snippet children(toast)}
        <Toast toast={toast}>
            <Toast.Message>
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
            </Toast.Message>
            <Toast.CloseTrigger />
        </Toast>
    {/snippet}
</Toast.Group>

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <PageContent>
        {@render children()}
    </PageContent>
    <Footer />
</div>
