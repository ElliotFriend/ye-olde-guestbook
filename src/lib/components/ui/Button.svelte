<script lang="ts">
    interface Props {
        text: string;
        onClick: () => void;
        className?: string;
    }

    let { text, onClick, className = 'btn' }: Props = $props();
</script>

<button class={className} onclick={onClick}>{text}</button>
