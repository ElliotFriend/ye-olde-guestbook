<script lang="ts">
    import Identicon from '$lib/components/ui/Identicon.svelte';
    export let address: string;
    export let message: { [key: string]: string } = {};
</script>

<section class="card w-full">
    <div class="p-4 space-y-4">
        <div class="flex gap-8">
            <div>
                <Identicon {address} />
            </div>
            <div class="space-y-2">
                <h3 class="h3">{message.title}</h3>
                <p>{message.text}</p>
            </div>
        </div>
    </div>
</section>
