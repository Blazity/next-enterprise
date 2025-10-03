import eslintPluginStorybook from 'eslint-plugin-storybook';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import typescriptEslint from 'typescript-eslint';

const eslintIgnore = [
	'.git/',
	'.svelte-kit/',
	'.turbo/',
	'.vercel/',
	'.cursor/',
	'.specify/',
	'node_modules/',
	'dist/',
	'build/',
	'coverage/',
	'storybook-static/',
	'docs/examples/',
	'*.min.js',
	'*.config.js',
	'*.d.ts'
];

const config = typescriptEslint.config(
	{
		ignores: eslintIgnore
	},
	...eslintPluginStorybook.configs['flat/recommended'],
	...eslintPluginSvelte.configs['flat/recommended'],
	typescriptEslint.configs.recommended,
	{
		settings: {
			tailwindcss: {
				callees: ['classnames', 'clsx', 'ctl', 'cn', 'cva']
			}
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'sort-imports': [
				'error',
				{
					ignoreCase: true,
					ignoreDeclarationSort: true
				}
			]
		}
	}
);

export default config;
