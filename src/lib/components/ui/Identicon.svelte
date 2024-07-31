<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { drawIdenticon } from '$lib/stellarExpert';
    export let address: string = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H';
    export let width: string = 'w-8';
</script>

<Avatar {width}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html drawIdenticon(address)}
</Avatar>
