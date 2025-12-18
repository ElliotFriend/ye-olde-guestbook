<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton-svelte';

    import { drawIdenticon } from '$lib/stellarExpert';

    interface Props {
        address: string;
        size?: string;
    }
    let { address, size = '8' }: Props = $props();
</script>

<Avatar class={`size-${size}`}>
    <Avatar.Fallback>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html drawIdenticon(address)}
    </Avatar.Fallback>
</Avatar>
