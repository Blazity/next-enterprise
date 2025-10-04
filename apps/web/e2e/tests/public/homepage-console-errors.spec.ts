import { publicTest as test, expect } from '../../fixtures';

test.describe('Homepage - Console Errors', () => {
	test('should not have any console errors', async ({ page }) => {
		const errors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		page.on('pageerror', (error) => {
			errors.push(error.message);
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		if (errors.length > 0) {
			const errorList = errors.map((err, i) => `${i + 1}. ${err}`).join('\n');
			throw new Error(`Found ${errors.length} console error(s):\n${errorList}`);
		}

		expect(errors).toHaveLength(0);
	});

	test('should not have any console warnings', async ({ page }) => {
		const warnings: string[] = [];
		const allowedWarnings = [/Download the React DevTools/i, /React DevTools/i, /Svelte DevTools/i];

		page.on('console', (msg) => {
			if (msg.type() === 'warning') {
				const text = msg.text();
				const isAllowed = allowedWarnings.some((pattern) => pattern.test(text));
				if (!isAllowed) {
					warnings.push(text);
				}
			}
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		if (warnings.length > 0) {
			const warningList = warnings.map((warn, i) => `${i + 1}. ${warn}`).join('\n');
			throw new Error(`Found ${warnings.length} console warning(s):\n${warningList}`);
		}

		expect(warnings).toHaveLength(0);
	});

	test('should not have any failed HTTP requests', async ({ page }) => {
		const failedRequests: Array<{ url: string; status: number }> = [];

		page.on('response', (response) => {
			if (response.status() >= 400) {
				failedRequests.push({
					url: response.url(),
					status: response.status()
				});
			}
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		if (failedRequests.length > 0) {
			const requestList = failedRequests
				.map((req, i) => `${i + 1}. [${req.status}] ${req.url}`)
				.join('\n');
			throw new Error(`Found ${failedRequests.length} failed request(s):\n${requestList}`);
		}

		expect(failedRequests).toHaveLength(0);
	});

	test('should load successfully', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const title = await page.title();
		expect(title).toBeTruthy();
		expect(title.length).toBeGreaterThan(0);
	});

	test('should not have any unhandled promise rejections', async ({ page }) => {
		const unhandledRejections: string[] = [];

		page.on('pageerror', (error) => {
			if (
				error.message.includes('Unhandled Promise') ||
				error.message.includes('unhandledrejection')
			) {
				unhandledRejections.push(error.message);
			}
		});

		await page.evaluate(() => {
			window.addEventListener('unhandledrejection', (event) => {
				console.error('Unhandled Promise Rejection:', event.reason);
			});
		});

		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);

		if (unhandledRejections.length > 0) {
			const errorReport = unhandledRejections
				.map((msg, index) => `${index + 1}. ${msg}`)
				.join('\n');

			throw new Error(
				`Found ${unhandledRejections.length} unhandled promise rejection(s):\n\n${errorReport}`
			);
		}

		expect(unhandledRejections).toHaveLength(0);
	});

	test('should have valid HTML structure', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const html = await page.content();

		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('<html');
		expect(html).toContain('<head>');
		expect(html).toContain('<body>');

		const title = await page.title();
		expect(title).toBeTruthy();
		expect(title.length).toBeGreaterThan(0);
	});

	test('should not have basic accessibility violations', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const accessibilityIssues: string[] = [];

		const missingAltImages = await page.locator('img:not([alt])').count();
		if (missingAltImages > 0) {
			accessibilityIssues.push(`Found ${missingAltImages} images without alt attributes`);
		}

		const emptyLinks = await page.locator('a:not([href]), a[href=""]').count();
		if (emptyLinks > 0) {
			accessibilityIssues.push(`Found ${emptyLinks} links without href attributes`);
		}

		const buttonsWithoutType = await page.locator('button:not([type])').count();
		if (buttonsWithoutType > 0) {
			accessibilityIssues.push(`Found ${buttonsWithoutType} buttons without type attribute`);
		}

		if (accessibilityIssues.length > 0) {
			const errorReport = accessibilityIssues
				.map((msg, index) => `${index + 1}. ${msg}`)
				.join('\n');

			throw new Error(
				`Found ${accessibilityIssues.length} accessibility issue(s) on homepage:\n\n${errorReport}`
			);
		}

		expect(accessibilityIssues).toHaveLength(0);
	});
});
