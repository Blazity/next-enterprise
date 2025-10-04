import { authTest } from './auth.fixtures';
import { HomePage } from '../page-objects/home.page';
import { LoginPage } from '../page-objects/auth/login.page';
import { SignupPage } from '../page-objects/auth/signup.page';
import { ChatPage } from '../page-objects/chat/chat.page';
import { ProfilePage } from '../page-objects/profile/profile.page';

type PageObjectFixtures = {
	homePage: HomePage;
	loginPage: LoginPage;
	signupPage: SignupPage;
	chatPage: ChatPage;
	profilePage: ProfilePage;
};

export const pageObjectTest = authTest.extend<PageObjectFixtures>({
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);
		await homePage.goto();
		await use(homePage);
	},

	loginPage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await use(loginPage);
	},

	signupPage: async ({ page }, use) => {
		const signupPage = new SignupPage(page);
		await signupPage.goto();
		await use(signupPage);
	},

	chatPage: async ({ authenticatedPage }, use) => {
		const chatPage = new ChatPage(authenticatedPage);
		await chatPage.goto();
		await use(chatPage);
	},

	profilePage: async ({ authenticatedPage }, use) => {
		const profilePage = new ProfilePage(authenticatedPage);
		await profilePage.goto();
		await use(profilePage);
	}
});

export { expect } from '@playwright/test';
