# Storybook Basics for SvelteKit

## Overview

Storybook is a frontend workshop for building UI components and pages in isolation. It provides a sandbox environment where developers can develop, test, and document components independently from the main application. This guide focuses on integrating Storybook with SvelteKit for comprehensive testing workflows.

## Why Storybook for SvelteKit?

Storybook provides several key benefits for SvelteKit applications:

- **Component Isolation**: Develop and test components outside of application context
- **Visual Testing**: Interactive component playground for design systems
- **Documentation**: Auto-generate component documentation from stories
- **Testing Integration**: Seamless integration with Playwright for E2E testing
- **Design System Development**: Build consistent component libraries

## Installation and Setup

### 1. Install Storybook

```bash
# For SvelteKit projects
npx storybook@latest init --skip-install

# Or manually install dependencies
npm install --save-dev storybook @storybook/svelte-vite @storybook/addon-essentials @storybook/addon-interactions @storybook/test-runner
```

### 2. Configure Storybook for SvelteKit

Create or update `.storybook/main.js`:

```javascript
// .storybook/main.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	stories: [
		'../src/**/*.stories.@(js|jsx|ts|tsx|svelte)',
		'../src/**/*.story.@(js|jsx|ts|tsx|svelte)'
	],
	addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
	framework: {
		name: '@storybook/svelte-vite',
		options: {}
	},
	docs: {
		autodocs: true
	},
	viteFinal: async (config) => {
		// Merge custom configuration into the default config
		const { mergeConfig } = await import('vite');

		return mergeConfig(config, {
			// your custom config
			resolve: {
				alias: {
					$lib: '/src/lib',
					$components: '/src/lib/components'
				}
			}
		});
	}
});
```

### 3. Configure Storybook Preview

Create `.storybook/preview.js`:

```javascript
// .storybook/preview.js
import { setup } from '@storybook/addon-interactions';

// Global setup for stories
setup();

// Global CSS
import '../src/app.css';

// Global decorators
export const decorators = [
	(Story) => {
		// Wrap stories with providers if needed
		return {
			components: { Story },
			template: `
        <div class="storybook-wrapper">
          <Story />
        </div>
      `
		};
	}
];

// Global parameters
export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/
		}
	},
	docs: {
		theme: {
			base: 'light',
			brandTitle: 'My SvelteKit App',
			brandUrl: 'https://example.com'
		}
	}
};
```

## Creating Stories

### Basic Component Story

```javascript
// src/lib/components/Button/Button.stories.js
import Button from './Button.svelte';

export default {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['primary', 'secondary', 'danger']
		},
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		},
		disabled: {
			control: 'boolean'
		}
	}
};

const Template = (args) => ({
	Component: Button,
	props: args
});

export const Primary = Template.bind({});
Primary.args = {
	label: 'Primary Button',
	variant: 'primary',
	size: 'medium'
};

export const Secondary = Template.bind({});
Secondary.args = {
	label: 'Secondary Button',
	variant: 'secondary',
	size: 'medium'
};

export const Disabled = Template.bind({});
Disabled.args = {
	label: 'Disabled Button',
	variant: 'primary',
	disabled: true
};
```

### Story with Slots (SvelteKit specific)

```javascript
// src/lib/components/Card/Card.stories.js
import Card from './Card.svelte';

export default {
	title: 'Components/Card',
	component: Card,
	argTypes: {
		title: { control: 'text' }
	}
};

const Template = (args) => ({
	Component: Card,
	props: args,
	slots: {
		default: 'Card content goes here'
	}
});

export const Default = Template.bind({});
Default.args = {
	title: 'Card Title'
};

export const WithActions = Template.bind({});
WithActions.args = {
	title: 'Card with Actions'
};
WithActions.slots = {
	default: 'Card content',
	actions: '<button>Action 1</button><button>Action 2</button>'
};
```

## Storybook Addons for Testing

### Essential Addons for Testing

```javascript
// .storybook/main.js addons
adders: [
	'@storybook/addon-essentials', // Actions, Controls, Docs, Viewport
	'@storybook/addon-interactions', // Play functions
	'@storybook/addon-a11y', // Accessibility testing
	'@storybook/test-runner', // Test runner for Playwright
	'@storybook/addon-storyshots' // Snapshot testing
];
```

### Viewport Addon for Responsive Testing

```javascript
// .storybook/preview.js
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

export const parameters = {
	viewport: {
		viewports: MINIMAL_VIEWPORTS
	}
};
```

## Integration with SvelteKit Path Aliases

Ensure your Storybook configuration respects SvelteKit's path aliases:

```javascript
// .storybook/main.js viteFinal
viteFinal: async (config) => {
	const { mergeConfig } = await import('vite');

	return mergeConfig(config, {
		resolve: {
			alias: {
				$lib: '/src/lib',
				$components: '/src/lib/components',
				$utils: '/src/lib/utils',
				$stores: '/src/lib/stores',
				$types: '/src/lib/types'
			}
		}
	});
};
```

## Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for static deployment
npm run build-storybook

# Serve built Storybook
npx serve storybook-static
```

## Storybook Scripts in package.json

```json
{
	"scripts": {
		"storybook": "storybook dev -p 6006",
		"build-storybook": "storybook build",
		"test-storybook": "test-storybook"
	}
}
```

## Best Practices

### Story Organization

```
src/
  lib/
    components/
      Button/
        Button.svelte
        Button.stories.js
        Button.test.js
      Card/
        Card.svelte
        Card.stories.js
        Card.test.js
```

### Story Naming Conventions

- Use descriptive story names: `Primary`, `Secondary`, `Loading`, `Error`
- Group related stories with `|` separator: `Button|Primary`, `Button|Secondary`
- Use consistent naming across components

### Component Testing Setup

```javascript
// Button.test.js
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Button from './Button.svelte';

describe('Button', () => {
	it('renders with label', () => {
		const { getByText } = render(Button, { props: { label: 'Click me' } });
		expect(getByText('Click me')).toBeInTheDocument();
	});

	it('calls onClick when clicked', async () => {
		const mockFn = vi.fn();
		const { getByText } = render(Button, {
			props: { label: 'Click me', onClick: mockFn }
		});

		await fireEvent.click(getByText('Click me'));
		expect(mockFn).toHaveBeenCalled();
	});
});
```

## Next Steps

With Storybook set up, you can now:

1. Create stories for all your SvelteKit components
2. Set up Playwright for E2E testing of stories
3. Configure interaction testing with play functions
4. Implement visual and accessibility testing
5. Set up CI/CD pipelines for automated testing

Continue to the next section: [Playwright Setup](./02-playwright-setup.md)
