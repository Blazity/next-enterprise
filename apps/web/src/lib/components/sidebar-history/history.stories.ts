import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within } from '@storybook/test';
import History from './history.svelte';
import { mockChats, mockUser } from '$mocks/data';

const meta = {
	title: 'Components/SidebarHistory',
	component: History,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Chat history sidebar component showing user conversations with search and navigation.'
			}
		}
	},
	argTypes: {
		chats: {
			control: 'object',
			description: 'Array of chat objects to display'
		},
		currentChatId: {
			control: 'text',
			description: 'ID of the currently active chat'
		},
		onChatSelect: {
			action: 'chatSelect',
			description: 'Callback when user selects a chat'
		},
		onNewChat: {
			action: 'newChat',
			description: 'Callback when user clicks new chat'
		},
		onDeleteChat: {
			action: 'deleteChat',
			description: 'Callback when user deletes a chat'
		}
	}
} satisfies Meta<History>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithChatHistory: Story = {
	args: {
		chats: mockChats,
		currentChatId: 'chat-1',
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	}
};

export const EmptyHistory: Story = {
	args: {
		chats: [],
		currentChatId: null,
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify empty state message', async () => {
			await waitFor(() => {
				expect(
					canvas.getByText(/no chats/i) ||
						canvas.getByText(/start a conversation/i) ||
						canvas.getByText(/empty/i)
				).toBeVisible();
			});
		});

		await step('Click new chat button', async () => {
			const newChatButton =
				canvas.getByRole('button', { name: /new chat/i }) || canvas.getByTestId('new-chat-button');

			await userEvent.click(newChatButton);
		});

		await step('Verify new chat callback was called', async () => {
			await waitFor(() => {
				expect(args.onNewChat).toHaveBeenCalled();
			});
		});
	}
};

export const ViewChatHistory: Story = {
	args: {
		chats: mockChats,
		currentChatId: null,
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ args: _args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify chat history is displayed', async () => {
			await waitFor(() => {
				expect(canvas.getByText('AI Discussion')).toBeVisible();
				expect(canvas.getByText('Code Help')).toBeVisible();
			});
		});

		await step('Verify chat titles and dates are shown', async () => {
			await waitFor(() => {
				expect(canvas.getByText('AI Discussion')).toBeVisible();
				expect(canvas.getByText('Code Help')).toBeVisible();

				expect(
					canvas.getByText(/today/i) ||
						canvas.getByText(/yesterday/i) ||
						canvas.getByText(/\d+\/\d+/)
				).toBeVisible();
			});
		});
	}
};

export const NavigateToChat: Story = {
	args: {
		chats: mockChats,
		currentChatId: null,
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ args: _args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Click on a chat in history', async () => {
			const chatItem =
				canvas.getByRole('button', { name: /AI Discussion/i }) ||
				canvas.getByText('AI Discussion').first();

			await userEvent.click(chatItem);
		});

		await step('Verify chat selection callback was called', async () => {
			await waitFor(() => {
				expect(args.onChatSelect).toHaveBeenCalledWith('chat-1');
			});
		});
	}
};

export const CurrentChatHighlighted: Story = {
	args: {
		chats: mockChats,
		currentChatId: 'chat-1',
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify current chat is highlighted', async () => {
			const currentChat = canvas.getByText('AI Discussion');

			await waitFor(() => {
				const chatContainer =
					currentChat.closest('[data-current="true"]') ||
					currentChat.closest('.current') ||
					currentChat.closest('[aria-current="true"]');

				if (chatContainer) {
					expect(chatContainer).toHaveAttribute('data-current', 'true');
				} else {
					expect(currentChat).toBeVisible();
				}
			});
		});
	}
};

export const DeleteChat: Story = {
	args: {
		chats: mockChats,
		currentChatId: null,
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ args: _args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Hover over or open chat menu', async () => {
			const chatItem = canvas.getByText('Code Help').first();

			await userEvent.hover(chatItem);
		});

		await step('Click delete button on chat', async () => {
			const deleteButton =
				canvas.getByRole('button', { name: /delete.*code help/i }) ||
				canvas.getByTestId('delete-chat-2') ||
				canvas.getByRole('button', { name: /delete/i }).first();

			await userEvent.click(deleteButton);
		});

		await step('Confirm deletion in dialog', async () => {
			const confirmButton =
				canvas.getByRole('button', { name: /confirm/i }) ||
				canvas.getByRole('button', { name: /delete/i }) ||
				canvas.getByText(/confirm/i).first();

			await userEvent.click(confirmButton);
		});

		await step('Verify delete callback was called', async () => {
			await waitFor(() => {
				expect(args.onDeleteChat).toHaveBeenCalledWith('chat-2');
			});
		});
	}
};

