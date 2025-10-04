import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
	readonly page: Page;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;
	readonly errorMessage: Locator;
	readonly signupLink: Locator;
	readonly heading: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailInput = page.getByLabel(/email/i);
		this.passwordInput = page.getByLabel(/password/i);
		this.submitButton = page.getByRole('button', { name: /log in|sign in/i });
		this.errorMessage = page.locator('[data-testid="error-message"]');
		this.signupLink = page.getByRole('link', { name: /sign up/i });
		this.heading = page.getByRole('heading', { name: /log in|sign in/i });
	}

	async goto() {
		await this.page.goto('/auth/login');
		await this.page.waitForLoadState('networkidle');
	}

	async login(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();
	}

	async expectError(message: string) {
		await expect(this.errorMessage).toContainText(message);
	}

	async goToSignup() {
		await this.signupLink.click();
		await this.page.waitForURL('/auth/signup');
	}
}
