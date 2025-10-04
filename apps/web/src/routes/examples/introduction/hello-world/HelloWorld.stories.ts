import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within } from '@storybook/test';
import HelloWorld from './HelloWorld.svelte';

const meta = {
	title: 'Examples/Introduction/Hello World',
	component: HelloWorld,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A simple hello world component demonstrating basic Svelte syntax.'
			}
		}
	}
} satisfies Meta<HelloWorld>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const heading = canvas.getByRole('heading', { level: 1 });
		await expect(heading).toBeInTheDocument();
		await expect(heading).toHaveTextContent(/hello world/i);
	}
};

export const Accessibility: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const heading = canvas.getByRole('heading', { level: 1 });
		await expect(heading).toBeInTheDocument();

		await expect(heading.tagName).toBe('H1');
	}
};
