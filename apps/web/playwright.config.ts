import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e/tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		['html', { outputFolder: 'playwright-report' }],
		['list'],
		['json', { outputFile: 'test-results/results.json' }]
	],
	use: {
		baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		actionTimeout: 10000
	},
	projects: [
		{
			name: 'chromium-public',
			testMatch: /.*\/public\/.*\.spec\.ts/,
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'firefox-public',
			testMatch: /.*\/public\/.*\.spec\.ts/,
			use: { ...devices['Desktop Firefox'] }
		},
		{
			name: 'webkit-public',
			testMatch: /.*\/public\/.*\.spec\.ts/,
			use: { ...devices['Desktop Safari'] }
		},
		{
			name: 'chromium-authenticated',
			testMatch: /.*\/authenticated\/.*\.spec\.ts/,
			use: { ...devices['Desktop Chrome'] }
		}
	],

	webServer: {
		command: 'pnpm run build && pnpm run preview',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI,
		stdout: 'ignore',
		stderr: 'pipe'
	}
});
