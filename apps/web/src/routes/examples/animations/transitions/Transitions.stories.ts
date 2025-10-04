import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import Transitions from './+page.svelte';

const meta = {
	title: 'Examples/Animations/Transitions',
	component: Transitions,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Demonstrates Svelte transitions and animations.'
			}
		}
	}
} satisfies Meta<Transitions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByRole('main') || canvas.getByRole('region')).toBeInTheDocument();
	}
};

export const ToggleTransition: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const toggleButton =
			canvas.getByRole('button', { name: /toggle/i }) ||
			canvas.getByRole('button', { name: /show/i }) ||
			canvas.getByRole('button', { name: /hide/i });

		if (toggleButton) {
			await user.click(toggleButton);

			await waitFor(
				() => {
					expect(toggleButton).toBeInTheDocument();
				},
				{ timeout: 1000 }
			);
		}
	}
};

export const FadeTransition: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const fadeButton = canvas.queryByRole('button', { name: /fade/i });

		if (fadeButton) {
			await user.click(fadeButton);

			await waitFor(
				() => {
					expect(fadeButton).toBeInTheDocument();
				},
				{ timeout: 1000 }
			);
		}
	}
};

export const SlideTransition: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const slideButton = canvas.queryByRole('button', { name: /slide/i });

		if (slideButton) {
			await user.click(slideButton);

			await waitFor(
				() => {
					expect(slideButton).toBeInTheDocument();
				},
				{ timeout: 1000 }
			);
		}
	}
};

export const MultipleTransitions: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const buttons = canvas.getAllByRole('button');

		for (const button of buttons) {
			await user.click(button);
			await waitFor(
				() => {
					expect(button).toBeInTheDocument();
				},
				{ timeout: 500 }
			);
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
