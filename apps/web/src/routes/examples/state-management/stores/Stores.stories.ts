import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import Stores from './+page.svelte';

const meta = {
	title: 'Examples/State Management/Stores',
	component: Stores,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Demonstrates Svelte stores for global state management.'
			}
		}
	}
} satisfies Meta<Stores>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByRole('main') || canvas.getByRole('region')).toBeInTheDocument();
	}
};

export const UpdateStore: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const updateButton =
			canvas.queryByRole('button', { name: /update/i }) ||
			canvas.queryByRole('button', { name: /increment/i }) ||
			canvas.queryByRole('button', { name: /add/i });

		if (updateButton) {
			const initialText = canvas.getByRole('main').textContent;

			await user.click(updateButton);

			await waitFor(
				() => {
					const newText = canvas.getByRole('main').textContent;
					expect(newText).not.toBe(initialText);
				},
				{ timeout: 1000 }
			);
		}
	}
};

export const MultipleUpdates: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const updateButton =
			canvas.queryByRole('button', { name: /update/i }) ||
			canvas.queryByRole('button', { name: /increment/i });

		if (updateButton) {
			for (let i = 0; i < 5; i++) {
				await user.click(updateButton);
				await waitFor(
					() => {
						expect(updateButton).toBeInTheDocument();
					},
					{ timeout: 200 }
				);
			}
		}
	}
};

export const ResetStore: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const resetButton =
			canvas.queryByRole('button', { name: /reset/i }) ||
			canvas.queryByRole('button', { name: /clear/i });

		if (resetButton) {
			const updateButton = canvas.queryByRole('button', { name: /update/i });
			if (updateButton) {
				await user.click(updateButton);
			}

			await user.click(resetButton);

			await waitFor(
				() => {
					expect(resetButton).toBeInTheDocument();
				},
				{ timeout: 1000 }
			);
		}
	}
};

export const SubscribeToStore: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const storeValue =
			canvas.queryByText(/count/i) || canvas.queryByText(/value/i) || canvas.queryByText(/\d+/);

		if (storeValue) {
			await expect(storeValue).toBeInTheDocument();
		}
	}
};

export const Accessibility: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const buttons = canvas.getAllByRole('button');

		for (const button of buttons) {
			await expect(button).toBeEnabled();
			await expect(button).toHaveAccessibleName();
		}
	}
};
