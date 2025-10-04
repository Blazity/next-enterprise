import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import Counter from './+page.svelte';

const meta = {
	title: 'Examples/7GUIs/Counter',
	component: Counter,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
# 7GUIs Counter

The first of the 7GUIs challenges - a simple counter that demonstrates basic state management.

## Challenge
Build a frame containing a label or read-only textfield T and a button B. 
Initially, the value in T is "0" and each click of B increases the value in T by one.

## Learning Objectives
- Basic state management
- Event handling
- UI updates
				`
			}
		}
	}
} satisfies Meta<Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const display = canvas.getByText(/0/) || canvas.getByDisplayValue('0');
		await expect(display).toBeInTheDocument();
	}
};

export const SingleIncrement: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const button = canvas.getByRole('button', { name: /count/i });
		await user.click(button);

		await waitFor(() => {
			const display = canvas.getByText(/1/) || canvas.getByDisplayValue('1');
			expect(display).toBeInTheDocument();
		});
	}
};

export const MultipleIncrements: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const button = canvas.getByRole('button');

		for (let i = 0; i < 10; i++) {
			await user.click(button);
		}

		await waitFor(() => {
			const display = canvas.getByText(/10/) || canvas.getByDisplayValue('10');
			expect(display).toBeInTheDocument();
		});
	}
};

export const StressTest: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const button = canvas.getByRole('button');

		for (let i = 0; i < 100; i++) {
			await user.click(button);
		}

		await waitFor(
			() => {
				const display = canvas.getByText(/100/) || canvas.getByDisplayValue('100');
				expect(display).toBeInTheDocument();
			},
			{ timeout: 5000 }
		);
	}
};

export const Accessibility: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const button = canvas.getByRole('button');
		await expect(button).toBeEnabled();
		await expect(button).toHaveAccessibleName();

		const display = canvas.getByText(/\d+/) || canvas.getByDisplayValue(/\d+/);
		await expect(display).toBeInTheDocument();
	}
};
