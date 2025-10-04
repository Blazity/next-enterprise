import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Examples/00-Introduction/01-Dynamic-Attributes',
	component: Page,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Demonstrates dynamic attributes in Svelte using shorthand syntax {attribute}.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DynamicAttributes: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify initial state', async () => {
			const img = canvas.getByTestId('dynamic-image');
			await expect(img).toHaveAttribute('src', '/tutorial/image.gif');
			await expect(img).toHaveAttribute('alt', 'Rick Astley dancing');
		});

		await step('Change image source', async () => {
			const srcInput = canvas.getByTestId('src-input');
			await userEvent.clear(srcInput);
			await userEvent.type(srcInput, '/new-image.jpg');

			const img = canvas.getByTestId('dynamic-image');
			await expect(img).toHaveAttribute('src', '/new-image.jpg');
			await expect(img).toHaveAttribute('alt', 'Rick Astley dancing');
		});

		await step('Change alt text name', async () => {
			const nameInput = canvas.getByTestId('name-input');
			await userEvent.clear(nameInput);
			await userEvent.type(nameInput, 'Dancing Queen');

			const img = canvas.getByTestId('dynamic-image');
			await expect(img).toHaveAttribute('src', '/new-image.jpg');
			await expect(img).toHaveAttribute('alt', 'Dancing Queen dancing');
		});

		await step('Change both attributes simultaneously', async () => {
			const srcInput = canvas.getByTestId('src-input');
			const nameInput = canvas.getByTestId('name-input');

			await userEvent.clear(srcInput);
			await userEvent.type(srcInput, '/final.gif');

			await userEvent.clear(nameInput);
			await userEvent.type(nameInput, 'Final Image');

			const img = canvas.getByTestId('dynamic-image');
			await expect(img).toHaveAttribute('src', '/final.gif');
			await expect(img).toHaveAttribute('alt', 'Final Image dancing');
		});
	}
};

export const EmptyValues: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Clear all inputs', async () => {
			const srcInput = canvas.getByTestId('src-input');
			const nameInput = canvas.getByTestId('name-input');

			await userEvent.clear(srcInput);
			await userEvent.clear(nameInput);
		});

		await step('Verify empty attributes', async () => {
			const img = canvas.getByTestId('dynamic-image');
			await expect(img).toHaveAttribute('src', '');
			await expect(img).toHaveAttribute('alt', ' dancing');
		});
	}
};

export const SpecialCharacters: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Use special characters in attributes', async () => {
			const srcInput = canvas.getByTestId('src-input');
			const nameInput = canvas.getByTestId('name-input');

			await userEvent.clear(srcInput);
			await userEvent.type(srcInput, '/images/test-🚀.png');

			await userEvent.clear(nameInput);
			await userEvent.type(nameInput, 'User & Admin');

			const img = canvas.getByTestId('dynamic-image');
			await expect(img).toHaveAttribute('src', '/images/test-🚀.png');
			await expect(img).toHaveAttribute('alt', 'User & Admin dancing');
		});
	}
};
