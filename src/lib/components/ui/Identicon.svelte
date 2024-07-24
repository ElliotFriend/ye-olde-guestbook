<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { drawIdenticon } from '$lib/identicon';
    export let address;
</script>

<Avatar>
    {@html drawIdenticon(address)}
</Avatar>
