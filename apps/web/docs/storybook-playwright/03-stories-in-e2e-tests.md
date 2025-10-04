# Stories in End-to-End Tests

<!-- Verified via: mcp_context7_get-library-docs on 2025-10-03 -->

## Overview

Stories in end-to-end tests enable you to run Playwright tests against your Storybook stories in a real browser environment. This powerful feature allows you to test component behavior, interactions, and visual states directly through Storybook's iframe, providing a seamless bridge between component development and end-to-end testing.

## Why Test Stories in E2E?

Testing Storybook stories with Playwright provides several key benefits:

- **Real Browser Testing**: Test components in actual browser environments
- **Visual Verification**: Screenshot-based testing of component appearance
- **Interaction Testing**: Test user interactions and state changes
- **Cross-browser Compatibility**: Ensure components work across different browsers
- **Accessibility Testing**: Verify a11y compliance in real browser contexts
- **Performance Testing**: Measure component rendering performance

## Installation

<!-- Verified via: mcp_context7_get-library-docs (Playwright) on 2025-10-03 -->

```bash
npm install --save-dev @playwright/test @playwright/experimental-ct-svelte
```

## Configuration

### Playwright Configuration for Storybook

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',

	use: {
		baseURL: 'http://127.0.0.1:6006',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},

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
		}
	],

	webServer: {
		command: 'npm run storybook',
		url: 'http://127.0.0.1:6006',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000
	}
});
```

## Basic Story Testing

### Navigate to Storybook Stories

```typescript
// tests/storybook.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Storybook Stories', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:6006');
	});

	test('Storybook loads correctly', async ({ page }) => {
		await expect(page.locator('[data-testid="storybook-explorer-tree"]')).toBeVisible();
		await expect(page.locator('[data-testid="storybook-preview-iframe"]')).toBeVisible();
	});

	test('can navigate to ProfileForm component stories', async ({ page }) => {
		await page
			.locator('[data-testid="storybook-explorer-tree"] button:has-text("ProfileForm")')
			.click();
		await expect(page.locator('[data-testid="storybook-panel-root"]')).toBeVisible();
	});
});
```

## Advanced: Testing the Profile Form Story

<!-- Verified via: mcp_context7_get-library-docs (Playwright, Storybook) on 2025-10-03 -->

### Complete E2E Test with Iframe Interaction

```typescript
// tests/profile-form-stories.spec.ts
import { test, expect } from '@playwright/test';

