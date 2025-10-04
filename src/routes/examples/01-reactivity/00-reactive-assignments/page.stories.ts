import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Examples/01-Reactivity/00-Reactive-Assignments',
	component: Page,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Demonstrates reactive assignments with $state() rune - changes to state variables automatically update the UI.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReactiveAssignments: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify initial state', async () => {
			const clickButton = canvas.getByTestId('click-button');
			const countDisplay = canvas.getByTestId('count-display');

			await expect(clickButton).toHaveText('Clicked 0 times');
			await expect(countDisplay).toHaveText('Current count: 0');
		});

		await step('Click button once', async () => {
			const clickButton = canvas.getByTestId('click-button');
			await userEvent.click(clickButton);

			await expect(clickButton).toHaveText('Clicked 1 time');
			const countDisplay = canvas.getByTestId('count-display');
			await expect(countDisplay).toHaveText('Current count: 1');
		});

		await step('Click button multiple times', async () => {
			const clickButton = canvas.getByTestId('click-button');

			await userEvent.click(clickButton);
			await expect(clickButton).toHaveText('Clicked 2 times');

			await userEvent.click(clickButton);
			await expect(clickButton).toHaveText('Clicked 3 times');

			await userEvent.click(clickButton);
			await expect(clickButton).toHaveText('Clicked 4 times');
		});

		await step('Use increment buttons', async () => {
			const increment5Button = canvas.getByTestId('increment-5-button');
			const increment10Button = canvas.getByTestId('increment-10-button');

			await userEvent.click(increment5Button);
			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 9 times');

			await userEvent.click(increment10Button);
			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 19 times');
		});

		await step('Reset counter', async () => {
			const resetButton = canvas.getByTestId('reset-button');
			await userEvent.click(resetButton);

			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 0 times');
			await expect(canvas.getByTestId('count-display')).toHaveText('Current count: 0');
		});
	}
};

export const PluralizationLogic: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Test singular form', async () => {
			const clickButton = canvas.getByTestId('click-button');

			await expect(clickButton).toHaveText('Clicked 0 times');

			await userEvent.click(clickButton);
			await expect(clickButton).toHaveText('Clicked 1 time');
		});

		await step('Test plural form', async () => {
			const clickButton = canvas.getByTestId('click-button');

			await userEvent.click(clickButton);
			await expect(clickButton).toHaveText('Clicked 2 times');

			await userEvent.click(clickButton);
			await expect(clickButton).toHaveText('Clicked 3 times');

			await userEvent.click(clickButton);
			await expect(clickButton).toHaveText('Clicked 4 times');
		});

		await step('Reset and test singular again', async () => {
			const resetButton = canvas.getByTestId('reset-button');
			await userEvent.click(resetButton);

			await expect(canvas.getByTestId('click-button')).toHaveText('Clicked 0 times');
		});
	}
};

export const ReactiveUpdates: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify immediate reactivity', async () => {
			const clickButton = canvas.getByTestId('click-button');
			const countDisplay = canvas.getByTestId('count-display');

			await userEvent.click(clickButton);

			await expect(clickButton).toHaveText('Clicked 1 time');
			await expect(countDisplay).toHaveText('Current count: 1');

			await userEvent.click(clickButton);

			await expect(clickButton).toHaveText('Clicked 2 times');
			await expect(countDisplay).toHaveText('Current count: 2');
		});

		await step('Test large increments', async () => {
			const increment10Button = canvas.getByTestId('increment-10-button');
			const clickButton = canvas.getByTestId('click-button');
			const countDisplay = canvas.getByTestId('count-display');

			await userEvent.click(increment10Button);

			await expect(clickButton).toHaveText('Clicked 12 times');
			await expect(countDisplay).toHaveText('Current count: 12');
		});
	}
};

export const StatePersistence: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Build up state', async () => {
			const clickButton = canvas.getByTestId('click-button');

			for (let i = 0; i < 5; i++) {
				await userEvent.click(clickButton);
			}

			await expect(clickButton).toHaveText('Clicked 5 times');
		});

		await step('Verify state persists across interactions', async () => {
			const increment5Button = canvas.getByTestId('increment-5-button');
			const clickButton = canvas.getByTestId('click-button');

			await userEvent.click(increment5Button);

			await expect(clickButton).toHaveText('Clicked 10 times');
		});
	}
};
