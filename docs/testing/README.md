# Testing Documentation

<!-- Verified via: mcp_context7_get-library-docs, mcp_mcp-svelte-docs_svelte_definition, mcp_supabase_search_docs on 2025-10-03 -->

Comprehensive testing documentation for SvelteKit enterprise applications with Svelte 5, TypeScript, and modern testing tools.

## Documentation Overview

### Core Standards

- **[Testable Code Standards](./TESTABLE_CODE_STANDARDS.md)** - Comprehensive guide to writing testable code across all application layers

### Framework-Specific Guides

Located in `/docs/storybook-playwright/`:

1. **[Storybook Basics](../storybook-playwright/01-storybook-basics.md)** - Component development and testing
2. **[Playwright Setup](../storybook-playwright/02-playwright-setup.md)** - E2E testing configuration
3. **[Stories in E2E Tests](../storybook-playwright/03-stories-in-e2e-tests.md)** - Testing Storybook stories with Playwright
4. **[Interaction Testing](../storybook-playwright/04-interaction-testing.md)** - Advanced play functions and user flows

### Testing Examples

Located in `/docs/testing_examples/`:

1. **[Vitest Unit Testing Basics](../testing_examples/01-vitest-unit-testing-basics.md)** - Unit testing fundamentals
2. **[Vitest Mocking Strategies](../testing_examples/02-vitest-mocking-strategies.md)** - Advanced mocking patterns
3. **[Testing Valibot Schemas](../testing_examples/03-testing-valibot-schemas.md)** - Schema validation testing
4. **[Testing Drizzle Queries](../testing_examples/04-testing-drizzle-queries.md)** - Database query testing
5. **[Testing SvelteKit API Routes](../testing_examples/05-testing-sveltekit-api-routes.md)** - API endpoint testing

## Quick Reference

### Testing Stack

