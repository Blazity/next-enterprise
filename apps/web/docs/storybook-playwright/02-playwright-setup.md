# Playwright Setup for Storybook Testing

## Overview

Playwright is a powerful end-to-end testing framework that works seamlessly with Storybook. This guide covers setting up Playwright to test SvelteKit applications through Storybook stories, enabling comprehensive browser-based testing of components and user interactions.

## Why Playwright for Storybook Testing?

Playwright offers several advantages for testing SvelteKit with Storybook:

- **Cross-browser testing**: Test in Chromium, Firefox, and WebKit
- **Headless and headed modes**: Run tests in CI or debug interactively
- **Component testing**: Test Storybook stories as isolated components
- **Visual testing**: Screenshot-based visual regression testing
- **Accessibility testing**: Built-in a11y testing capabilities
- **Mobile emulation**: Test responsive design across devices

## Installation and Configuration

### 1. Install Playwright

```bash
# Install Playwright with testing framework
npm install --save-dev @playwright/test
npm install --save-dev @playwright/experimental-ct-svelte  # For SvelteKit component testing

# Install browsers
npx playwright install

# Install additional dependencies for Storybook integration
npm install --save-dev @storybook/test-runner @storybook/jest @storybook/experimental-playwright
```

### 2. Configure Playwright

Create `playwright.config.ts`:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: 'http://127.0.0.1:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry'
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] }
		},

		/* Test against mobile viewports. */
		{
			name: 'Mobile Chrome',
			use: { ...devices['Pixel 5'] }
		},
		{
			name: 'Mobile Safari',
			use: { ...devices['iPhone 12'] }
		}

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'npm run dev',
		url: 'http://127.0.0.1:3000',
		reuseExistingServer: !process.env.CI
	}
});
```

### 3. Storybook-Specific Configuration

For testing Storybook stories, create a separate config:

```typescript
// playwright-ct.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-svelte';

export default defineConfig({
	testDir: './tests/component',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: 'http://127.0.0.1:6006',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
		ctViteConfig: {
			resolve: {
				alias: {
					$lib: '/src/lib',
					$components: '/src/lib/components'
				}
			}
		}
	},

	/* Run Storybook before starting the tests */
	webServer: {
		command: 'npm run storybook',
		url: 'http://127.0.0.1:6006',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000
	}
});
```

## Storybook Integration Setup

### 1. Configure Storybook for Testing

Install Storybook testing dependencies:

```bash
npm install --save-dev @storybook/test-runner @storybook/experimental-playwright
```

### 2. Create Test Runner Configuration

Create `.storybook/test-runner.js`:

```javascript
// .storybook/test-runner.js
const { getStoryContext } = require('@storybook/test-runner');

/**
 * @type {import('@storybook/test-runner').TestRunnerConfig}
 */
module.exports = {
	async preVisit(page, story) {
		// Set viewport based on story parameters
		const context = await getStoryContext(page, story);
		const viewport = context.parameters.viewport;

		if (viewport && viewport.width && viewport.height) {
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
		}
	},

	async postVisit(page, story) {
		// Wait for page to be ready for visual testing
		await page.waitForLoadState('networkidle');
	},

	/* Hook to execute after a story is visited and fully rendered.
	 * The page argument is the Playwright's page object for the story
	 * The context argument is a Storybook object containing the story's id, title, and name.
	 */
	async postRender(page, story) {
		// Add any post-render logic here
	}
};
```

### 3. Configure Storybook for Playwright

Update `.storybook/main.js` to include testing addons:

```javascript
// .storybook/main.js
export default {
	// ... existing config
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/test-runner' // Add this for test runner support
	]
};
```

## Component Testing Setup

### 1. Create Component Test Files

```javascript
// tests/component/Button.ct.tsx
import { test, expect } from '@playwright/experimental-ct-svelte';
import Button from '../../src/lib/components/Button/Button.svelte';

