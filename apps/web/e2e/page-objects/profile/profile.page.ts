import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
	readonly page: Page;
	readonly heading: Locator;
	readonly nameInput: Locator;
	readonly emailInput: Locator;
	readonly saveButton: Locator;
	readonly successMessage: Locator;

	constructor(page: Page) {
		this.page = page;
		this.heading = page.getByRole('heading', { name: /profile/i });
		this.nameInput = page.getByLabel(/name/i);
		this.emailInput = page.getByLabel(/email/i);
		this.saveButton = page.getByRole('button', { name: /save/i });
		this.successMessage = page.locator('[data-testid="success-message"]');
	}

	async goto() {
		await this.page.goto('/profile');
		await this.page.waitForLoadState('networkidle');
	}

	async updateProfile(name: string, email: string) {
		await this.nameInput.fill(name);
		await this.emailInput.fill(email);
		await this.saveButton.click();
	}

	async expectSuccess() {
		await expect(this.successMessage).toBeVisible();
	}
}