| Layer             | Tool            | Purpose                            | Documentation                                                                   |
| ----------------- | --------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| Unit Tests        | Vitest          | Pure functions, utilities, schemas | [Testable Standards](./TESTABLE_CODE_STANDARDS.md#validation--type-safety)      |
| Component Tests   | Playwright CT   | Component interactions             | [Interaction Testing](../storybook-playwright/04-interaction-testing.md)        |
| Integration Tests | Vitest + PGlite | Database operations, API routes    | [Database Testability](./TESTABLE_CODE_STANDARDS.md#database-layer-testability) |
| E2E Tests         | Playwright      | Full user workflows                | [Stories in E2E](../storybook-playwright/03-stories-in-e2e-tests.md)            |
| Visual Tests      | Storybook       | Component appearance, states       | [Storybook Basics](../storybook-playwright/01-storybook-basics.md)              |

### Test Commands

```bash
turbo run test
turbo run test:integration
turbo run test:e2e

npm run storybook
npm run test-storybook

npx playwright test
npx playwright test --headed
npx playwright test --debug

deno test --allow-all
supabase test db
```

## Core Principles

### 1. Separation of Concerns

```typescript
export async function fetchData(db: DatabaseClient): Promise<Data[]>;
export function validateData(data: Data[]): ValidationResult;
export function transformData(data: Data[]): TransformedData[];

export async function loadPageData(db: DatabaseClient): Promise<PageData> {
	const rawData = await fetchData(db);
	const validated = validateData(rawData);
	const transformed = transformData(rawData);
	return { data: transformed };
}
```

### 2. Dependency Injection

```typescript
export async function processUser(
	db: DatabaseClient,
	stripe: Stripe,
	userId: string
): Promise<Result> {
	const user = await getUserById(db, userId);
	const payment = await createPayment(stripe, user);
	return { user, payment };
}
```

### 3. Pure Functions First

```typescript
export function calculateTotal(items: Item[]): number {
	return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

test('calculates total correctly', () => {
	expect(calculateTotal([{ price: 10, quantity: 2 }])).toBe(20);
});
```

### 4. Type Safety

```typescript
import { createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const selectUserSchema = createSelectSchema(users);
export type User = v.InferOutput<typeof selectUserSchema>;
```

## Common Patterns

### Testing SvelteKit Load Functions

```typescript
export async function loadUserData(db: DatabaseClient, userId: string) {
	const user = await getUserById(db, userId);
	return { user };
}

test('loads user data', async () => {
	const mockDb = createMockDb();
	const result = await loadUserData(mockDb, '123');
	expect(result.user).toBeDefined();
});
```

### Testing Svelte 5 Components

```typescript
import { test, expect } from '@playwright/experimental-ct-svelte';

test('component handles user interaction', async ({ mount }) => {
	const component = await mount(MyComponent);
	await component.getByTestId('button').click();
	await expect(component.getByText('Clicked')).toBeVisible();
});
```

### Testing Database Queries with PGlite

```typescript
import { PGlite } from '@electric-sql/pglite';
import { beforeEach, afterEach } from 'vitest';

let pgLite: PGlite;

beforeEach(async () => {
	pgLite = new PGlite();
	await pgLite.exec(`CREATE TABLE users (...)`);
});

afterEach(async () => {
	await pgLite.close();
});
```

### Testing API Routes

```typescript
import { validateAndCreateUser } from './+server';

test('validates and creates user', async () => {
	const mockDb = createMockDb();
	const data = { name: 'Test', email: 'test@example.com' };

	const user = await validateAndCreateUser(mockDb, data);
	expect(user.name).toBe('Test');
});
```

## Testing Anti-Patterns

### ❌ Hardcoded Dependencies

```typescript
import { db } from '$db/client';

export async function getUser(id: string) {
	return db.select().from(users).where(eq(users.id, id));
}
```

### ✅ Injected Dependencies

```typescript
export async function getUser(db: DatabaseClient, id: string) {
	return db.select().from(users).where(eq(users.id, id));
}
```

### ❌ Testing Implementation

```typescript
test('uses array filter method', () => {
	const spy = vi.spyOn(Array.prototype, 'filter');
	filterUsers(users);
	expect(spy).toHaveBeenCalled();
});
```

### ✅ Testing Behavior

```typescript
test('filters active users', () => {
	const users = [
		{ id: '1', active: true },
		{ id: '2', active: false }
	];
	const result = filterActiveUsers(users);
	expect(result).toHaveLength(1);
	expect(result[0].id).toBe('1');
});
```

## Tool Verification

All code examples and patterns in this documentation were discovered and verified through:

1. **mcp_context7_get-library-docs** - Retrieved current documentation for:
   - SvelteKit (load functions, API routes, form actions, hooks)
   - Vitest (mocking, async patterns, setup/teardown, fixtures)
   - Playwright (component testing, interaction patterns, mocking)
   - Drizzle ORM (query patterns, transactions, schema definition)
   - PGlite (in-memory database, transaction management)
   - Drizzle-Valibot (schema integration, type inference)
   - Valibot (schema composition, validation, type inference)
   - Superforms (form validation, integration patterns)
   - Anthropic SDK (streaming, error handling, mocking)
   - Stripe (webhook testing, error handling, idempotency)

2. **mcp_mcp-svelte-docs_svelte_definition** - Retrieved Svelte 5 runes definitions:
   - $state (reactive state management)
   - $derived (computed values)
   - $effect (side effects and cleanup)
   - $props (component properties)
   - snippets (reusable template fragments)
   - component-events (callback props pattern)

3. **mcp_supabase_search_docs** - Retrieved Supabase testing practices:
   - RLS policy testing with pgTAP
   - Application-level testing strategies
   - Test isolation with unique identifiers
   - Auth testing patterns

## Resources

### Official Documentation

- [SvelteKit Documentation](https://kit.svelte.dev)
- [Svelte 5 Documentation](https://svelte.dev)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Valibot](https://valibot.dev)
- [Superforms](https://superforms.rocks)
- [PGlite](https://pglite.dev)
- [Supabase Testing](https://supabase.com/docs/guides/local-development/testing/overview)

### Testing Utilities

- [Mock Service Worker (MSW)](https://mswjs.io)
- [pgTAP](https://pgtap.org)
- [Storybook Testing](https://storybook.js.org/docs/writing-tests)

## Contributing

When updating testing documentation:

1. **Verify with tools** - Use mcp_context7_get-library-docs to verify patterns
2. **Test examples** - Ensure all code examples actually work
3. **Document versions** - Include library versions used
4. **Add verification comments** - Mark sections with tool verification dates
5. **Update index** - Keep this README in sync with new guides

## License

MIT - See main project LICENSE file

---

**Last Updated**: 2025-10-03  
**Verification Method**: MCP Tool Discovery  
**Next Review**: 2026-01-03 (or upon major framework updates)
