import { authTest } from './auth.fixtures';
import type { APIRequestContext } from '@playwright/test';

type ApiFixtures = {
	authenticatedAPI: APIRequestContext;
	apiHelpers: {
		createChat: (title: string) => Promise<{ id: string }>;
		deleteChat: (id: string) => Promise<void>;
		getChatHistory: () => Promise<unknown[]>;
		uploadFile: (file: Buffer, filename: string) => Promise<{ url: string }>;
	};
};

export const apiTest = authTest.extend<ApiFixtures>({
	authenticatedAPI: async ({ playwright, workerStorageState }, use) => {
		const context = await playwright.request.newContext({
			baseURL: process.env.BASE_URL || 'http://localhost:4173',
			storageState: workerStorageState,
			extraHTTPHeaders: {
				Accept: 'application/json'
			}
		});

		await use(context);
		await context.dispose();
	},

	apiHelpers: async ({ authenticatedAPI }, use) => {
		const helpers = {
			createChat: async (title: string) => {
				const response = await authenticatedAPI.post('/api/chat', {
					data: { title }
				});

				if (!response.ok()) {
					throw new Error(`Failed to create chat: ${response.status()} ${await response.text()}`);
				}

				return response.json();
			},

			deleteChat: async (id: string) => {
				const response = await authenticatedAPI.delete(`/api/chat/${id}`);

				if (!response.ok()) {
					throw new Error(`Failed to delete chat: ${response.status()}`);
				}
			},

			getChatHistory: async () => {
				const response = await authenticatedAPI.get('/api/history');

				if (!response.ok()) {
					throw new Error(`Failed to get chat history: ${response.status()}`);
				}

				return response.json();
			},

			uploadFile: async (file: Buffer, filename: string) => {
				const response = await authenticatedAPI.post('/api/files/upload', {
					multipart: {
						file: {
							name: filename,
							mimeType: 'application/octet-stream',
							buffer: file
						}
					}
				});

				if (!response.ok()) {
					throw new Error(`Failed to upload file: ${response.status()}`);
				}

				return response.json();
			}
		};

		await use(helpers);
	}
});

export { expect } from '@playwright/test';
