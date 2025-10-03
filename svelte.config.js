import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
			$schemas: 'src/lib/schemas',
			$types: 'src/lib/types',
			$models: 'src/lib/models',
			$queries: 'src/lib/queries',
			$remote: 'src/lib/remote',
			$utils: 'src/lib/utils',
			$stores: 'src/lib/stores',
			$db: 'src/lib/server/database',
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
