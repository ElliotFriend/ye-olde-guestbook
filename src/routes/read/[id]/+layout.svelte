<script lang="ts">
    import { page } from '$app/stores';
</script>

<ol class="breadcrumb">
    <li class="crumb"><a class="anchor" href="/">Home</a></li>
    <li class="crumb-separator" aria-hidden="true">/</li>
    <li class="crumb"><a class="anchor" href="/read">Read</a></li>
    <li class="crumb-separator" aria-hidden="true">/</li>
    <li>Message {$page.params.id}</li>
</ol>

<slot />
