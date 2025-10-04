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
};
export default meta;
export const Default = {
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
export const Destructive = {
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
export const Outline = {
    args: {
        variant: 'outline',
        children: 'Outline'
    }
};
export const Secondary = {
    args: {
        variant: 'secondary',
        children: 'Secondary'
    }
};
export const Ghost = {
    args: {
        variant: 'ghost',
        children: 'Ghost'
    }
};
export const Link = {
    args: {
        variant: 'link',
        children: 'Link'
    }
};
export const Small = {
    args: {
        size: 'sm',
        children: 'Small'
    }
};
export const Large = {
    args: {
        size: 'lg',
        children: 'Large'
    }
};
export const Icon = {
    args: {
        size: 'icon',
        children: '🔍'
    }
};
export const Disabled = {
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
export const WithClick = {
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