test.describe('ProfileForm Stories E2E', () => {
	test('CompleteUserFlow story renders and executes correctly', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--complete-user-flow');

		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await test.step('Verify initial state', async () => {
			await expect(storyFrame.getByTestId('firstName')).toBeVisible();
			await expect(storyFrame.getByTestId('lastName')).toBeVisible();
			await expect(storyFrame.getByTestId('email')).toBeVisible();
			await expect(storyFrame.getByTestId('bio')).toBeVisible();
			await expect(storyFrame.getByTestId('enrichButton')).toBeEnabled();
			await expect(storyFrame.getByTestId('submitButton')).toBeEnabled();
		});

		await test.step('Fill form fields', async () => {
			await storyFrame.getByTestId('firstName').fill('Alice');
			await storyFrame.getByTestId('lastName').fill('Johnson');
			await storyFrame.getByTestId('email').fill('alice.johnson@example.com');

			await expect(storyFrame.getByTestId('firstName')).toHaveValue('Alice');
			await expect(storyFrame.getByTestId('lastName')).toHaveValue('Johnson');
		});

		await test.step('Test profile enrichment', async () => {
			await storyFrame.getByTestId('enrichButton').click();

			await expect(storyFrame.getByTestId('enrichButton')).toBeDisabled();
			await expect(storyFrame.getByTestId('enrichButton')).toContainText(/Enriching/i);

			await expect(storyFrame.getByTestId('enrichButton')).not.toBeDisabled({ timeout: 3000 });
		});

		await test.step('Complete enriched fields', async () => {
			await storyFrame
				.getByTestId('bio')
				.fill('Expert TypeScript developer with focus on modern web applications');
			await storyFrame.getByTestId('yearsExperience').fill('8');

			await expect(storyFrame.getByTestId('bio')).toHaveValue(/Expert TypeScript developer/);
		});

		await test.step('Submit form', async () => {
			await storyFrame.getByTestId('submitButton').click();

			await expect(storyFrame.getByTestId('submitButton')).toBeDisabled();
			await expect(storyFrame.getByTestId('submitButton')).toContainText(/Saving/i);
		});
	});

	test('ValidationErrors story displays errors correctly', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--validation-errors');

		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await test.step('Submit empty form', async () => {
			await storyFrame.getByTestId('submitButton').click();
		});

		await test.step('Verify validation errors appear', async () => {
			await expect(storyFrame.getByText(/First name is required/i)).toBeVisible();
			await expect(storyFrame.getByText(/Last name is required/i)).toBeVisible();
			await expect(storyFrame.getByText(/Email is required/i)).toBeVisible();

			const firstNameInput = storyFrame.getByTestId('firstName');
			await expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
		});

		await test.step('Fix errors incrementally', async () => {
			await storyFrame.getByTestId('firstName').fill('Bob');

			await expect(storyFrame.getByText(/First name is required/i)).not.toBeVisible();

			await storyFrame.getByTestId('lastName').fill('Williams');
			await storyFrame.getByTestId('email').fill('bob.williams@example.com');

			await expect(storyFrame.getByText(/Last name is required/i)).not.toBeVisible();
			await expect(storyFrame.getByText(/Email is required/i)).not.toBeVisible();
		});
	});

	test('LoadingState story shows loading indicator', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--loading-state');

		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await test.step('Verify loading state', async () => {
			const loadingIndicator = storyFrame.getByRole('status');
			await expect(loadingIndicator).toBeVisible();
			await expect(loadingIndicator).toContainText(/Processing/i);
		});
	});
});
```

## Testing Multiple Stories Systematically

```typescript
// tests/all-stories.spec.ts
import { test, expect } from '@playwright/test';

const stories = [
	{
		path: '/story/forms-profileform--default',
		name: 'Default',
		tests: async (frame) => {
			await expect(frame.getByTestId('firstName')).toBeVisible();
			await expect(frame.getByTestId('enrichButton')).toBeEnabled();
		}
	},
	{
		path: '/story/forms-profileform--complete-user-flow',
		name: 'Complete User Flow',
		tests: async (frame) => {
			await frame.getByTestId('firstName').fill('Test');
			await expect(frame.getByTestId('firstName')).toHaveValue('Test');
		}
	},
	{
		path: '/story/forms-profileform--validation-errors',
		name: 'Validation Errors',
		tests: async (frame) => {
			await frame.getByTestId('submitButton').click();
			await expect(frame.getByText(/First name is required/i)).toBeVisible();
		}
	}
];

test.describe('All ProfileForm Stories', () => {
	for (const story of stories) {
		test(`${story.name} story renders and behaves correctly`, async ({ page }) => {
			await page.goto(`http://localhost:6006/?path=${story.path}`);
			await page.waitForLoadState('networkidle');

			const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

			await story.tests(storyFrame);
		});
	}
});
```

## Visual Regression Testing

```typescript
// tests/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
	test('ProfileForm Default state screenshot', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--default');
		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await expect(storyFrame.locator('form')).toHaveScreenshot('profile-form-default.png');
	});

	test('ProfileForm with validation errors screenshot', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--validation-errors');
		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await storyFrame.getByTestId('submitButton').click();

		await page.waitForTimeout(500);

		await expect(storyFrame.locator('form')).toHaveScreenshot('profile-form-errors.png');
	});

	test('ProfileForm responsive - mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--default');
		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await expect(storyFrame.locator('form')).toHaveScreenshot('profile-form-mobile.png');
	});
});
```

## Accessibility Testing in Stories

<!-- Verified via: mcp_context7_get-library-docs (Playwright) on 2025-10-03 -->

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
	test('ProfileForm Default story meets WCAG standards', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--default');
		await page.waitForLoadState('networkidle');

		const accessibilityScanResults = await new AxeBuilder({ page })
			.include('[data-testid="storybook-preview-iframe"]')
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('ProfileForm with errors has proper ARIA attributes', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--validation-errors');
		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await storyFrame.getByTestId('submitButton').click();

		await test.step('Verify ARIA attributes on invalid fields', async () => {
			const firstNameInput = storyFrame.getByTestId('firstName');
			await expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
			await expect(firstNameInput).toHaveAttribute('aria-describedby', 'firstName-error');

			const errorMessage = storyFrame.getByRole('alert').first();
			await expect(errorMessage).toBeVisible();
		});
	});

	test('ProfileForm keyboard navigation works correctly', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--default');
		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await test.step('Tab through form fields', async () => {
			await page.keyboard.press('Tab');
			await expect(storyFrame.getByTestId('firstName')).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(storyFrame.getByTestId('lastName')).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(storyFrame.getByTestId('email')).toBeFocused();
		});
	});
});
```

