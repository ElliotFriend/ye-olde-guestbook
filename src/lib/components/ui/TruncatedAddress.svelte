<script lang="ts">
    import { clipboard } from "@skeletonlabs/skeleton";
    import Copy from "lucide-svelte/icons/copy";
    export let address: string;
</script>

<div class="overflow-hidden flex items-center gap-3">
    <div class="code flex flex-1 min-w-0 p-2">
        <p class="overflow-hidden text-ellipsis">{address.slice(0, -3)}</p>
        <p>{address.slice(-3)}</p>
    </div>
    <input type="hidden" bind:value={address} data-clipboard="stellarAddress"/>
    <button type="button" class="btn-icon btn-icon-sm variant-soft-surface" use:clipboard={{input: "stellarAddress"}}><Copy size="14" /></button>
</div>
