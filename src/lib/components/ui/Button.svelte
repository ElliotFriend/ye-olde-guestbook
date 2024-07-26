<script lang="ts">
    export let text: string;
    export let onClick: () => void;
    export let className: string = "btn";
</script>

<button class={className} on:click={onClick}>{text}</button>
