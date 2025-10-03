import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // STRICT: Only allow these specific root-level files
  entry: [
    // SvelteKit entry points
    'src/routes/**/*.{svelte,ts,js}',
    'src/lib/**/*.{svelte,ts,js}',
    'src/app.html',
    'src/hooks.{server,client}.ts',
    // Scripts
    'scripts/**/*.{ts,js}',

    // Tests
    'tests/**/*.{test,spec}.{ts,js}',
    'src/**/*.{test,spec}.{ts,js}',
    'e2e/**/*.{spec,test}.ts',

    // Storybook
    '.storybook/**/*.{ts,tsx,js,jsx}',
    'src/**/*.stories.{ts,tsx,js,jsx,svelte}',

    // GitHub Actions
    '.github/workflows/*.{yml,yaml}',

    // VSCode settings (if you want to track these)
    '.vscode/settings.json',
  ],

  // ALLOWLIST: Only source files, no config files
  project: [
    // === SOURCE FILES ONLY ===
    'src/**/*.{ts,tsx,js,jsx,svelte}',
    'static/**/*',
    'tests/**/*.{ts,js}',
    'e2e/**/*.{ts,js}',
    'scripts/**/*.{ts,js}',
    'ai-chatbot-svelte/**/*.{ts,tsx,js,jsx,svelte}',
  ],

  // STRICT IGNORE: These patterns will ERROR if found
  ignore: [
    // === CSS FILES (knip can't process them) ===
    '**/*.css',
    'styles/**/*.css',

    // === DOCUMENTATION CLUTTER (ERROR IF FOUND) ===
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
    '*.md', // Any other markdown in root

    // === LOG FILES (ERROR IF FOUND) ===
    '*.log',
    'build-errors.log',
    'check-errors.log',
    'lint-errors.log',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',

    // === TEMP/CACHE DIRECTORIES ===
    '.turbo/**',
    '.svelte-kit/**',
    'build/**',
    'dist/**',
    '.next/**',
    'node_modules/**',
    'coverage/**',
    '.nyc_output/**',

    // === OPTIONAL CLUTTER (uncomment to disallow) ===
    // '.cursor/**',     // Cursor IDE
    // '.specify/**',    // Specify tool
    // '.env.example',   // Example env files
    // '.npmrc',         // NPM config
    // '.prettierrc',    // Alternative prettier config

    // === ANY OTHER ROOT FILES NOT IN ALLOWLIST ===
    // This pattern will catch any unexpected root files
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
    '!/playwright.config.ts',
    '!/drizzle.config.ts',
    '!/eslint.config.js',
    '!/svelte.config.js',
    '!/turbo.json',
    '!/vite.config.ts',
    '!/knip.config.ts', // Allow this config file itself
  ],

  // Plugin configurations - enable Vitest as it's in the project
  svelte: true,

  vite: {
    config: ['vite.config.ts', 'svelte.config.js'],
  },

  vitest: {
    config: ['vitest.config.ts', 'vitest.setup.ts', 'vitest-setup-client.ts'],
  },

  playwright: {
    config: ['playwright.config.ts'],
  },

  storybook: {
    config: ['.storybook/main.ts', '.storybook/preview.ts'],
  },

  eslint: { config: ['eslint.config.js'] },
  prettier: { config: ['prettier.config.js'] },
  postcss: { config: ['postcss.config.js'] },
  typescript: { config: ['tsconfig.json'] },
  drizzle: { config: ['drizzle.config.ts'] },

  'github-actions': {
    entry: ['.github/workflows/*.{yml,yaml}'],
  },

  // STRICT RULES: Errors for everything
  rules: {
    files: 'error',           // ERROR on unused files
    dependencies: 'error',    // ERROR on unused deps
    devDependencies: 'error', // ERROR on unused devDeps
    unlisted: 'error',        // ERROR on unlisted deps
    binaries: 'error',        // ERROR on unused binaries
    unresolved: 'error',      // ERROR on unresolved imports
    exports: 'error',         // ERROR on unused exports
    types: 'error',           // ERROR on unused types
    duplicates: 'error',      // ERROR on duplicates
    enumMembers: 'warn',      // WARN on unused enum members
    classMembers: 'warn',     // WARN on unused class members
  },

  // Additional strictness - align with schema defaults
  include: ['files', 'dependencies', 'exports', 'types'],
  ignoreExportsUsedInFile: false, // Don't ignore exports used in same file

  // Don't ignore anything - be strict!
  ignoreDependencies: [],
  ignoreBinaries: [],
  ignoreMembers: [],

  // Schema-compliant settings
  includeEntryExports: false, // Default is false, explicit for clarity
  treatConfigHintsAsErrors: true, // Be strict about config hints
};

export default config;