test('Button renders with label', async ({ mount }) => {
	const component = await mount(Button, {
		props: {
			label: 'Click me',
			variant: 'primary'
		}
	});

	await expect(component).toContainText('Click me');
	await expect(component.locator('button')).toHaveClass(/storybook-button--primary/);
});

test('Button handles click events', async ({ mount }) => {
	let clicked = false;

	const component = await mount(Button, {
		props: {
			label: 'Click me',
			onClick: () => {
				clicked = true;
			}
		}
	});

	await component.locator('button').click();
	expect(clicked).toBe(true);
});
```

### 2. Story-based Component Testing

```javascript
// tests/component/Button.stories.ct.tsx
import { test, expect } from '@playwright/experimental-ct-svelte';
import { composeStories } from '@storybook/svelte/experimental-playwright';
import * as stories from '../../src/lib/components/Button/Button.stories.js';

const { Primary, Secondary } = composeStories(stories);

test('Primary button story', async ({ mount }) => {
	const component = await mount(<Primary />);

	await expect(component).toContainText('Primary Button');
	await expect(component.locator('button')).toHaveClass(/storybook-button--primary/);
});

test('Secondary button story', async ({ mount }) => {
	const component = await mount(<Secondary />);

	await expect(component).toContainText('Secondary Button');
	await expect(component.locator('button')).toHaveClass(/storybook-button--secondary/);
});
```

## Storybook E2E Testing

### 1. Create E2E Test Files

```javascript
// tests/storybook.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Storybook', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:6006');
	});

	test('Storybook loads correctly', async ({ page }) => {
		await expect(page.locator('[data-testid="storybook-explorer-tree"]')).toBeVisible();
	});

	test('can navigate to Button stories', async ({ page }) => {
		// Navigate to Button component stories
		await page.locator('[data-testid="storybook-explorer-tree"] button:has-text("Button")').click();

		// Verify story panel loads
		await expect(page.locator('[data-testid="storybook-panel-root"]')).toBeVisible();
	});

	test('Button stories render correctly', async ({ page }) => {
		// Navigate to Primary story
		await page.goto('http://localhost:6006/?path=/story/components-button--primary');

		// Verify the story renders
		await expect(page.locator('button')).toContainText('Primary Button');
		await expect(page.locator('button')).toHaveClass(/storybook-button--primary/);
	});
});
```

### 2. Test Story Interactions

```javascript
// tests/interactions.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Story Interactions', () => {
	test('Button click interactions', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/components-button--primary');

		// Verify initial state
		await expect(page.locator('button')).toContainText('Primary Button');

		// Click the button (if it has click handlers in the story)
		await page.locator('button').click();

		// Verify any expected state changes
		// This depends on what the story does
	});

	test('Form interactions', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/components-form--default');

		// Fill form fields
		await page.locator('input[name="email"]').fill('test@example.com');
		await page.locator('input[name="password"]').fill('password123');

		// Submit form
		await page.locator('button[type="submit"]').click();

		// Verify form submission (depends on story implementation)
	});
});
```

## Visual Testing Setup

### 1. Install Visual Testing Dependencies

```bash
npm install --save-dev @playwright/test
npm install --save-dev playwright-image-snapshot  # For visual regression testing
```

### 2. Configure Visual Testing

```typescript
// playwright.config.ts (add to existing config)
export default defineConfig({
	// ... existing config
	use: {
		// ... existing use config
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},

	projects: [
		// ... existing projects
		{
			name: 'visual',
			testMatch: '**/*.visual.spec.ts',
			use: {
				...devices['Desktop Chrome'],
				screenshot: 'fullPage'
			}
		}
	]
});
```

### 3. Create Visual Tests

```javascript
// tests/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Testing', () => {
	test('Button component visual regression', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/components-button--primary');

		// Take screenshot for visual comparison
		await expect(page).toHaveScreenshot('button-primary.png');
	});

	test('Responsive design visual testing', async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('http://localhost:6006/?path=/story/components-button--primary');

		await expect(page).toHaveScreenshot('button-primary-mobile.png');

		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page).toHaveScreenshot('button-primary-tablet.png');
	});
});
```

## Accessibility Testing Setup

### 1. Install Accessibility Testing

```bash
npm install --save-dev @axe-core/playwright
```

### 2. Configure Accessibility Testing

```typescript
// tests/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
	test('Button component meets accessibility standards', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/components-button--primary');

		// Run axe accessibility tests
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Form component accessibility', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/components-form--default');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.include('[data-testid="form"]')
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
```

## Running Tests

### Basic Commands

```bash
# Run all Playwright tests
npx playwright test

