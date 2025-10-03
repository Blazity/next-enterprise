# Storybook & Playwright Testing Guide for SvelteKit

<!-- Verified via: mcp_context7_get-library-docs on 2025-10-03 -->

This comprehensive guide provides production-ready examples for testing SvelteKit applications using Storybook and Playwright with full TypeScript integration.

## Documentation Overview

1. **[Storybook Basics](./01-storybook-basics.md)** - Setup and configuration
2. **[Playwright Setup](./02-playwright-setup.md)** - Installation and integration
3. **[Stories in E2E Tests](./03-stories-in-e2e-tests.md)** - Testing stories with Playwright
4. **[Interaction Testing](./04-interaction-testing.md)** - Advanced interaction patterns with play functions

## What's Covered

### Complete Technology Stack

All examples use current versions and verified syntax:

- **Storybook v9** - Latest interaction testing APIs
- **Playwright** - Modern browser automation
- **Drizzle ORM** - Type-safe database queries
- **Drizzle-Valibot** - Schema validation integration
- **Valibot** - Modular validation library
- **SvelteKit Superforms** - Type-safe form management
- **Svelte 5** - Modern runes syntax ($state, $derived, $effect, $props)

### Production-Ready Example

The documentation includes a complete, working example demonstrating:

1. **Database Layer** - Drizzle ORM schema with proper relationships
2. **Validation Layer** - Valibot schemas derived from Drizzle schemas
3. **Type Safety** - Full TypeScript types inferred from schemas
4. **API Integration** - External API calls with validation
5. **Form Management** - Superforms with Valibot adapter
6. **Component Testing** - Storybook stories with interaction tests
7. **E2E Testing** - Playwright tests for complete user flows

### User Flow Demonstrated

```
User Profile Form Complete Journey:
├─ Load user data from Drizzle database
├─ Fetch enrichment data from external API
├─ Populate Superforms with validated data
├─ User fills remaining form fields
├─ Validate all inputs with Valibot schemas
├─ Submit form with proper error handling
└─ Test entire flow with Storybook + Playwright
```

## Key Features

### Type-Safe Architecture

```typescript
// Schema definition in Drizzle
const users = pgTable('users', {...});

// Valibot schema from Drizzle
const selectUserSchema = createSelectSchema(users);

// TypeScript type inference
type User = v.InferOutput<typeof selectUserSchema>;

// Use in Superforms
const { form } = superForm(data, {
  validators: valibot(profileFormSchema)
});
```

### Svelte 5 Runes

```svelte
<script lang="ts">
	// Props with $props()
	let { data, onEnrich, loading = false } = $props();

	// Reactive state with $state()
	let enriching = $state(false);

	// Computed values with $derived()
	const isSubmitDisabled = $derived($submitting || $delayed);

	// Side effects with $effect()
	$effect(() => {
		if (loading) {
			console.log('Loading state changed');
		}
	});
</script>
```

### Storybook Interaction Testing

```typescript
export const CompleteUserFlow: Story = {
  args: {
    data: defaults(valibot(profileFormSchema)),
    onEnrich: fn(async () => {...})
  },
  play: async ({ args, canvas, step }) => {
    await step('Fill form', async () => {
      // Test user interactions
    });

    await step('Validate', async () => {
      // Verify behavior
    });
  }
};
```

### Playwright E2E Tests

```typescript
test('complete user journey', async ({ page }) => {
	const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

	await test.step('Fill information', async () => {
		await storyFrame.getByTestId('firstName').fill('John');
	});

	await test.step('Submit form', async () => {
		await storyFrame.getByTestId('submitButton').click();
	});
});
```

## Tool Verification

All code examples and syntax have been verified using:

- `mcp_context7_get-library-docs` - Current library documentation
- `mcp_mcp-svelte-docs_svelte_definition` - Svelte 5 rune definitions
- Library versions: Storybook v9, Playwright latest, Drizzle ORM latest

## Installation

```bash
npm install --save-dev @storybook/svelte-vite @storybook/addon-essentials @storybook/addon-interactions @storybook/test @playwright/test @playwright/experimental-ct-svelte
```

## Quick Start

### 1. Initialize Storybook

```bash
npx storybook@latest init
```

### 2. Initialize Playwright

```bash
npx playwright install
```

### 3. Create Your First Story

```typescript
// ProfileForm.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import ProfileForm from './ProfileForm.svelte';

const meta = {
	title: 'Forms/ProfileForm',
	component: ProfileForm
} satisfies Meta<ProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		data: defaults(valibot(profileFormSchema))
	}
};
```

### 4. Write E2E Test

```typescript
// profile-form.spec.ts
import { test, expect } from '@playwright/test';

test('story renders correctly', async ({ page }) => {
	await page.goto('http://localhost:6006/?path=/story/forms-profileform--default');

	const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();
	await expect(storyFrame.getByTestId('firstName')).toBeVisible();
});
```

## Testing Commands

```bash
npm run storybook
npm run test-storybook
npx playwright test
npx playwright test --debug
npx playwright test --headed
npx playwright show-report
```

## Best Practices

1. **Always use type-safe schemas** - Derive Valibot from Drizzle
2. **Use path aliases** - Import from $schemas, $types, $components
3. **Test user flows, not implementation** - Focus on behavior
4. **Mock external dependencies** - API calls, database queries
5. **Use data-testid for selectors** - More reliable than CSS classes
6. **Handle async operations properly** - Use waitFor, proper timeouts
7. **Test accessibility** - Include ARIA attributes, keyboard navigation
8. **Organize tests with steps** - Use test.step() for clarity

## Performance Considerations

- **Lazy load Storybook addons** - Only load what you need
- **Use `$state.raw` for large datasets** - Avoid deep reactivity overhead
- **Mock heavy computations** - Use `fn()` for expensive operations
- **Parallel test execution** - Configure workers in playwright.config
- **Screenshot strategically** - Only capture on failure

## Troubleshooting

### Storybook Not Loading

```bash
rm -rf node_modules/.cache
npm run storybook
```

### Playwright Timeout Issues

```typescript
await expect(element).toBeVisible({ timeout: 10000 });
```

### Type Errors with Superforms

```typescript
// Ensure you're using the valibot adapter
import { valibot } from 'sveltekit-superforms/adapters';

const { form } = superForm(data, {
	validators: valibot(profileFormSchema)
});
```

## Contributing

When updating documentation:

1. Verify all code with tool calls
2. Test examples in actual project
3. Document library versions used
4. Include TypeScript types
5. Add verification comments

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Playwright Documentation](https://playwright.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Valibot](https://valibot.dev)
- [SvelteKit Superforms](https://superforms.rocks)
- [Svelte 5 Documentation](https://svelte.dev)

## License

MIT - See main project LICENSE file

---

**Last Updated**: 2025-10-03  
**Verified With**: Context7 Library Documentation Tools
