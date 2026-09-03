import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    vitePlugin: {
        inspector: true,
    },
    kit: {
        adapter: adapter(),
    },
};
export default config;
