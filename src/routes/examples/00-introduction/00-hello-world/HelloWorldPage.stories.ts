import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Examples/00-Introduction/00-Hello-World',
	component: Page,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Basic Svelte 5 example showing reactive state with $state() rune and data binding.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InteractiveHelloWorld: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify initial state', async () => {
			await expect(canvas.getByText('Hello world!')).toBeVisible();
			await expect(canvas.getByTestId('name-input')).toHaveValue('world');
			await expect(canvas.getByTestId('count-button')).toHaveText('clicks: 0');
		});

		await step('Change name input', async () => {
			const nameInput = canvas.getByTestId('name-input');
			await userEvent.clear(nameInput);
			await userEvent.type(nameInput, 'Svelte');

			await expect(canvas.getByText('Hello Svelte!')).toBeVisible();
			await expect(nameInput).toHaveValue('Svelte');
		});

		await step('Click button multiple times', async () => {
			const countButton = canvas.getByTestId('count-button');

			await userEvent.click(countButton);
			await expect(countButton).toHaveText('clicks: 1');

			await userEvent.click(countButton);
			await expect(countButton).toHaveText('clicks: 2');

			await userEvent.click(countButton);
			await expect(countButton).toHaveText('clicks: 3');
		});

		await step('Verify reactive updates work together', async () => {
			await expect(canvas.getByText('Hello Svelte!')).toBeVisible();
			await expect(canvas.getByTestId('count-button')).toHaveText('clicks: 3');
		});
	}
};

export const EmptyName: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Clear name input', async () => {
			const nameInput = canvas.getByTestId('name-input');
			await userEvent.clear(nameInput);

			await expect(canvas.getByText('Hello !')).toBeVisible();
			await expect(nameInput).toHaveValue('');
		});

		await step('Verify count still works with empty name', async () => {
			const countButton = canvas.getByTestId('count-button');
			await userEvent.click(countButton);

			await expect(countButton).toHaveText('clicks: 1');
		});
	}
};

export const SpecialCharacters: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Type special characters', async () => {
			const nameInput = canvas.getByTestId('name-input');
			await userEvent.clear(nameInput);
			await userEvent.type(nameInput, 'Svelte 5 🚀');

			await expect(canvas.getByText('Hello Svelte 5 🚀!')).toBeVisible();
			await expect(nameInput).toHaveValue('Svelte 5 🚀');
		});
	}
};

export const RapidClicks: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Click button rapidly', async () => {
			const countButton = canvas.getByTestId('count-button');

			for (let i = 1; i <= 10; i++) {
				await userEvent.click(countButton);
				await expect(countButton).toHaveText(`clicks: ${i}`);
			}
		});
	}
};
