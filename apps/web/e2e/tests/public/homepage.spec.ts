import { publicTest as test, expect } from '../../fixtures';

test.describe('Homepage - Basic Tests', () => {
	test('should display homepage', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const title = await page.title();
		expect(title).toBeTruthy();
	});

	test('should have no JavaScript errors on load', async ({ page }) => {
		const jsErrors: string[] = [];

		page.on('pageerror', (error) => {
			jsErrors.push(`${error.name}: ${error.message}`);
		});

		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(2000);

		if (jsErrors.length > 0) {
			const errorReport = jsErrors.map((msg, index) => `${index + 1}. ${msg}`).join('\n\n');
			throw new Error(
				`Found ${jsErrors.length} JavaScript error(s) on homepage:\n\n${errorReport}`
			);
		}

		expect(jsErrors).toHaveLength(0);
	});

	test('should load all critical resources', async ({ page }) => {
		const failedResources: string[] = [];

		page.on('requestfailed', (request) => {
			failedResources.push(`${request.url()}: ${request.failure()?.errorText || 'Unknown'}`);
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		if (failedResources.length > 0) {
			const resourceList = failedResources.map((res, i) => `${i + 1}. ${res}`).join('\n');
			throw new Error(`Failed to load ${failedResources.length} resource(s):\n${resourceList}`);
		}

		expect(failedResources).toHaveLength(0);
	});
});
