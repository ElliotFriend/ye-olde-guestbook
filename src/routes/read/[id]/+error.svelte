<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
</script>

<h1 class="h1">Sorry, friend!</h1>

<p>Something went wrong trying to find that message. Specifically:</p>

<p><code class="code">{JSON.stringify({ status: page.status, ...page.error })}</code></p>

<p>Try heading back to the <a class="anchor" href={resolve('/read')}>Read</a> page.</p>
