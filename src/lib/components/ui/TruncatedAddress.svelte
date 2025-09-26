<script lang="ts">
    interface Props {
        address: string;
    }

    let { address }: Props = $props();
</script>

<span class="code flex flex-1 min-w-0 p-1">
    <p class="overflow-hidden text-ellipsis">{address.slice(0, -3)}</p>
    <p>{address.slice(-3)}</p>
</span>
