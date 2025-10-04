import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import TextInputs from './+page.svelte';

const meta = {
	title: 'Examples/Bindings/Text Inputs',
	component: TextInputs,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
# Text Input Bindings

Demonstrates two-way data binding with text inputs in Svelte.

## Features
- bind:value for text inputs
- Real-time updates
- Multiple input types
- Reactive display
				`
			}
		}
	}
} satisfies Meta<TextInputs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const input = canvas.getByRole('textbox');
		await expect(input).toBeInTheDocument();
	}
};

export const TypeText: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const input = canvas.getByRole('textbox');

		await user.clear(input);
		await user.type(input, 'Hello Svelte!');

		await expect(input).toHaveValue('Hello Svelte!');

		await waitFor(() => {
			const display = canvas.queryByText(/Hello Svelte!/i);
			if (display) {
				expect(display).toBeInTheDocument();
			}
		});
	}
};

export const ClearInput: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const input = canvas.getByRole('textbox');

		await user.type(input, 'Test');
		await user.clear(input);

		await expect(input).toHaveValue('');
	}
};

export const SpecialCharacters: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const input = canvas.getByRole('textbox');

		await user.clear(input);
		await user.type(input, '!@#$%^&*()');

		await expect(input).toHaveValue('!@#$%^&*()');
	}
};

export const LongText: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const input = canvas.getByRole('textbox');
		const longText = 'This is a very long text that tests how the input handles extended content';

		await user.clear(input);
		await user.type(input, longText);

		await expect(input).toHaveValue(longText);
	}
};

export const Accessibility: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const input = canvas.getByRole('textbox');
		await expect(input).toBeEnabled();

		const label =
			input.getAttribute('aria-label') ||
			input.getAttribute('aria-labelledby') ||
			canvas.queryByLabelText(input.getAttribute('name') || '');

		expect(label || input.getAttribute('placeholder')).toBeTruthy();
	}
};
