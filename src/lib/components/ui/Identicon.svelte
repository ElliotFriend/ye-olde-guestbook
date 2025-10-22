<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton-svelte';

    import { drawIdenticon } from '$lib/stellarExpert';

    interface Props {
        address: string;
        size?: string;
    }
    let { address, size = '8' }: Props = $props();
</script>

<Avatar name={`${address} identicon`} {size}>
    {@html drawIdenticon(address)}
</Avatar>
