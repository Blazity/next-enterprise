import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Examples/00-Introduction/02-Styling',
	component: Page,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Demonstrates scoped styling in Svelte components with CSS animations and transitions.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StyledComponent: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify initial styling', async () => {
			const text = canvas.getByTestId('styled-text');
			await expect(text).toBeVisible();

			const styles = window.getComputedStyle(text);
			expect(styles.color).toBe('rgb(128, 0, 128)');
			expect(styles.fontSize).toBe('32px');
		});

		await step('Toggle colorful styling', async () => {
			const toggleButton = canvas.getByTestId('toggle-button');
			await expect(toggleButton).toHaveText('Toggle colorful style');

			await userEvent.click(toggleButton);
			await expect(toggleButton).toHaveText('Toggle normal style');
		});

		await step('Toggle back to normal styling', async () => {
			const toggleButton = canvas.getByTestId('toggle-button');
			await userEvent.click(toggleButton);
			await expect(toggleButton).toHaveText('Toggle colorful style');
		});
	}
};

export const ScopedStyling: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step("Verify scoped styles don't affect other elements", async () => {
			const styledText = canvas.getByTestId('styled-text');
			const button = canvas.getByTestId('toggle-button');

			const buttonStyles = window.getComputedStyle(button);
			expect(buttonStyles.color).not.toBe('rgb(128, 0, 128)');

			const textStyles = window.getComputedStyle(styledText);
			expect(textStyles.color).toBe('rgb(128, 0, 128)');
		});
	}
};

export const CSSAnimations: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Enable colorful animation', async () => {
			const toggleButton = canvas.getByTestId('toggle-button');
			await userEvent.click(toggleButton);
		});

		await step('Wait for animation to be applied', async () => {
			const text = canvas.getByTestId('styled-text');

			await new Promise((resolve) => setTimeout(resolve, 500));

			await expect(text).toBeVisible();
		});

		await step('Disable animation', async () => {
			const toggleButton = canvas.getByTestId('toggle-button');
			await userEvent.click(toggleButton);
		});
	}
};
