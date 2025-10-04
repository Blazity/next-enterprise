import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			microfrontends: false
		}),
		alias: {
			$components: 'src/lib/components',
			$models: 'src/lib/models',
			$remote: 'src/lib/remote',
			$stores: 'src/lib/stores',
			$ai: 'src/lib/server/ai',
			$mcp: 'src/lib/server/mcp',
			$api: 'src/routes/api',
			$actions: 'src/lib/actions',
			$transitions: 'src/lib/transitions',
			$data: 'src/lib/data'
		}
	}
};

export default config;
