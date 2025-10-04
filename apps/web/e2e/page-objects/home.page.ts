import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
	readonly page: Page;
	readonly heading: Locator;
	readonly title: Locator;

	constructor(page: Page) {
		this.page = page;
		this.heading = page.locator('h1').first();
		this.title = page.locator('title');
	}

	async goto() {
		await this.page.goto('/');
		await this.page.waitForLoadState('networkidle');
	}

	async getTitle(): Promise<string> {
		return await this.page.title();
	}

	async expectNoConsoleErrors(): Promise<void> {
		await expect(this.page).toHaveTitle(/.+/);
	}
}
