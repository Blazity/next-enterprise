import { test, expect } from '../../fixtures';

test.describe('Profile Page - Authenticated', () => {
	test('should not have any console errors', async ({ authenticatedPage }) => {
		const errors: string[] = [];

		authenticatedPage.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		authenticatedPage.on('pageerror', (error) => {
			errors.push(error.message);
		});

		await authenticatedPage.goto('/profile');
		await authenticatedPage.waitForLoadState('networkidle');

		if (errors.length > 0) {
			const errorList = errors.map((err, i) => `${i + 1}. ${err}`).join('\n');
			throw new Error(`Found ${errors.length} console error(s):\n${errorList}`);
		}

		expect(errors).toHaveLength(0);
	});

	test('should not have any console warnings', async ({ authenticatedPage }) => {
		const warnings: string[] = [];
		const allowedWarnings = [/Download the React DevTools/i, /React DevTools/i, /Svelte DevTools/i];

		authenticatedPage.on('console', (msg) => {
			if (msg.type() === 'warning') {
				const text = msg.text();
				const isAllowed = allowedWarnings.some((pattern) => pattern.test(text));
				if (!isAllowed) {
					warnings.push(text);
				}
			}
		});

		await authenticatedPage.goto('/profile');
		await authenticatedPage.waitForLoadState('networkidle');

		if (warnings.length > 0) {
			const warningList = warnings.map((warn, i) => `${i + 1}. ${warn}`).join('\n');
			throw new Error(`Found ${warnings.length} console warning(s):\n${warningList}`);
		}

		expect(warnings).toHaveLength(0);
	});

	test('should not have any failed HTTP requests', async ({ authenticatedPage }) => {
		const failedRequests: Array<{ url: string; status: number }> = [];

		authenticatedPage.on('response', (response) => {
			if (response.status() >= 400) {
				failedRequests.push({
					url: response.url(),
					status: response.status()
				});
			}
		});

		await authenticatedPage.goto('/profile');
		await authenticatedPage.waitForLoadState('networkidle');

		if (failedRequests.length > 0) {
			const requestList = failedRequests
				.map((req, i) => `${i + 1}. [${req.status}] ${req.url}`)
				.join('\n');
			throw new Error(`Found ${failedRequests.length} failed request(s):\n${requestList}`);
		}

		expect(failedRequests).toHaveLength(0);
	});

	test('should have valid HTML structure', async ({ authenticatedPage }) => {
		await authenticatedPage.goto('/profile');
		await authenticatedPage.waitForLoadState('networkidle');

		const html = await authenticatedPage.content();

		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('<html');
		expect(html).toContain('<head>');
		expect(html).toContain('<body>');

		const title = await authenticatedPage.title();
		expect(title).toBeTruthy();
		expect(title.length).toBeGreaterThan(0);
	});

	test('should not have basic accessibility violations', async ({ authenticatedPage }) => {
		await authenticatedPage.goto('/profile');
		await authenticatedPage.waitForLoadState('networkidle');

		const accessibilityIssues: string[] = [];

		const missingAltImages = await authenticatedPage.locator('img:not([alt])').count();
		if (missingAltImages > 0) {
			accessibilityIssues.push(`Found ${missingAltImages} images without alt attributes`);
		}

		const emptyLinks = await authenticatedPage.locator('a:not([href]), a[href=""]').count();
		if (emptyLinks > 0) {
			accessibilityIssues.push(`Found ${emptyLinks} links without href attributes`);
		}

		const buttonsWithoutType = await authenticatedPage.locator('button:not([type])').count();
		if (buttonsWithoutType > 0) {
			accessibilityIssues.push(`Found ${buttonsWithoutType} buttons without type attribute`);
		}

		if (accessibilityIssues.length > 0) {
			const errorReport = accessibilityIssues
				.map((msg, index) => `${index + 1}. ${msg}`)
				.join('\n');

			throw new Error(
				`Found ${accessibilityIssues.length} accessibility issue(s):\n\n${errorReport}`
			);
		}

		expect(accessibilityIssues).toHaveLength(0);
	});

	test('should load profile page', async ({ authenticatedPage }) => {
		await authenticatedPage.goto('/profile');
		await authenticatedPage.waitForLoadState('networkidle');

		await expect(authenticatedPage).toHaveURL(/\/profile/);
	});
});