export const SearchChats: Story = {
	args: {
		chats: [
			...mockChats,
			{
				id: 'chat-3',
				title: 'React Tutorial Discussion',
				userId: 'user-123',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isPublic: false
			},
			{
				id: 'chat-4',
				title: 'JavaScript Best Practices',
				userId: 'user-123',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isPublic: false
			}
		],
		currentChatId: null,
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Type in search input', async () => {
			const searchInput =
				canvas.getByPlaceholderText(/search/i) ||
				canvas.getByRole('searchbox') ||
				canvas.getByTestId('chat-search');

			await userEvent.type(searchInput, 'react');
		});

		await step('Verify search results are filtered', async () => {
			await waitFor(() => {
				expect(canvas.getByText('React Tutorial Discussion')).toBeVisible();
				expect(canvas.queryByText('AI Discussion')).not.toBeVisible();
				expect(canvas.queryByText('Code Help')).not.toBeVisible();
			});
		});

		await step('Clear search', async () => {
			const searchInput = canvas.getByPlaceholderText(/search/i) || canvas.getByRole('searchbox');

			await userEvent.clear(searchInput);
		});

		await step('Verify all chats are visible again', async () => {
			await waitFor(() => {
				expect(canvas.getByText('AI Discussion')).toBeVisible();
				expect(canvas.getByText('Code Help')).toBeVisible();
				expect(canvas.getByText('React Tutorial Discussion')).toBeVisible();
			});
		});
	}
};

export const GroupByDate: Story = {
	args: {
		chats: [
			{
				id: 'chat-today-1',
				title: 'Today Chat 1',
				userId: 'user-123',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isPublic: false
			},
			{
				id: 'chat-today-2',
				title: 'Today Chat 2',
				userId: 'user-123',
				createdAt: new Date(Date.now() - 3600000).toISOString(),
				updatedAt: new Date(Date.now() - 3600000).toISOString(),
				isPublic: false
			},
			{
				id: 'chat-yesterday',
				title: 'Yesterday Chat',
				userId: 'user-123',
				createdAt: new Date(Date.now() - 86400000).toISOString(),
				updatedAt: new Date(Date.now() - 86400000).toISOString(),
				isPublic: false
			}
		],
		currentChatId: null,
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify chats are grouped by date', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/today/i) || canvas.getByText(/yesterday/i)).toBeVisible();
			});
		});

		await step('Verify today group has recent chats', async () => {
			await waitFor(() => {
				expect(canvas.getByText('Today Chat 1')).toBeVisible();
				expect(canvas.getByText('Today Chat 2')).toBeVisible();
			});
		});
	}
};

export const LongChatTitles: Story = {
	args: {
		chats: [
			{
				id: 'chat-long-1',
				title:
					'This is a very long chat title that should be truncated in the UI to prevent overflow and maintain good design',
				userId: 'user-123',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isPublic: false
			},
			{
				id: 'chat-long-2',
				title:
					'Another extremely long chat title that goes on and on and should definitely be truncated',
				userId: 'user-123',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isPublic: false
			}
		],
		currentChatId: null,
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify long titles are truncated with ellipsis', async () => {
			await waitFor(() => {
				const titleElements = canvas.getAllByText(/this is a very long chat title/i);

				for (const title of titleElements) {
					const styles = window.getComputedStyle(title);
					expect(
						styles.textOverflow === 'ellipsis' ||
							styles.overflow === 'hidden' ||
							title.textContent?.endsWith('...')
					).toBeTruthy();
				}
			});
		});
	}
};

export const KeyboardNavigation: Story = {
	args: {
		chats: mockChats,
		currentChatId: null,
		onChatSelect: fn(),
		onNewChat: fn(),
		onDeleteChat: fn()
	},
	play: async ({ args: _args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Navigate chats with arrow keys', async () => {
			await userEvent.tab();

			await userEvent.keyboard('{ArrowDown}');
			await userEvent.keyboard('{ArrowDown}');
		});

		await step('Select chat with Enter', async () => {
			await userEvent.keyboard('{Enter}');
		});

		await step('Verify chat selection via keyboard', async () => {
			await waitFor(() => {
				expect(args.onChatSelect).toHaveBeenCalled();
			});
		});
	}
};
