import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Examples/01-Reactivity/02-Reactive-Statements',
	component: Page,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Demonstrates reactive statements with $effect() rune - side effects that run when reactive dependencies change.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReactiveEffects: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify initial state and effect', async () => {
			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 0 times');
			await expect(canvas.getByTestId('message-display')).toHaveText('Click to start counting');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'normal');
		});

		await step('Click once - should trigger low count effect', async () => {
			await userEvent.click(canvas.getByTestId('click-button'));

			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 1 time');
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is low');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'normal');
		});

		await step('Click to reach moderate count (4)', async () => {
			await userEvent.click(canvas.getByTestId('click-button'));
			await userEvent.click(canvas.getByTestId('click-button'));
			await userEvent.click(canvas.getByTestId('click-button'));

			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 4 times');
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is moderate');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'caution');
		});

		await step('Click to reach warning count (7)', async () => {
			await userEvent.click(canvas.getByTestId('click-button'));
			await userEvent.click(canvas.getByTestId('click-button'));
			await userEvent.click(canvas.getByTestId('click-button'));

			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 7 times');
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is getting high');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'warning');
		});
	}
};

export const EffectPrevention: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Try to set count to dangerous level (12)', async () => {
			await userEvent.click(canvas.getByTestId('set-12-button'));

			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 9 times');
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is dangerously high!');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'danger');
		});

		await step('Verify count was automatically reduced', async () => {
			await expect(canvas.getByTestId('count-display')).toHaveText('Current count: 9');
		});
	}
};

export const EffectTriggers: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Use preset buttons to trigger different effects', async () => {
			await userEvent.click(canvas.getByTestId('set-3-button'));
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is low');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'normal');

			await userEvent.click(canvas.getByTestId('set-5-button'));
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is moderate');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'caution');

			await userEvent.click(canvas.getByTestId('set-8-button'));
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is getting high');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'warning');
		});

		await step('Test clicking to increment within effects', async () => {
			await userEvent.click(canvas.getByTestId('click-button'));
			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 9 times');
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is getting high');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'warning');
		});
	}
};

export const ResetFunctionality: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Build up count with effects', async () => {
			await userEvent.click(canvas.getByTestId('set-8-button'));
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is getting high');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'warning');
		});

		await step('Reset and verify effects reset', async () => {
			await userEvent.click(canvas.getByTestId('reset-button'));

			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 0 times');
			await expect(canvas.getByTestId('message-display')).toHaveText('Click to start counting');
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'normal');
		});
	}
};

export const VisualFeedback: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Test visual feedback for different states', async () => {
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'normal');

			await userEvent.click(canvas.getByTestId('set-5-button'));
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'caution');

			await userEvent.click(canvas.getByTestId('set-8-button'));
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'warning');

			await userEvent.click(canvas.getByTestId('set-12-button'));
			await expect(canvas.getByTestId('status-section')).toHaveAttribute('data-color', 'danger');
		});
	}
};

export const EffectDependencyTracking: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify effects only run when count changes', async () => {
			await userEvent.click(canvas.getByTestId('reset-button'));
			await expect(canvas.getByTestId('message-display')).toHaveText('Click to start counting');

			await userEvent.click(canvas.getByTestId('click-button'));
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is low');

			await userEvent.click(canvas.getByTestId('click-button'));
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is low');

			await userEvent.click(canvas.getByTestId('click-button'));
			await userEvent.click(canvas.getByTestId('click-button'));
			await expect(canvas.getByTestId('message-display')).toHaveText('Count is moderate');
		});
	}
};
