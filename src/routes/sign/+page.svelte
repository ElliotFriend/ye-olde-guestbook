<script lang="ts">
    import Signature from 'lucide-svelte/icons/signature';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<h1 class="h1">Sign the Book</h1>
<p>Join in on the age-old tradition, and sign my guestbook! Please.</p>

<label class="label">
    <span>Title</span>
    <input class="input" type="text" placeholder="Title" />
</label>

<label class="label">
    <span>Message</span>
    <textarea class="textarea" rows="4" placeholder="Write your message here" />
</label>

<button type="button" class="btn variant-filled">
    <span><Signature /></span>
    <span>Sign!</span>
</button>
