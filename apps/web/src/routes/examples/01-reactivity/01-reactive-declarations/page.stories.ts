import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Examples/01-Reactivity/01-Reactive-Declarations',
	component: Page,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Demonstrates reactive declarations with $derived() rune - computed values that update automatically when dependencies change.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReactiveDeclarations: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify initial reactive values', async () => {
			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 1');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('1 * 2 = 2');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('2 * 2 = 4');
			await expect(canvas.getByTestId('squared-display')).toHaveText('1² = 1');
			await expect(canvas.getByTestId('description-display')).toHaveText(
				'Count is 1, doubled is 2'
			);
		});

		await step('Increment count and verify all derived values update', async () => {
			const incrementButton = canvas.getByTestId('increment-button');
			await userEvent.click(incrementButton);

			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 2');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('2 * 2 = 4');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('4 * 2 = 8');
			await expect(canvas.getByTestId('squared-display')).toHaveText('2² = 4');
			await expect(canvas.getByTestId('description-display')).toHaveText(
				'Count is 2, doubled is 4'
			);
		});

		await step('Increment multiple times', async () => {
			const incrementButton = canvas.getByTestId('increment-button');

			await userEvent.click(incrementButton);
			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 3');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('3 * 2 = 6');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('6 * 2 = 12');
			await expect(canvas.getByTestId('squared-display')).toHaveText('3² = 9');

			await userEvent.click(incrementButton);
			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 4');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('4 * 2 = 8');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('8 * 2 = 16');
			await expect(canvas.getByTestId('squared-display')).toHaveText('4² = 16');
		});

		await step('Test reset functionality', async () => {
			const resetButton = canvas.getByTestId('reset-button');
			await userEvent.click(resetButton);

			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 1');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('1 * 2 = 2');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('2 * 2 = 4');
			await expect(canvas.getByTestId('squared-display')).toHaveText('1² = 1');
		});
	}
};

export const ManualInputChanges: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Change count via input field', async () => {
			const countInput = canvas.getByTestId('count-input');
			await userEvent.clear(countInput);
			await userEvent.type(countInput, '7');

			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 7');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('7 * 2 = 14');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('14 * 2 = 28');
			await expect(canvas.getByTestId('squared-display')).toHaveText('7² = 49');
			await expect(canvas.getByTestId('description-display')).toHaveText(
				'Count is 7, doubled is 14'
			);
		});

		await step('Test preset buttons', async () => {
			const set5Button = canvas.getByTestId('set-5-button');
			await userEvent.click(set5Button);

			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 5');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('5 * 2 = 10');

			const set15Button = canvas.getByTestId('set-15-button');
			await userEvent.click(set15Button);

			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 15');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('15 * 2 = 30');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('30 * 2 = 60');
			await expect(canvas.getByTestId('squared-display')).toHaveText('15² = 225');
		});
	}
};

export const DerivedChainUpdates: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify derived chain: count -> doubled -> quadrupled', async () => {
			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 1');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('1 * 2 = 2');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('2 * 2 = 4');

			const countInput = canvas.getByTestId('count-input');
			await userEvent.clear(countInput);
			await userEvent.type(countInput, '3');

			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 3');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('3 * 2 = 6');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('6 * 2 = 12');
		});

		await step('Test that increment still works with derived values', async () => {
			const incrementButton = canvas.getByTestId('increment-button');
			await userEvent.click(incrementButton);

			await expect(canvas.getByTestId('increment-button')).toHaveText('Count: 4');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('4 * 2 = 8');
			await expect(canvas.getByTestId('quadrupled-display')).toHaveText('8 * 2 = 16');
			await expect(canvas.getByTestId('squared-display')).toHaveText('4² = 16');
		});
	}
};

export const ComplexDerivedExpressions: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Test string interpolation in derived value', async () => {
			const countInput = canvas.getByTestId('count-input');
			await userEvent.clear(countInput);
			await userEvent.type(countInput, '8');

			await expect(canvas.getByTestId('description-display')).toHaveText(
				'Count is 8, doubled is 16'
			);
		});

		await step('Test mathematical operations in derived values', async () => {
			await expect(canvas.getByTestId('squared-display')).toHaveText('8² = 64');

			const countInput = canvas.getByTestId('count-input');
			await userEvent.clear(countInput);
			await userEvent.type(countInput, '12');

			await expect(canvas.getByTestId('squared-display')).toHaveText('12² = 144');
			await expect(canvas.getByTestId('description-display')).toHaveText(
				'Count is 12, doubled is 24'
			);
		});
	}
};

export const InputValidation: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Test input validation (number input)', async () => {
			const countInput = canvas.getByTestId('count-input');

			await userEvent.clear(countInput);
			await userEvent.type(countInput, 'not-a-number');

			const inputValue = await countInput.inputValue();
			expect(inputValue).toBe('');

			await userEvent.type(countInput, '6');
			await expect(countInput).toHaveValue('6');
			await expect(canvas.getByTestId('doubled-display')).toHaveText('6 * 2 = 12');
		});
	}
};
