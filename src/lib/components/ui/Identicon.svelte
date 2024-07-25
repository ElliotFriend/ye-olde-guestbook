<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { drawIdenticon } from '$lib/stellarExpert';
    export let address;
</script>

<Avatar width="w-8">
    {@html drawIdenticon(address)}
</Avatar>
