import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within, waitFor } from '@storybook/test';
import LoadFunction from './+page.svelte';

const meta = {
	title: 'Examples/Data Fetching/Load Function',
	component: LoadFunction,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Demonstrates SvelteKit load function for data fetching.'
			}
		},

		sveltekit_experimental: {
			stores: {
				page: {
					data: {
						items: [
							{ id: 1, name: 'Item 1', description: 'First item' },
							{ id: 2, name: 'Item 2', description: 'Second item' },
							{ id: 3, name: 'Item 3', description: 'Third item' }
						]
					}
				}
			}
		}
	}
} satisfies Meta<LoadFunction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(
			() => {
				const items = canvas.queryAllByRole('listitem') || canvas.queryAllByRole('article');
				expect(items.length).toBeGreaterThan(0);
			},
			{ timeout: 3000 }
		);
	}
};

export const LoadingState: Story = {
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					data: null
				}
			}
		}
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const loadingIndicator = canvas.queryByText(/loading/i) || canvas.queryByRole('status');

		if (loadingIndicator) {
			await expect(loadingIndicator).toBeInTheDocument();
		}
	}
};

export const EmptyState: Story = {
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					data: {
						items: []
					}
				}
			}
		}
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(() => {
			const emptyMessage = canvas.queryByText(/no items/i) || canvas.queryByText(/empty/i);
			if (emptyMessage) {
				expect(emptyMessage).toBeInTheDocument();
			}
		});
	}
};

export const DataDisplay: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(
			() => {
				const item1 = canvas.queryByText(/Item 1/i);
				const item2 = canvas.queryByText(/Item 2/i);
				const item3 = canvas.queryByText(/Item 3/i);

				if (item1 && item2 && item3) {
					expect(item1).toBeInTheDocument();
					expect(item2).toBeInTheDocument();
					expect(item3).toBeInTheDocument();
				}
			},
			{ timeout: 3000 }
		);
	}
};
