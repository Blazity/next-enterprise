import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import TemperatureConverter from './+page.svelte';

const meta = {
	title: 'Examples/7GUIs/Temperature Converter',
	component: TemperatureConverter,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
# 7GUIs Temperature Converter

The second of the 7GUIs challenges - bidirectional data flow.

## Challenge
Build a frame containing two textfields TC and TF representing the temperature in Celsius and Fahrenheit, respectively. 
Initially, both TC and TF are empty. When the user enters a numerical value into TC the corresponding value in TF is automatically updated and vice versa.

## Learning Objectives
- Bidirectional data binding
- Input validation
- Computed values
- Real-time updates
				`
			}
		}
	}
} satisfies Meta<TemperatureConverter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const inputs = canvas.getAllByRole('textbox') || canvas.getAllByRole('spinbutton');
		await expect(inputs.length).toBeGreaterThanOrEqual(2);
	}
};

export const CelsiusToFahrenheit: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const celsiusInput = canvas.getByLabelText(/celsius/i) || canvas.getAllByRole('textbox')[0];

		await user.clear(celsiusInput);
		await user.type(celsiusInput, '0');

		await waitFor(() => {
			const fahrenheitInput =
				canvas.getByLabelText(/fahrenheit/i) || canvas.getAllByRole('textbox')[1];
			expect(fahrenheitInput).toHaveValue('32');
		});
	}
};

export const FahrenheitToCelsius: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const fahrenheitInput =
			canvas.getByLabelText(/fahrenheit/i) || canvas.getAllByRole('textbox')[1];

		await user.clear(fahrenheitInput);
		await user.type(fahrenheitInput, '32');

		await waitFor(() => {
			const celsiusInput = canvas.getByLabelText(/celsius/i) || canvas.getAllByRole('textbox')[0];
			expect(celsiusInput).toHaveValue('0');
		});
	}
};

export const BoilingPoint: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const celsiusInput = canvas.getByLabelText(/celsius/i) || canvas.getAllByRole('textbox')[0];

		await user.clear(celsiusInput);
		await user.type(celsiusInput, '100');

		await waitFor(() => {
			const fahrenheitInput =
				canvas.getByLabelText(/fahrenheit/i) || canvas.getAllByRole('textbox')[1];
			expect(fahrenheitInput).toHaveValue('212');
		});
	}
};

export const FreezingPoint: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const fahrenheitInput =
			canvas.getByLabelText(/fahrenheit/i) || canvas.getAllByRole('textbox')[1];

		await user.clear(fahrenheitInput);
		await user.type(fahrenheitInput, '32');

		await waitFor(() => {
			const celsiusInput = canvas.getByLabelText(/celsius/i) || canvas.getAllByRole('textbox')[0];
			expect(celsiusInput).toHaveValue('0');
		});
	}
};

export const NegativeTemperature: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const celsiusInput = canvas.getByLabelText(/celsius/i) || canvas.getAllByRole('textbox')[0];

		await user.clear(celsiusInput);
		await user.type(celsiusInput, '-40');

		await waitFor(() => {
			const fahrenheitInput =
				canvas.getByLabelText(/fahrenheit/i) || canvas.getAllByRole('textbox')[1];
			expect(fahrenheitInput).toHaveValue('-40');
		});
	}
};

export const DecimalValues: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const celsiusInput = canvas.getByLabelText(/celsius/i) || canvas.getAllByRole('textbox')[0];

		await user.clear(celsiusInput);
		await user.type(celsiusInput, '37.5');

		await waitFor(() => {
			const fahrenheitInput =
				canvas.getByLabelText(/fahrenheit/i) || canvas.getAllByRole('textbox')[1];
			expect(fahrenheitInput.value).toBeTruthy();
		});
	}
};

export const InvalidInput: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		const celsiusInput = canvas.getByLabelText(/celsius/i) || canvas.getAllByRole('textbox')[0];

		await user.clear(celsiusInput);
		await user.type(celsiusInput, 'abc');

		await waitFor(() => {
			expect(celsiusInput).toBeInTheDocument();
		});
	}
};

export const Accessibility: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const inputs = canvas.getAllByRole('textbox') || canvas.getAllByRole('spinbutton');

		for (const input of inputs) {
			await expect(input).toBeEnabled();

			const label = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
			expect(label || canvas.queryByLabelText(input.getAttribute('name') || '')).toBeTruthy();
		}
	}
};
