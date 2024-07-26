<script lang="ts">
    import ArrowRight from 'lucide-svelte/icons/arrow-right';
</script>

<h1 class="h1 !text-6xl max-w-[600px]">
    <span
        class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
        style="font-family: 'Jacquard 12';">Ye Olde</span
    >
</h1>
<h1 class="h1 !text-6xl md:!text-4xl max-w-[600px]">
    <span
        class="bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
        >Guestbook</span
    >
</h1>
<p class="!text-xl max-w-[475px]">
    I cut my teeth on the internet in the days of <a
        class="anchor"
        href="https://www.angelfire.com"
        target="_blank">Angelfire</a
    >. There was no <em>comments section</em>. There was no <em>algorithmic feed</em> of user activity.
    There was no way of knowing who (if anybody) was reading your site. It was chaos, and we loved it!
</p>
<p class="!text-xl max-w-[475px]">
    Then, the humble <a
        class="anchor"
        href="https://en.wikipedia.org/wiki/Guestbook"
        target="_blank">guestbook</a
    >
    showed up in our lives, and changed everything. Your readers (or, more likely, haters and trolls)
    could leave messages on your site. Publicly available for all to see! It was the dawn of a new era.
</p>
<p class="!text-xl max-w-[475px]">Today, we recreate that magic.</p>
<div class="flex gap-4">
    <a href="/sign" class="btn variant-filled-primary">
        <span>Sign Now</span>
        <span><ArrowRight /></span>
    </a>
    <a href="/read" class="btn variant-soft-primary">Read Messages</a>
</div>
