import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
	readonly page: Page;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;
	readonly errorMessage: Locator;
	readonly loginLink: Locator;
	readonly heading: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailInput = page.getByLabel(/email/i);
		this.passwordInput = page.getByLabel(/password/i);
		this.submitButton = page.getByRole('button', { name: /sign up|create account/i });
		this.errorMessage = page.locator('[data-testid="error-message"]');
		this.loginLink = page.getByRole('link', { name: /log in|sign in/i });
		this.heading = page.getByRole('heading', { name: /sign up|create account/i });
	}

	async goto() {
		await this.page.goto('/auth/signup');
		await this.page.waitForLoadState('networkidle');
	}

	async signup(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();
	}

	async expectError(message: string) {
		await expect(this.errorMessage).toContainText(message);
	}

	async goToLogin() {
		await this.loginLink.click();
		await this.page.waitForURL('/auth/login');
	}
}