## Performance Testing

```typescript
// tests/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
	test('ProfileForm story loads within performance budget', async ({ page }) => {
		const startTime = Date.now();

		await page.goto('http://localhost:6006/?path=/story/forms-profileform--complete-user-flow');
		await page.waitForLoadState('networkidle');

		const loadTime = Date.now() - startTime;

		expect(loadTime).toBeLessThan(3000);
	});

	test('ProfileForm interactions are responsive', async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--complete-user-flow');
		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		const startTime = Date.now();

		await storyFrame.getByTestId('firstName').fill('Performance Test');
		await storyFrame.getByTestId('lastName').fill('User');
		await storyFrame.getByTestId('email').fill('test@performance.com');

		const interactionTime = Date.now() - startTime;

		expect(interactionTime).toBeLessThan(1000);
	});
});
```

## Mocking API Calls in Tests

```typescript
// tests/api-mocking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Mocking Tests', () => {
	test('ProfileForm enrichment with mocked API', async ({ page }) => {
		await page.route('**/api/profile/enrich', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					suggestedBio: 'Mocked bio from API',
					suggestedSkills: ['Mocked Skill 1', 'Mocked Skill 2'],
					estimatedExperience: 10
				})
			});
		});

		await page.goto('http://localhost:6006/?path=/story/forms-profileform--complete-user-flow');
		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await storyFrame.getByTestId('firstName').fill('Mock');
		await storyFrame.getByTestId('lastName').fill('User');
		await storyFrame.getByTestId('email').fill('mock@example.com');

		await storyFrame.getByTestId('enrichButton').click();

		await expect(storyFrame.getByTestId('enrichButton')).not.toBeDisabled({ timeout: 3000 });

		await expect(storyFrame.getByTestId('bio')).toHaveValue(/Mocked bio from API/);
	});

	test('ProfileForm handles API errors gracefully', async ({ page }) => {
		await page.route('**/api/profile/enrich', async (route) => {
			await route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ error: 'Internal Server Error' })
			});
		});

		await page.goto('http://localhost:6006/?path=/story/forms-profileform--complete-user-flow');
		await page.waitForLoadState('networkidle');

		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await storyFrame.getByTestId('email').fill('error@example.com');
		await storyFrame.getByTestId('enrichButton').click();

		await expect(storyFrame.getByText(/Something went wrong/i)).toBeVisible({ timeout: 3000 });
	});
});
```

## Best Practices

### 1. Use Data-testid for Reliable Selectors

```typescript
await storyFrame.getByTestId('firstName').fill('John');
```

### 2. Wait for Network Idle

```typescript
await page.waitForLoadState('networkidle');
```

### 3. Use Step Functions for Clarity

```typescript
await test.step('Fill form', async () => {
	// Test logic
});
```

### 4. Handle Iframes Properly

```typescript
const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();
```

### 5. Set Appropriate Timeouts

```typescript
await expect(element).toBeVisible({ timeout: 5000 });
```

## Next Steps

With stories in E2E tests configured, you can:

1. Test all Storybook stories in real browsers
2. Verify component rendering and interactions
3. Perform visual and accessibility testing
4. Validate API integration and error handling
5. Run comprehensive cross-browser tests

Continue to: **Interaction Testing** for advanced play functions.
