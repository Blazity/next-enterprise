import type { Preview } from '@storybook/sveltekit';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { spyOn, fn } from 'storybook/test';

if (typeof window !== 'undefined') {
	initialize();
}

const mockQueries = {
	getChatsByUserId: fn().mockResolvedValue({
		ok: true,
		value: [
			{
				id: 'chat-1',
				userId: 'user-1',
				title: 'Test Chat',
				createdAt: new Date(),
				visibility: 'private'
			}
		]
	}),
	getChatById: fn().mockResolvedValue({
		ok: true,
		value: {
			id: 'chat-1',
			userId: 'user-1',
			title: 'Test Chat',
			createdAt: new Date(),
			visibility: 'private'
		}
	}),
	getMessagesByChatId: fn().mockResolvedValue({
		ok: true,
		value: []
	}),
	getUserById: fn().mockResolvedValue({
		ok: true,
		value: {
			id: 'user-1',
			email: 'test@example.com',
			username: 'testuser'
		}
	})
};

if (typeof window !== 'undefined') {
	(window as any).__mockQueries = mockQueries;
}

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		a11y: {
			test: 'error'
		},
		docs: {
			theme: {
				base: 'light',
				brandTitle: 'SvelteKit AI Chatbot'
			}
		}
	},
	loaders: [mswLoader],
	async beforeEach() {
		spyOn(console, 'log').mockName('console.log');
		spyOn(console, 'warn').mockName('console.warn');
		spyOn(console, 'error').mockName('console.error');
	}
};

export default preview;
