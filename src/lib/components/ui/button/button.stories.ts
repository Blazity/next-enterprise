import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, userEvent, within } from '@storybook/test';
import Button from './button.svelte';

const meta = {
	title: 'UI/Button',
	component: Button,
	tags: ['test', 'autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'icon']
		}
	}
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Button'
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');

		await expect(button).toBeInTheDocument();
		await expect(button).toHaveTextContent('Button');
	}
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		children: 'Delete'
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');

		await expect(button).toBeInTheDocument();
		await expect(button).toHaveClass('destructive');
	}
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Outline'
	}
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Secondary'
	}
};

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		children: 'Ghost'
	}
};

export const Link: Story = {
	args: {
		variant: 'link',
		children: 'Link'
	}
};

export const Small: Story = {
	args: {
		size: 'sm',
		children: 'Small'
	}
};

export const Large: Story = {
	args: {
		size: 'lg',
		children: 'Large'
	}
};

export const Icon: Story = {
	args: {
		size: 'icon',
		children: '🔍'
	}
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: 'Disabled'
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');

		await expect(button).toBeDisabled();
	}
};

export const WithClick: Story = {
	args: {
		children: 'Click Me'
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');

		await userEvent.click(button);

		await expect(button).toBeInTheDocument();
	}
};
