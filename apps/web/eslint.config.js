import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import complexity from 'eslint-plugin-complexity';
import visualComplexity from 'eslint-plugin-visual-complexity';
import noComments from 'eslint-plugin-no-comments';
import pathAlias from 'eslint-plugin-path-alias';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: [
			'**/*.stories.ts',
			'**/*.stories.svelte',
			'**/*.spec.ts',
			'**/*.test.ts',
			'.storybook/**/*',
			'tests/**/*',
			'scripts/**/*'
		]
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		plugins: {
			complexity,
			'visual-complexity': visualComplexity,
			'no-comments': noComments,
			'path-alias': pathAlias
		}
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			'no-undef': 'off',

			complexity: ['error', 10],
			'visual-complexity/complexity': ['error', 10],

			'no-comments/disallowComments': 'error',

			'path-alias/no-relative': [
				'error',
				{
					paths: {
						$components: './src/lib/components',
						$schemas: './src/lib/schemas',
						$types: './src/lib/types',
						$models: './src/lib/models',
						$queries: './src/lib/queries',
						$remote: './src/lib/remote',
						$utils: './src/lib/utils',
						$stores: './src/lib/stores',
						$db: './src/lib/server/database',
						$ai: './src/lib/server/ai',
						$mcp: './src/lib/server/mcp',
						$api: './src/routes/api',
						$actions: './src/lib/actions',
						$transitions: './src/lib/transitions',
						$data: './src/lib/data',
						$lib: './src/lib'
					},
					exceptions: [
						'./*.svelte',
						'./*.ts',
						'./*.js',
						'../*.svelte',
						'../*.ts',
						'../*.js',
						'./$types'
					]
				}
			]
		}
	},
	{
		files: [
			'**/*.config.js',
			'**/*.config.ts',
			'**/*.config.mjs',
			'**/eslint.config.js',
			'**/eslint.config.mjs',
			'**/vite.config.ts',
			'**/svelte.config.js',
			'**/playwright.config.ts',
			'**/vitest.config.ts',
			'**/tailwind.config.js',
			'**/postcss.config.js',
			'**/*.d.ts'
		],
		rules: {
			'no-comments/no-comments': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		files: ['src/routes/examples/**/*.svelte', 'src/routes/examples/**/*.ts'],
		rules: {
			'svelte/require-each-key': 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/no-at-html-tags': 'off',
			'svelte/prefer-svelte-reactivity': 'off',
			'svelte/prefer-writable-derived': 'off',
			'@typescript-eslint/no-unused-vars': 'off'
		}
	},
	{
		files: ['src/routes/+page.svelte'],
		rules: {
			'svelte/no-at-html-tags': 'off'
		}
	},
	{
		files: ['src/lib/**/*.svelte', 'src/lib/**/*.ts'],
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
			complexity: 'off',
			'visual-complexity/complexity': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			]
		}
	}
);
