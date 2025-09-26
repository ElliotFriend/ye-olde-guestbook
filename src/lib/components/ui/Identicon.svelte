<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { drawIdenticon } from '$lib/stellarExpert';
    interface Props {
        address: string;
        width?: string;
    }

    let { address, width = 'w-8' }: Props = $props();
</script>

<Avatar {width}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html drawIdenticon(address)}
</Avatar>
