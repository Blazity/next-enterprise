import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	$schema: 'https://unpkg.com/knip@latest/schema.json',
	paths: {
		$lib: ['./src/lib'],
		$components: ['./src/lib/components'],
		$remote: ['./src/lib/remote'],
		$stores: ['./src/lib/stores'],
		$mcp: ['./src/lib/server/mcp'],
		$ai: ['./src/lib/server/ai'],
		$api: ['./src/routes/api'],
		$actions: ['./src/lib/actions'],
		$transitions: ['./src/lib/transitions'],
		$data: ['./src/lib/data']
	},
	entry: [
		'src/routes/**/*.{svelte,ts,js}',
		'src/lib/**/*.{svelte,ts,js}',
		'src/app.html',
		'src/hooks.{server,client}.ts',
		'scripts/**/*.{ts,js}',
		'tests/**/*.{test,spec}.{ts,js}',
		'src/**/*.{test,spec}.{ts,js}',
		'e2e/**/*.{spec,test}.ts',
		'.storybook/**/*.{ts,tsx,js,jsx}',
		'src/**/*.stories.{ts,tsx,js,jsx,svelte}',
		'.github/workflows/*.{yml,yaml}',
		'.vscode/settings.json'
	],
	project: [
		'src/**/*.{ts,tsx,js,jsx,svelte}',
		'static/**/*',
		'tests/**/*.{ts,js}',
		'e2e/**/*.{ts,js}',
		'scripts/**/*.{ts,js}',
		'*.md'
	],
	ignore: [
		'**/*.css',
		'styles/**/*.css',
		'README*.md',
		'CHECKLIST*.md',
		'SUMMARY*.md',
		'STATUS*.md',
		'PLAN*.md',
		'FINAL*.md',
		'GUIDE*.md',
		'CHANGELOG*.md',
		'MIGRATION*.md',
		'NOTES*.md',
		'TODO*.md',
		'*.md',
		'*.log',
		'build-errors.log',
		'check-errors.log',
		'lint-errors.log',
		'npm-debug.log*',
		'yarn-debug.log*',
		'yarn-error.log*',
		'.turbo/**',
		'.svelte-kit/**',
		'build/**',
		'dist/**',
		'.next/**',
		'node_modules/**',
		'coverage/**',
		'.nyc_output/**',
		'!/.all-contributorsrc',
		'!/.gitignore',
		'!/.prettierignore',
		'!/package.json',
		'!/pnpm-lock.yaml',
		'!/postcss.config.js',
		'!/prettier.config.js',
		'!/renovate.json',
		'!/reset.d.ts',
		'!/tsconfig.json',
		'!/vitest.config.ts',
		'!/vitest.setup.ts',
		'!/vitest-setup-client.ts',
		'!/.storybook/vitest.setup.ts',
		'!/tests/setup-integration.ts',
		'!/tests/setup-component.ts',
		'!/playwright.config.ts',
		'!/drizzle.config.ts',
		'!/eslint.config.js',
		'!/svelte.config.js',
		'!/turbo.json',
		'!/vite.config.ts',
		'!/knip.config.ts'
	],
	svelte: true,
	vite: {
		config: ['vite.config.ts', 'svelte.config.js']
	},
	vitest: {
		config: ['vitest.config.ts'],
		entry: ['vitest.setup.ts', 'vitest-setup-client.ts', '.storybook/vitest.setup.ts'],
		project: ['tests/**/*.ts', 'tests/**/*.js']
	},
	playwright: {
		config: ['playwright.config.ts']
	},
	storybook: {
		config: ['.storybook/main.ts', '.storybook/preview.ts']
	},
	eslint: { config: ['eslint.config.js'] },
	prettier: { config: ['prettier.config.js'] },
	postcss: { config: ['postcss.config.js'] },
	typescript: { config: ['tsconfig.json'] },
	drizzle: { config: ['drizzle.config.ts'] },
	'github-actions': {
		entry: ['.github/workflows/*.{yml,yaml}']
	},
	rules: {
		files: 'error',
		dependencies: 'error',
		devDependencies: 'error',
		unlisted: 'error',
		binaries: 'error',
		unresolved: 'error',
		exports: 'error',
		types: 'error',
		duplicates: 'error',
		enumMembers: 'warn',
		classMembers: 'warn'
	},
	include: [
		'files',
		'dependencies',
		'devDependencies',
		'unlisted',
		'binaries',
		'unresolved',
		'exports',
		'types',
		'duplicates',
		'enumMembers',
		'classMembers'
	],
	ignoreExportsUsedInFile: {
		class: false,
		enum: true,
		function: false,
		interface: false,
		member: false,
		type: false
	},
	ignoreDependencies: [],
	ignoreBinaries: [],
	ignoreMembers: [],
	includeEntryExports: false,
	treatConfigHintsAsErrors: true,
	tags: ['!test', '!docs']
};

export default config;
