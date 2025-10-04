import type { Meta, StoryObj } from '@storybook/sveltekitkit';
import { expect, within } from '@storybook/test';
import Page from './+page.svelte';

const meta = {
	title: 'Examples/00-Introduction/04-HTML-Tags',
	component: Page,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Demonstrates the {@html ...} syntax for rendering HTML strings in Svelte components.'
			}
		}
	}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HTMLRendering: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify HTML is rendered correctly', async () => {
			const htmlContent = canvas.getByTestId('html-content');

			const strongElement = htmlContent.querySelector('strong');
			await expect(strongElement).toBeVisible();
			await expect(strongElement).toHaveText('HTML!!!');
		});

		await step('Verify safe HTML rendering', async () => {
			const safeContent = canvas.getByTestId('safe-content');

			const emElement = safeContent.querySelector('em');
			await expect(emElement).toBeVisible();
			await expect(emElement).toHaveText('safe');
		});

		await step('Change HTML content dynamically', async () => {
			const htmlInput = canvas.getByTestId('html-input');
			await userEvent.clear(htmlInput);
			await userEvent.type(htmlInput, 'New <u>underlined</u> text!');

			const htmlContent = canvas.getByTestId('html-content');
			const uElement = htmlContent.querySelector('u');
			await expect(uElement).toBeVisible();
			await expect(uElement).toHaveText('underlined');
		});

		await step('Change safe content', async () => {
			const safeInput = canvas.getByTestId('safe-input');
			await userEvent.clear(safeInput);
			await userEvent.type(safeInput, 'Updated <mark>marked</mark> content');

			const safeContent = canvas.getByTestId('safe-content');
			const markElement = safeContent.querySelector('mark');
			await expect(markElement).toBeVisible();
			await expect(markElement).toHaveText('marked');
		});
	}
};

export const XSSPrevention: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify script tags are not executed', async () => {
			const warning = canvas.getByTestId('warning');

			await expect(warning).toContainText('<script>dangerous</script>');
			await expect(warning).not.toContainText('dangerous');
		});

		await step('Verify warning styling is applied', async () => {
			const warning = canvas.getByTestId('warning');

			const styles = window.getComputedStyle(warning);
			expect(styles.backgroundColor).toBe('rgb(255, 243, 205)');
		});
	}
};

export const ComplexHTML: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Test complex HTML structure', async () => {
			const htmlInput = canvas.getByTestId('html-input');
			await userEvent.clear(htmlInput);
			await userEvent.type(
				htmlInput,
				'Complex <div><p>Nested <span style="color: red;">styled</span></p></div> HTML'
			);

			const htmlContent = canvas.getByTestId('html-content');

			const div = htmlContent.querySelector('div');
			await expect(div).toBeVisible();

			const p = div?.querySelector('p');
			await expect(p).toBeVisible();

			const span = p?.querySelector('span');
			await expect(span).toBeVisible();
			await expect(span).toHaveText('styled');

			const spanStyles = window.getComputedStyle(span);
			expect(spanStyles.color).toBe('rgb(255, 0, 0)');
		});
	}
};

export const EmptyHTML: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Clear HTML input', async () => {
			const htmlInput = canvas.getByTestId('html-input');
			await userEvent.clear(htmlInput);

			const htmlContent = canvas.getByTestId('html-content');
			await expect(htmlContent).toHaveText('');
		});

		await step('Verify empty state is handled', async () => {
			const htmlContent = canvas.getByTestId('html-content');
			const p = htmlContent.querySelector('p');

			await expect(p).toBeVisible();
			await expect(p).toHaveText('');
		});
	}
};
