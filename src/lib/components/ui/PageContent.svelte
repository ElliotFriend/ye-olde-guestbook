<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="flex-auto w-full h-full flex overflow-hidden">
    <!-- aside goes here if we want a sidebar -->
    <div
        id="page"
        class="scroll-smooth flex-1 overflow-x-hidden flex flex-col"
        style="scrollbar-gutter: auto;"
    >
        <main id="page-content" class="flex-auto">
            <div class="flex items-start gap-10 relative p-10">
                <div class="mx-auto w-full max-w-4xl space-y-4">
                    {@render children?.()}
                </div>
            </div>
        </main>
    </div>
</div>
