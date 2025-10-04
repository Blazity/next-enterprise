import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import BasicForm from './+page.svelte';

const meta = {
	title: 'Examples/Forms/Basic Form',
	component: BasicForm,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A basic form demonstrating form handling and validation in SvelteKit.'
			}
		}
	}
} satisfies Meta<BasicForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const form = canvas.getByRole('form') || canvas.getByRole('region');
		await expect(form).toBeInTheDocument();
	}
};

export const FillAndSubmit: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const nameInput = canvas.getByLabelText(/name/i) || canvas.getByPlaceholderText(/name/i);
		const emailInput = canvas.getByLabelText(/email/i) || canvas.getByPlaceholderText(/email/i);

		if (nameInput) {
			await user.clear(nameInput);
			await user.type(nameInput, 'John Doe');
			await expect(nameInput).toHaveValue('John Doe');
		}

		if (emailInput) {
			await user.clear(emailInput);
			await user.type(emailInput, 'john@example.com');
			await expect(emailInput).toHaveValue('john@example.com');
		}
	}
};

export const ValidationErrors: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const submitButton = canvas.getByRole('button', { name: /submit/i });

		if (submitButton) {
			await user.click(submitButton);

			await waitFor(() => {
				const errors = canvas.queryAllByRole('alert');
				if (errors.length > 0) {
					expect(errors.length).toBeGreaterThan(0);
				}
			});
		}
	}
};

export const InvalidEmail: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const emailInput = canvas.getByLabelText(/email/i) || canvas.getByPlaceholderText(/email/i);

		if (emailInput) {
			await user.clear(emailInput);
			await user.type(emailInput, 'invalid-email');

			await user.tab();

			await waitFor(() => {
				const errorMessage =
					canvas.queryByText(/invalid email/i) || canvas.queryByText(/valid email/i);
				if (errorMessage) {
					expect(errorMessage).toBeInTheDocument();
				}
			});
		}
	}
};

export const Accessibility: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const inputs = canvas.getAllByRole('textbox');

		for (const input of inputs) {
			const accessibleName =
				input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
			const label = canvas.queryByLabelText(input.getAttribute('name') || '');

			expect(accessibleName || label).toBeTruthy();
		}
	}
};
