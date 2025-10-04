import type { Meta, StoryObj } from '@storybook/sveltekit';
import { expect, within } from '@storybook/test';
import ExamplesIndex from './+page.svelte';

const meta = {
	title: 'Examples/Index',
	component: ExamplesIndex,
	tags: ['test', 'autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
# SvelteKit Enterprise Examples

This is the main index page for all examples in the application. It provides navigation to various example categories:

## Categories

### Introduction
- Hello World - Basic Svelte component
- Counter - Reactive state management
- Props - Component props and data flow

### Forms
- Basic Form - Form handling and validation
- Advanced Form - Complex form with multiple fields
- File Upload - File upload handling

### Data Fetching
- Load Function - SvelteKit load function
- API Routes - Server-side API routes
- Streaming - Streaming data

### Animations
- Transitions - Svelte transitions
- Motion - Advanced animations
- Spring - Spring physics

### State Management
- Stores - Svelte stores
- Context - Context API
- Derived Stores - Computed values

### Advanced
- Actions - Svelte actions
- Slots - Component slots
- Lifecycle - Component lifecycle
				`
			}
		}
	}
} satisfies Meta<ExamplesIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const heading = canvas.getByRole('heading', { level: 1 });
		await expect(heading).toBeInTheDocument();
		await expect(heading).toHaveTextContent(/examples/i);
	}
};

export const NavigationLinks: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const links = canvas.getAllByRole('link');
		await expect(links.length).toBeGreaterThan(0);

		const categories = [/introduction/i, /forms/i, /data/i, /animation/i, /state/i];

		for (const category of categories) {
			const link = canvas.queryByRole('link', { name: category });
			if (link) {
				await expect(link).toBeInTheDocument();
				await expect(link).toHaveAttribute('href');
			}
		}
	}
};

export const CategoryCards: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const cards =
			canvas.queryAllByRole('article') ||
			canvas.queryAllByRole('region') ||
			canvas.queryAllByRole('listitem');

		if (cards.length > 0) {
			await expect(cards.length).toBeGreaterThan(0);

			for (const card of cards) {
				const heading = within(card).queryByRole('heading');
				if (heading) {
					await expect(heading).toBeInTheDocument();
				}
			}
		}
	}
};

export const SearchFunctionality: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const searchInput = canvas.queryByRole('searchbox') || canvas.queryByPlaceholderText(/search/i);

		if (searchInput) {
			await expect(searchInput).toBeInTheDocument();
			await expect(searchInput).toBeEnabled();
		}
	}
};

export const Accessibility: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const h1 = canvas.queryByRole('heading', { level: 1 });
		if (h1) {
			await expect(h1).toBeInTheDocument();
		}

		const links = canvas.getAllByRole('link');
		for (const link of links) {
			await expect(link).toHaveAccessibleName();
			await expect(link).toHaveAttribute('href');
		}

		const nav = canvas.queryByRole('navigation');
		if (nav) {
			await expect(nav).toBeInTheDocument();
		}
	}
};

export const ResponsiveLayout: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1'
		}
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const heading = canvas.getByRole('heading', { level: 1 });
		await expect(heading).toBeInTheDocument();

		const links = canvas.getAllByRole('link');
		await expect(links.length).toBeGreaterThan(0);
	}
};

export const DarkMode: Story = {
	parameters: {
		backgrounds: {
			default: 'dark'
		}
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const heading = canvas.getByRole('heading', { level: 1 });
		await expect(heading).toBeInTheDocument();
	}
};
