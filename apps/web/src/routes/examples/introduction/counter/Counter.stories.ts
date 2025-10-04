import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import Counter from './Counter.svelte';

const meta = {
	title: 'Examples/Introduction/Counter',
	component: Counter,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A counter component demonstrating reactive state management in Svelte.'
			}
		}
	}
} satisfies Meta<Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const counter = canvas.getByText(/count is 0/i);
		await expect(counter).toBeInTheDocument();
	}
};

export const IncrementCounter: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const button = canvas.getByRole('button', { name: /count is/i });

		await user.click(button);

		await waitFor(() => {
			expect(button).toHaveTextContent(/count is 1/i);
		});
	}
};

export const MultipleIncrements: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const button = canvas.getByRole('button', { name: /count is/i });

		await user.click(button);
		await user.click(button);
		await user.click(button);

		await waitFor(() => {
			expect(button).toHaveTextContent(/count is 3/i);
		});
	}
};

export const RapidClicks: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const button = canvas.getByRole('button', { name: /count is/i });

		for (let i = 0; i < 10; i++) {
			await user.click(button);
		}

		await waitFor(() => {
			expect(button).toHaveTextContent(/count is 10/i);
		});
	}
};

export const Accessibility: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const button = canvas.getByRole('button');
		await expect(button).toBeInTheDocument();
		await expect(button).toBeEnabled();

		await expect(button).toHaveAccessibleName(/count is/i);
	}
};
