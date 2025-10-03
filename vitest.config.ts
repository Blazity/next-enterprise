import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	resolve: process.env.VITEST
		? {
				conditions: ['browser'],
				alias: {
					$lib: './src/lib',
					$routes: './src/routes',
					$components: './src/lib/components',
					$schemas: './src/lib/schemas',
					$types: './src/lib/types',
					$models: './src/lib/models',
					$utils: './src/lib/utils',
					$remote: './src/lib/remote',
					$stores: './src/lib/stores',
					$server: './src/lib/server',
					$db: './src/lib/db',
					$mcp: './src/lib/server/mcp',
					$ai: './src/lib/server/ai'
				}
			}
		: undefined,
	plugins: [sveltekit()],
	test: {
		globals: true,
		passWithNoTests: true,
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					environment: 'node',
					include: ['src/**/*.unit.{test,spec}.{js,ts}', 'src/lib/utils/**/*.{test,spec}.{js,ts}'],
					exclude: [
						'**/node_modules/**',
						'**/dist/**',
						'**/.svelte-kit/**',
						'**/build/**',
						'**/*.svelte.{test,spec}.{js,ts}',
						'**/*.integration.{test,spec}.{js,ts}'
					]
				}
			},
			{
				extends: true,
				test: {
					name: 'integration',
					environment: 'node',
					include: [
						'src/tests/integration/**/*.{test,spec}.{js,ts}',
						'src/tests/routes/**/*.{test,spec}.{js,ts}',
						'src/lib/db/queries/**/*.test.ts',
						'src/**/*.integration.{test,spec}.{js,ts}',
						'src/**/*.remote.{test,spec}.{js,ts}',
						'src/routes/**/*+server.{test,spec}.{js,ts}'
					],
					exclude: [
						'**/node_modules/**',
						'**/dist/**',
						'**/.svelte-kit/**',
						'**/build/**',
						'src/lib/db/queries/select.test.ts',
						'src/lib/db/queries/educationEntries.relations.test.ts'
					],
					setupFiles: ['./tests/setup-integration.ts'],
					testTimeout: 30000,
					hookTimeout: 30000
				}
			},
			{
				extends: true,
				test: {
					name: 'component',
					environment: 'jsdom',
					include: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'src/**/*.component.{test,spec}.{js,ts}'
					],
					exclude: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**', '**/build/**'],
					setupFiles: ['./tests/setup-component.ts']
				}
			},
			{
				extends: true,
				test: {
					name: 'storybook',
					environment: 'jsdom',
					include: [
						'src/**/*.stories.test.ts',
						'src/**/*.stories.{js,ts,svelte}',
						'src/**/*.story.{js,ts,svelte}'
					],
					setupFiles: ['./.storybook/vitest.setup.ts']
				}
			}
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			include: ['src/**/*.{js,ts,svelte}'],
			exclude: [
				'src/**/*.{test,spec}.{js,ts}',
				'src/**/*.d.ts',
				'**/node_modules/**',
				'**/dist/**',
				'**/.svelte-kit/**',
				'**/build/**',
				'tests/**'
			],
			all: true,
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80
			}
		},
		reporters: ['verbose'],
		bail: 1,
		pool: 'forks',
		poolOptions: {
			forks: {
				singleFork: true
			}
		}
	}
});
