import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, fn, waitFor, within, userEvent } from '@storybook/test';
import ModelSelector from './model-selector.svelte';

const meta = {
	title: 'Components/ModelSelector',
	component: ModelSelector,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'AI model selection component allowing users to choose different language models for chat.'
			}
		}
	},
	argTypes: {
		selectedModel: {
			control: 'select',
			options: ['gpt-4', 'claude-3-sonnet', 'claude-3-haiku', 'gpt-3.5-turbo'],
			description: 'Currently selected AI model'
		},
		onModelChange: {
			action: 'modelChange',
			description: 'Callback when user selects a different model'
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the selector is disabled during API calls'
		}
	}
} satisfies Meta<ModelSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		selectedModel: 'gpt-4',
		onModelChange: fn(),
		disabled: false
	}
};

export const SwitchModel: Story = {
	args: {
		selectedModel: 'gpt-4',
		onModelChange: fn(),
		disabled: false
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open model selector dropdown', async () => {
			const selectButton =
				canvas.getByTestId('model-selector') ||
				canvas.getByRole('combobox', { name: /model/i }) ||
				canvas.getByRole('button', { name: /gpt-4/i });

			await userEvent.click(selectButton);
		});

		await step('Select Claude model', async () => {
			const claudeOption =
				canvas.getByRole('option', { name: /claude/i }) || canvas.getByText(/claude-3-sonnet/i);

			await userEvent.click(claudeOption);
		});

		await step('Verify model change callback was called', async () => {
			await waitFor(() => {
				expect(args.onModelChange).toHaveBeenCalledWith('claude-3-sonnet');
			});
		});

		await step('Verify selected model display updates', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/claude/i)).toBeVisible();
			});
		});
	}
};

export const SwitchToHaikuModel: Story = {
	args: {
		selectedModel: 'gpt-4',
		onModelChange: fn(),
		disabled: false
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open model selector', async () => {
			const selectButton = canvas.getByTestId('model-selector') || canvas.getByRole('combobox');

			await userEvent.click(selectButton);
		});

		await step('Select faster Haiku model', async () => {
			const haikuOption =
				canvas.getByRole('option', { name: /haiku/i }) || canvas.getByText(/claude-3-haiku/i);

			await userEvent.click(haikuOption);
		});

		await step('Verify Haiku model selection', async () => {
			await waitFor(() => {
				expect(args.onModelChange).toHaveBeenCalledWith('claude-3-haiku');
				expect(canvas.getByText(/haiku/i)).toBeVisible();
			});
		});
	}
};

export const SwitchToGPT35: Story = {
	args: {
		selectedModel: 'gpt-4',
		onModelChange: fn(),
		disabled: false
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open model selector', async () => {
			const selectButton = canvas.getByTestId('model-selector') || canvas.getByRole('combobox');

			await userEvent.click(selectButton);
		});

		await step('Select GPT-3.5 Turbo for faster responses', async () => {
			const gpt35Option =
				canvas.getByRole('option', { name: /gpt-3\.5/i }) || canvas.getByText(/gpt-3\.5-turbo/i);

			await userEvent.click(gpt35Option);
		});

		await step('Verify GPT-3.5 selection', async () => {
			await waitFor(() => {
				expect(args.onModelChange).toHaveBeenCalledWith('gpt-3.5-turbo');
				expect(canvas.getByText(/3\.5/i)).toBeVisible();
			});
		});
	}
};

export const ModelSelectorDisabled: Story = {
	args: {
		selectedModel: 'gpt-4',
		onModelChange: fn(),
		disabled: true
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Verify selector is disabled', async () => {
			const selectButton = canvas.getByTestId('model-selector') || canvas.getByRole('combobox');

			expect(selectButton).toBeDisabled();
		});

		await step('Try to open disabled selector', async () => {
			const selectButton = canvas.getByTestId('model-selector') || canvas.getByRole('combobox');

			await userEvent.click(selectButton);
		});

		await step('Verify dropdown does not open', async () => {
			expect(canvas.queryByRole('option')).not.toBeVisible();
			expect(args.onModelChange).not.toHaveBeenCalled();
		});
	}
};

export const ModelSelectorDuringAPI: Story = {
	args: {
		selectedModel: 'claude-3-sonnet',
		onModelChange: fn(),
		disabled: false
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open model selector', async () => {
			const selectButton = canvas.getByTestId('model-selector') || canvas.getByRole('combobox');

			await userEvent.click(selectButton);
		});

		await step('Select GPT-4 while conversation is active', async () => {
			const gpt4Option =
				canvas.getByRole('option', { name: /gpt-4/i }) || canvas.getByText(/gpt-4/i);

			await userEvent.click(gpt4Option);
		});

		await step('Verify model switch during conversation', async () => {
			await waitFor(() => {
				expect(args.onModelChange).toHaveBeenCalledWith('gpt-4');
				expect(canvas.getByText(/gpt-4/i)).toBeVisible();
			});
		});
	}
};

export const KeyboardNavigation: Story = {
	args: {
		selectedModel: 'gpt-4',
		onModelChange: fn(),
		disabled: false
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Focus model selector with Tab', async () => {
			await userEvent.tab();
			await userEvent.tab();

			const selectButton = canvas.getByTestId('model-selector') || canvas.getByRole('combobox');

			expect(selectButton).toHaveFocus();
		});

		await step('Open dropdown with Enter', async () => {
			await userEvent.keyboard('{Enter}');
		});

		await step('Navigate options with arrow keys', async () => {
			await userEvent.keyboard('{ArrowDown}');
			await userEvent.keyboard('{ArrowDown}');
		});

		await step('Select option with Enter', async () => {
			await userEvent.keyboard('{Enter}');
		});

		await step('Verify model was changed via keyboard', async () => {
			await waitFor(() => {
				expect(args.onModelChange).toHaveBeenCalled();
			});
		});
	}
};

export const AllModelsAvailable: Story = {
	args: {
		selectedModel: 'gpt-4',
		onModelChange: fn(),
		disabled: false
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('Open model selector to see all options', async () => {
			const selectButton = canvas.getByTestId('model-selector') || canvas.getByRole('combobox');

			await userEvent.click(selectButton);
		});

		await step('Verify all major models are available', async () => {
			await waitFor(() => {
				expect(canvas.getByText(/gpt-4/i)).toBeVisible();
				expect(canvas.getByText(/claude/i)).toBeVisible();
				expect(canvas.getByText(/gpt-3\.5/i)).toBeVisible();
			});
		});
	}
};
