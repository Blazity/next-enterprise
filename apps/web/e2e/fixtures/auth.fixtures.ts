import { test as base } from '@playwright/test';
import { baseTest } from './base.fixtures';
import type { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export type User = {
	email: string;
	password: string;
	id?: string;
	name?: string;
};

type AuthFixtures = {
	authenticatedPage: Page;
	testUser: User;
};

type AuthWorkerFixtures = {
	workerUser: User;
	workerStorageState: string;
};

export const authTest = baseTest.extend<AuthFixtures, AuthWorkerFixtures>({
	workerUser: [
		async ({ browser }, use, workerInfo) => {
			const user: User = {
				email: `worker-${workerInfo.workerIndex}-${Date.now()}@test.com`,
				password: 'Test123!@#',
				name: `Worker ${workerInfo.workerIndex}`
			};

			console.log(`🔧 [Worker ${workerInfo.workerIndex}] Creating user: ${user.email}`);

			const page = await browser.newPage();
			try {
				await page.goto('/auth/signup');
				await page.fill('[name="email"]', user.email);
				await page.fill('[name="password"]', user.password);
				await page.click('button[type="submit"]');
				await page.waitForURL('/chat', { timeout: 10000 });

				console.log(`✅ [Worker ${workerInfo.workerIndex}] User created successfully`);
			} catch (error) {
				console.error(`❌ [Worker ${workerInfo.workerIndex}] Failed to create user:`, error);
				throw error;
			} finally {
				await page.close();
			}

			await use(user);

			console.log(`🧹 [Worker ${workerInfo.workerIndex}] Cleaning up user`);
		},
		{ scope: 'worker' }
	],

	workerStorageState: [
		async ({ browser, workerUser }, use, workerInfo) => {
			const authDir = path.join(__dirname, '../.auth');
			await fs.promises.mkdir(authDir, { recursive: true });

			const storageStateFile = path.join(authDir, `worker-${workerInfo.workerIndex}.json`);

			console.log(`🔐 [Worker ${workerInfo.workerIndex}] Creating auth state`);

			const page = await browser.newPage();
			try {
				await page.goto('/auth/login');
				await page.fill('[name="email"]', workerUser.email);
				await page.fill('[name="password"]', workerUser.password);
				await page.click('button[type="submit"]');
				await page.waitForURL('/chat', { timeout: 10000 });

				await page.context().storageState({ path: storageStateFile });

				console.log(`✅ [Worker ${workerInfo.workerIndex}] Auth state saved`);
			} catch (error) {
				console.error(`❌ [Worker ${workerInfo.workerIndex}] Failed to create auth state:`, error);
				throw error;
			} finally {
				await page.close();
			}

			await use(storageStateFile);

			await fs.promises.unlink(storageStateFile).catch(() => {});
		},
		{ scope: 'worker' }
	],

	testUser: async ({ browser }, use) => {
		const user: User = {
			email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`,
			password: 'Test123!@#',
			name: 'Test User'
		};

		console.log(`👤 Creating test user: ${user.email}`);

		const page = await browser.newPage();
		try {
			await page.goto('/auth/signup');
			await page.fill('[name="email"]', user.email);
			await page.fill('[name="password"]', user.password);
			await page.click('button[type="submit"]');
			await page.waitForURL('/chat');
		} finally {
			await page.close();
		}

		await use(user);
	},

	authenticatedPage: async ({ browser, workerStorageState }, use) => {
		const context = await browser.newContext({
			storageState: workerStorageState
		});
		const page = await context.newPage();

		await use(page);

		await page.close();
		await context.close();
	}
});

export { expect } from '@playwright/test';
