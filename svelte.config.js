import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			// base: process.argv.includes('dev') ? '' : "process.env.BASE_PATH"
			// base: 'https://nishad.github.io/lannotae'
			// base: process.argv.includes('dev') ? '' : 'https://nishad.github.io/lannotae'
		}
	},

	preprocess: [vitePreprocess({})]
};

export default config;