# Run specific test file
npx playwright test tests/button.spec.ts

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run component tests
npx playwright test --config=playwright-ct.config.ts

# Run Storybook E2E tests
npx playwright test tests/storybook.spec.ts
```

### Storybook-Specific Commands

```bash
# Run Storybook test runner
npx test-storybook

# Run Storybook tests with Playwright
npx test-storybook --browsers chromium firefox webkit

# Run specific story tests
npx test-storybook --stories "**/Button.stories.@(js|ts)"

# Run tests in CI mode
npx test-storybook --ci
```

## Debugging and Development

### 1. Debug Mode

```bash
# Run tests in debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test --debug tests/button.spec.ts
```

### 2. Trace Viewer

```bash
# Run tests with tracing
npx playwright test --trace on

# View traces after test run
npx playwright show-trace test-results/trace.zip
```

### 3. Visual Debugging

```bash
# Run tests in headed mode to see browser
npx playwright test --headed

# Take screenshots on failure
npx playwright test --screenshot only-on-failure
```

## Best Practices

### Test Organization

```
tests/
  e2e/
    storybook.spec.ts        # Storybook navigation tests
    interactions.spec.ts     # User interaction tests
    visual.spec.ts          # Visual regression tests
    a11y.spec.ts            # Accessibility tests
  component/
    Button.ct.tsx           # Component tests
    Form.ct.tsx             # Form component tests
  integration/
    user-flows.spec.ts      # Full user journey tests
```

### Test Naming Conventions

```javascript
// Good naming
test('should render primary button with correct styling', async ({ page }) => {
	// test implementation
});

test('Button component - renders with label prop', async ({ mount }) => {
	// test implementation
});

// Avoid generic names
test('test button', async ({ page }) => {
	// too generic
});
```

### Browser Context Management

```javascript
test.describe('User Authentication', () => {
	test.beforeEach(async ({ page }) => {
		// Set up authenticated state
		await page.goto('/login');
		await page.fill('[data-testid="email"]', 'user@example.com');
		await page.fill('[data-testid="password"]', 'password');
		await page.click('[data-testid="login-button"]');
	});

	test('should show authenticated content', async ({ page }) => {
		await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
	});
});
```

## Integration with SvelteKit

### 1. Test SvelteKit Routes

```javascript
// tests/e2e/routes.spec.ts
import { test, expect } from '@playwright/test';

test.describe('SvelteKit Routes', () => {
	test('Home page loads correctly', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1')).toContainText('Welcome');
	});

	test('About page navigation', async ({ page }) => {
		await page.goto('/');
		await page.click('a[href="/about"]');
		await expect(page).toHaveURL('/about');
		await expect(page.locator('h1')).toContainText('About');
	});
});
```

### 2. Test SvelteKit API Routes

```javascript
// tests/e2e/api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
	test('should fetch user data', async ({ page }) => {
		await page.goto('/');

		// Intercept API calls
		const [response] = await Promise.all([
			page.waitForResponse('/api/users'),
			page.click('[data-testid="load-users"]')
		]);

		expect(response.ok()).toBeTruthy();
		const data = await response.json();
		expect(Array.isArray(data)).toBe(true);
	});
});
```

## Next Steps

With Playwright set up, you can now:

1. Write comprehensive E2E tests for your SvelteKit application
2. Test Storybook stories directly in the browser
3. Implement visual regression testing
4. Set up accessibility testing
5. Configure CI/CD pipelines for automated testing

Continue to the next section: [Stories in E2E Tests](./03-stories-in-e2e-tests.md)
