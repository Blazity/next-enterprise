import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Examples/00-Introduction/03-Nested-Components',
	component: Page,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Demonstrates component composition and scoped styling isolation in Svelte.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ScopedStyling: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify parent component styling', async () => {
			const parentText = canvas.getByTestId('parent-text');
			await expect(parentText).toBeVisible();

			const parentStyles = window.getComputedStyle(parentText);
			expect(parentStyles.color).toBe('rgb(128, 0, 128)');
			expect(parentStyles.fontSize).toBe('32px');
		});

		await step('Verify nested component styling isolation', async () => {
			const nestedText = canvas.getByTestId('nested-text');
			await expect(nestedText).toBeVisible();

			const nestedStyles = window.getComputedStyle(nestedText);
			expect(nestedStyles.color).not.toBe('rgb(128, 0, 128)');
			expect(nestedStyles.fontSize).not.toBe('32px');
		});

		await step('Verify both elements are visible with different styles', async () => {
			const parentText = canvas.getByTestId('parent-text');
			const nestedText = canvas.getByTestId('nested-text');

			await expect(parentText).toHaveText('These styles...');
			await expect(nestedText).toHaveText("...don't affect this element");

			const parentStyles = window.getComputedStyle(parentText);
			const nestedStyles = window.getComputedStyle(nestedText);

			expect(parentStyles.color).not.toBe(nestedStyles.color);
			expect(parentStyles.fontSize).not.toBe(nestedStyles.fontSize);
		});
	}
};

export const ComponentComposition: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify component nesting works', async () => {
			const parentText = canvas.getByTestId('parent-text');
			const nestedText = canvas.getByTestId('nested-text');

			await expect(parentText).toBeVisible();
			await expect(nestedText).toBeVisible();

			const parent = parentText.parentElement;
			const nested = nestedText.parentElement;

			expect(parent).toBe(nested);
		});

		await step('Verify component import works', async () => {
			const nestedText = canvas.getByTestId('nested-text');
			await expect(nestedText).toHaveText("...don't affect this element");
		});
	}
};
