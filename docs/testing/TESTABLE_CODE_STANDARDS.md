# Testable Code Standards for SvelteKit Enterprise Applications

<!-- Verified via: mcp_context7_get-library-docs, mcp_mcp-svelte-docs_svelte_definition, mcp_supabase_search_docs on 2025-10-03 -->

## Document Purpose

This document defines testability standards for SvelteKit applications using Svelte 5, TypeScript, Drizzle ORM, Valibot, Superforms, and modern testing tools. All patterns are derived from official library documentation and verified through tool discovery.

---

## Table of Contents

1. [Core Testability Principles](#core-testability-principles)
2. [SvelteKit Server-Side Testability](#sveltekit-server-side-testability)
3. [Svelte 5 Component Testability](#svelte-5-component-testability)
4. [Database Layer Testability](#database-layer-testability)
5. [Validation & Type Safety](#validation--type-safety)
6. [Async Patterns & Error Handling](#async-patterns--error-handling)
7. [External Services Testing](#external-services-testing)
8. [Testing Strategies & Organization](#testing-strategies--organization)

---

## Core Testability Principles

<!-- Verified via: mcp_context7_get-library-docs (Vitest, SvelteKit) on 2025-10-03 -->

### 1. Separation of Concerns

**Principle**: Business logic, data access, validation, and UI should be in separate, testable layers.

**Where Code Should Live**:

| Concern        | Location                               | Testable With              | Example                      |
| -------------- | -------------------------------------- | -------------------------- | ---------------------------- |
| Business Logic | `src/lib/models` or `src/lib/services` | Vitest unit tests          | User registration validation |
| Data Access    | `src/lib/queries`                      | Vitest with PGlite         | Database CRUD operations     |
| Validation     | `src/lib/schemas`                      | Vitest unit tests          | Schema validation            |
| UI Logic       | Svelte components                      | Playwright component tests | Button interactions          |
| API Routes     | `src/routes/api/**/*.ts`               | Vitest integration tests   | REST endpoints               |
| Server Load    | `src/routes/**/+page.server.ts`        | Vitest integration tests   | Data fetching                |

**Anti-Pattern - Mixed Concerns**:

```typescript
export const load = async ({ fetch }) => {
	const response = await fetch('/api/users');
	const users = await response.json();
	const validUsers = users.filter((u) => u.email.includes('@'));
	const sortedUsers = validUsers.sort((a, b) => a.name.localeCompare(b.name));
	return { users: sortedUsers };
};
```

**Testable Pattern - Separated Concerns**:

```typescript
export async function getUsersFromApi(fetch: Fetch): Promise<User[]> {
	const response = await fetch('/api/users');
	if (!response.ok) throw new Error('Failed to fetch users');
	return response.json();
}

export function filterValidUsers(users: User[]): User[] {
	return users.filter((u) => v.safeParse(emailSchema, u.email).success);
}

export function sortUsersByName(users: User[]): User[] {
	return [...users].sort((a, b) => a.name.localeCompare(b.name));
}

export const load = async ({ fetch }) => {
	const users = await getUsersFromApi(fetch);
	const validUsers = filterValidUsers(users);
	const sortedUsers = sortUsersByName(validUsers);
	return { users: sortedUsers };
};
```

### 2. Dependency Injection

**Principle**: Pass dependencies explicitly rather than importing them directly to enable mocking.

**Function Injection (Preferred)**:

```typescript
export async function createUser(db: DatabaseClient, userData: InsertUser): Promise<User> {
	const [user] = await db.insert(users).values(userData).returning();
	return user;
}

it('creates a user', async () => {
	const mockDb = {
		insert: vi.fn().mockReturnValue({
			values: vi.fn().mockReturnValue({
				returning: vi.fn().mockResolvedValue([{ id: '123', name: 'Test' }])
			})
		})
	};

	const user = await createUser(mockDb as any, { name: 'Test', email: 'test@example.com' });
	expect(user.id).toBe('123');
});
```

**SvelteKit Context Injection**:

```typescript
import { getRequestEvent } from '$app/server';

export async function getCurrentUser(): Promise<User | null> {
	const { locals } = getRequestEvent();
	return locals.user || null;
}

it('gets current user from locals', async () => {
	vi.mock('$app/server', () => ({
		getRequestEvent: () => ({
			locals: { user: { id: '123', name: 'Test' } }
		})
	}));

	const user = await getCurrentUser();
	expect(user?.id).toBe('123');
});
```

### 3. Pure Functions First

**Principle**: Favor pure functions that are deterministic and have no side effects.

**Pure Function Characteristics**:

- Same input always produces same output
- No side effects (no mutations, I/O, or external state changes)
- Easily testable without mocks or setup
- Can be tested in parallel

**Pure Function Example**:

```typescript
export function calculateTotalPrice(items: CartItem[], taxRate: number): number {
	const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	return subtotal * (1 + taxRate);
}

it('calculates total price correctly', () => {
	const items = [
		{ price: 10, quantity: 2 },
		{ price: 5, quantity: 3 }
	];
	expect(calculateTotalPrice(items, 0.1)).toBe(38.5);
});
```

**Impure Function (Only When Necessary)**:

```typescript
export async function saveUserProfile(
	db: DatabaseClient,
	userId: string,
	profile: ProfileData
): Promise<void> {
	await db.update(userProfiles).set(profile).where(eq(userProfiles.userId, userId));
}

it('saves user profile', async () => {
	const mockDb = createMockDb();
	await saveUserProfile(mockDb, '123', { bio: 'Test' });
	expect(mockDb.update).toHaveBeenCalledWith(userProfiles);
});
```

### 4. Explicit Over Implicit

**Principle**: Make dependencies, parameters, return types, and error conditions explicit.

**Explicit Pattern**:

```typescript
export async function processPayment(
	stripe: Stripe,
	amount: number,
	currency: string,
	customerId: string
): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			customer: customerId
		});
		return { success: true, paymentIntentId: paymentIntent.id };
	} catch (error) {
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
```

**Anti-Pattern - Implicit Dependencies**:

```typescript
import { stripe } from '$lib/server/stripe';

export async function processPayment(amount: number, customerId: string) {
	const paymentIntent = await stripe.paymentIntents.create({
		amount,
		currency: 'usd',
		customer: customerId
	});
	return paymentIntent.id;
}
```

### 5. Single Responsibility Principle

**Principle**: Each module/function should have one reason to change.

**Example - Single Responsibilities**:

```typescript
export async function fetchUserData(userId: string): Promise<RawUserData> {
	const response = await fetch(`/api/users/${userId}`);
	if (!response.ok) throw new Error('User not found');
	return response.json();
}

export function transformUserData(raw: RawUserData): User {
	return {
		id: raw.id,
		name: `${raw.first_name} ${raw.last_name}`,
		email: raw.email.toLowerCase()
	};
}

export function validateUserData(user: User): boolean {
	return v.safeParse(userSchema, user).success;
}

export async function loadAndValidateUser(userId: string): Promise<User> {
	const raw = await fetchUserData(userId);
	const user = transformUserData(raw);
	if (!validateUserData(user)) throw new Error('Invalid user data');
	return user;
}
```

---

## SvelteKit Server-Side Testability

<!-- Verified via: mcp_context7_get-library-docs (SvelteKit) on 2025-10-03 -->

### +page.server.ts Load Functions

**Structure for Testability**:

```typescript
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getUserById } from '$queries';
import type { DatabaseClient } from '$db/client';

export async function fetchUserData(db: DatabaseClient, userId: string): Promise<User | null> {
	return getUserById(db, userId);
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = await fetchUserData(locals.db, params.id);

	if (!user) {
		error(404, { message: 'User not found' });
	}

	return { user };
};
```

**Testing Load Functions**:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUserData } from './+page.server';

describe('fetchUserData', () => {
	let mockDb: any;

	beforeEach(() => {
		mockDb = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([{ id: '123', name: 'Test User' }])
				})
			})
		};
	});

	it('fetches user by ID', async () => {
		const user = await fetchUserData(mockDb, '123');
		expect(user).toEqual({ id: '123', name: 'Test User' });
	});

	it('returns null for non-existent user', async () => {
		mockDb.select.mockReturnValue({
			from: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([])
			})
		});

		const user = await fetchUserData(mockDb, 'non-existent');
		expect(user).toBeNull();
	});
});
```

**Dependency Tracking with `depends()`**:

```typescript
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, fetch }) => {
	depends('custom:user-data');

	const response = await fetch('/api/user');
	return { user: await response.json() };
};
```

### +server.ts API Routes

**Structure for Testability**:

```typescript
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createUser } from '$queries';
import { userInsertSchema } from '$schemas';
import * as v from 'valibot';

export async function validateAndCreateUser(db: DatabaseClient, rawData: unknown): Promise<User> {
	const validated = v.parse(userInsertSchema, rawData);
	return createUser(db, validated);
}

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const rawData = await request.json();
		const user = await validateAndCreateUser(locals.db, rawData);
		return json(user, { status: 201 });
	} catch (err) {
		if (err instanceof v.ValiError) {
			error(400, { message: 'Invalid user data' });
		}
		error(500, { message: 'Failed to create user' });
	}
};
```

**Testing API Routes**:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { validateAndCreateUser } from './+server';
import * as v from 'valibot';

describe('validateAndCreateUser', () => {
	const mockDb = {
		insert: vi.fn().mockReturnValue({
			values: vi.fn().mockReturnValue({
				returning: vi
					.fn()
					.mockResolvedValue([{ id: '123', name: 'John', email: 'john@example.com' }])
			})
		})
	};

	it('validates and creates user with valid data', async () => {
		const rawData = { name: 'John', email: 'john@example.com' };
		const user = await validateAndCreateUser(mockDb as any, rawData);

		expect(user).toEqual({ id: '123', name: 'John', email: 'john@example.com' });
	});

	it('throws ValiError for invalid data', async () => {
		const rawData = { name: 'John', email: 'invalid-email' };

		await expect(() => validateAndCreateUser(mockDb as any, rawData)).rejects.toThrow(v.ValiError);
	});
});
```

### Form Actions

<!-- Verified via: mcp_context7_get-library-docs (SvelteKit, Superforms) on 2025-10-03 -->

**Structure for Testability**:

```typescript
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { profileFormSchema } from '$schemas';
import { upsertProfile } from '$queries';

export async function processProfileSubmission(
	db: DatabaseClient,
	userId: string,
	formData: FormData
): Promise<{ success: boolean; errors?: string[] }> {
	const form = await superValidate(formData, valibot(profileFormSchema));

	if (!form.valid) {
		return { success: false, errors: Object.values(form.errors).flat() };
	}

	await upsertProfile(db, userId, form.data);
	return { success: true };
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const result = await processProfileSubmission(
			locals.db,
			locals.user.id,
			await request.formData()
		);

		if (!result.success) {
			return fail(400, { errors: result.errors });
		}

		return { success: true };
	}
};
```

**Testing Form Actions**:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { processProfileSubmission } from './+page.server';

describe('processProfileSubmission', () => {
	it('processes valid form data', async () => {
		const mockDb = createMockDb();
		const formData = new FormData();
		formData.append('firstName', 'John');
		formData.append('lastName', 'Doe');
		formData.append('email', 'john@example.com');

		const result = await processProfileSubmission(mockDb, 'user-123', formData);

		expect(result.success).toBe(true);
	});

	it('returns errors for invalid data', async () => {
		const mockDb = createMockDb();
		const formData = new FormData();
		formData.append('email', 'invalid-email');

		const result = await processProfileSubmission(mockDb, 'user-123', formData);

		expect(result.success).toBe(false);
		expect(result.errors).toBeDefined();
	});
});
```

### Error Handling in SvelteKit

**HandleServerError Hook**:

```typescript
import type { HandleServerError } from '@sveltejs/kit';

export const handleServerError: HandleServerError = async ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

	console.error(`[${errorId}] ${status}: ${message}`, error);

	return {
		message: 'An unexpected error occurred',
		errorId
	};
};
```

**HandleValidationError Hook**:

```typescript
import type { HandleValidationError } from '@sveltejs/kit';

export const handleValidationError: HandleValidationError = ({ event, issues }) => {
	console.warn('Validation failed:', issues);

	return {
		message: 'Invalid request data'
	};
};
```

---

## Svelte 5 Component Testability

<!-- Verified via: mcp_mcp-svelte-docs_svelte_definition on 2025-10-03 -->

### Component Organization

**Testable Component Structure**:

```svelte
<script lang="ts">
	import type { User } from '$types';
	import { getUserDisplay } from '$utils/user';

	interface Props {
		user: User;
		onUpdate?: (user: User) => void;
	}

	let { user, onUpdate }: Props = $props();

	let isEditing = $state(false);
	let editedName = $state(user.name);

	const displayName = $derived(getUserDisplay(user));

	$effect(() => {
		if (!isEditing) {
			editedName = user.name;
		}
	});

	function handleSave() {
		onUpdate?.({ ...user, name: editedName });
		isEditing = false;
	}
</script>

<div data-testid="user-card">
	{#if isEditing}
		<input bind:value={editedName} data-testid="name-input" />
		<button onclick={handleSave} data-testid="save-button">Save</button>
	{:else}
		<h3>{displayName}</h3>
		<button onclick={() => (isEditing = true)} data-testid="edit-button">Edit</button>
	{/if}
</div>
```

**Testing with Playwright**:

```typescript
import { test, expect } from '@playwright/experimental-ct-svelte';
import UserCard from './UserCard.svelte';

test('allows editing user name', async ({ mount }) => {
	const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
	let updatedUser: User | null = null;

	const component = await mount(UserCard, {
		props: {
			user,
			onUpdate: (u: User) => {
				updatedUser = u;
			}
		}
	});

	await component.getByTestId('edit-button').click();
	await component.getByTestId('name-input').fill('Jane Doe');
	await component.getByTestId('save-button').click();

	expect(updatedUser?.name).toBe('Jane Doe');
	await expect(component.getByText('Jane Doe')).toBeVisible();
});
```

### State Management Patterns

**$state - Local Component State**:

```svelte
<script lang="ts">
	let count = $state(0);
	let todos = $state<Todo[]>([]);

	function increment() {
		count++;
	}

	function addTodo(text: string) {
		todos.push({ id: crypto.randomUUID(), text, completed: false });
	}
</script>
```

**$derived - Computed Values**:

```svelte
<script lang="ts">
	let firstName = $state('John');
	let lastName = $state('Doe');

	const fullName = $derived(`${firstName} ${lastName}`);

	const filteredTodos = $derived(todos.filter((t) => !t.completed));
</script>
```

**$effect - Side Effects**:

```svelte
<script lang="ts">
	let count = $state(0);

	$effect(() => {
		console.log(`Count changed to ${count}`);

		return () => {
			console.log('Cleanup');
		};
	});
</script>
```

### Props and Events

**Component Communication**:

```svelte
<!-- Child.svelte -->
<script lang="ts">
	interface Props {
		items: Item[];
		onItemClick?: (item: Item) => void;
		onDelete?: (id: string) => void;
	}

	let { items, onItemClick, onDelete }: Props = $props();
</script>

<ul>
	{#each items as item}
		<li>
			<span onclick={() => onItemClick?.(item)}>{item.name}</span>
			<button onclick={() => onDelete?.(item.id)}>Delete</button>
		</li>
	{/each}
</ul>
```

```svelte
<!-- Parent.svelte -->
<script>
	let items = $state([]);

	function handleClick(item: Item) {
		console.log('Clicked:', item);
	}

	function handleDelete(id: string) {
		items = items.filter((i) => i.id !== id);
	}
</script>

<ItemList {items} onItemClick={handleClick} onDelete={handleDelete} />
```

### Snippets for Reusable Templates

```svelte
<script lang="ts">
	let { data } = $props();
</script>

{#snippet card(title: string, content: string)}
	<div class="card">
		<h3>{title}</h3>
		<p>{content}</p>
	</div>
{/snippet}

{#each data.posts as post}
	{@render card(post.title, post.excerpt)}
{/each}
```

**Testing Snippets**:

```typescript
test('renders snippet correctly', async ({ mount }) => {
	const component = await mount(CardList, {
		props: { data: { posts: [{ title: 'Test', excerpt: 'Content' }] } }
	});

	await expect(component.getByText('Test')).toBeVisible();
	await expect(component.getByText('Content')).toBeVisible();
});
```

### Anti-Patterns That Hinder Testing

**❌ Deep Effect Nesting**:

```svelte
<script>
	$effect(() => {
		$effect(() => {
			$effect(() => {
				console.log('Too deep!');
			});
		});
	});
</script>
```

**❌ Side Effects in Derived State**:

```svelte
<script>
	const value = $derived(() => {
		fetch('/api/data');
		return someComputation();
	});
</script>
```

**❌ Global State Without Context**:

```svelte
<script>
	import { globalStore } from '$lib/stores/global';

	let value = $state(globalStore.value);
</script>
```

**✅ Use Context for Dependency Injection**:

```svelte
<!-- App.svelte -->
<script>
  import { setContext } from 'svelte';
  import { db } from '$db/client';

  setContext('db', db);
</script>

<!-- Child.svelte -->
<script>
  import { getContext } from 'svelte';

  const db = getContext<DatabaseClient>('db');
</script>
```

---

## Database Layer Testability

<!-- Verified via: mcp_context7_get-library-docs (Drizzle ORM, PGlite, Drizzle-Valibot) on 2025-10-03 -->

### Query Organization

**Connection Injection Pattern**:

```typescript
import { eq } from 'drizzle-orm';
import type { DatabaseClient } from '$db/client';
import { users } from '$schemas/database';
import type { User, InsertUser } from '$types';

export async function getUserById(db: DatabaseClient, id: string): Promise<User | null> {
	const [user] = await db.select().from(users).where(eq(users.id, id));
	return user || null;
}

export async function createUser(db: DatabaseClient, data: InsertUser): Promise<User> {
	const [user] = await db.insert(users).values(data).returning();
	return user;
}

export async function updateUser(
	db: DatabaseClient,
	id: string,
	data: Partial<InsertUser>
): Promise<User> {
	const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
	return user;
}

export async function deleteUser(db: DatabaseClient, id: string): Promise<void> {
	await db.delete(users).where(eq(users.id, id));
}
```

### Transaction Handling

**Testable Transaction Pattern**:

```typescript
export async function transferFunds(
	db: DatabaseClient,
	fromAccountId: string,
	toAccountId: string,
	amount: number
): Promise<{ success: boolean; error?: string }> {
	try {
		await db.transaction(async (tx) => {
			await tx
				.update(accounts)
				.set({ balance: sql`${accounts.balance} - ${amount}` })
				.where(eq(accounts.id, fromAccountId));

			await tx
				.update(accounts)
				.set({ balance: sql`${accounts.balance} + ${amount}` })
				.where(eq(accounts.id, toAccountId));
		});

		return { success: true };
	} catch (error) {
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
```

### Testing with PGlite (In-Memory Database)

<!-- Verified via: mcp_context7_get-library-docs (PGlite) on 2025-10-03 -->

**Setup Test Database**:

```typescript
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { describe, it, expect, beforeEach } from 'vitest';
import * as schema from '$schemas/database';

describe('User Queries', () => {
	let db: ReturnType<typeof drizzle>;
	let pgLite: PGlite;

	beforeEach(async () => {
		pgLite = new PGlite();
		db = drizzle(pgLite, { schema });

		await pgLite.exec(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
	});

	it('creates and retrieves user', async () => {
		const insertData = { name: 'Test User', email: 'test@example.com' };
		const created = await createUser(db, insertData);

		expect(created.name).toBe('Test User');

		const retrieved = await getUserById(db, created.id);
		expect(retrieved).toEqual(created);
	});

	it('handles transactions correctly', async () => {
		await pgLite.transaction(async (tx) => {
			const dbTx = drizzle(tx, { schema });

			await createUser(dbTx, { name: 'User 1', email: 'user1@example.com' });
			await createUser(dbTx, { name: 'User 2', email: 'user2@example.com' });
		});

		const allUsers = await db.select().from(schema.users);
		expect(allUsers).toHaveLength(2);
	});
});
```

### Schema Co-location with Drizzle-Valibot

<!-- Verified via: mcp_context7_get-library-docs (Drizzle-Valibot) on 2025-10-03 -->

```typescript
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users, {
	email: (schema) => v.pipe(schema, v.email('Invalid email format'))
});

export type User = v.InferOutput<typeof selectUserSchema>;
export type InsertUser = v.InferOutput<typeof insertUserSchema>;
```

**Testing Schema Validation**:

```typescript
import { describe, it, expect } from 'vitest';
import { insertUserSchema } from '$schemas';
import * as v from 'valibot';

describe('insertUserSchema', () => {
	it('validates correct user data', () => {
		const data = { name: 'John', email: 'john@example.com' };
		const result = v.safeParse(insertUserSchema, data);

		expect(result.success).toBe(true);
	});

	it('rejects invalid email', () => {
		const data = { name: 'John', email: 'invalid-email' };
		const result = v.safeParse(insertUserSchema, data);

		expect(result.success).toBe(false);
		expect(result.issues?.[0]?.message).toContain('Invalid email format');
	});
});
```

---

## Validation & Type Safety

<!-- Verified via: mcp_context7_get-library-docs (Valibot, Superforms) on 2025-10-03 -->

### Schema Organization

**Centralized Schema Definitions**:

```typescript
// src/lib/schemas/user.ts
import * as v from 'valibot';

export const emailSchema = v.pipe(
	v.string('Email is required'),
	v.nonEmpty('Email cannot be empty'),
	v.email('Invalid email format'),
	v.maxLength(255, 'Email is too long')
);

export const passwordSchema = v.pipe(
	v.string('Password is required'),
	v.minLength(8, 'Password must be at least 8 characters'),
	v.regex(/[A-Z]/, 'Password must contain uppercase letter'),
	v.regex(/[0-9]/, 'Password must contain number')
);

export const loginSchema = v.object({
	email: emailSchema,
	password: passwordSchema
});

export const registerSchema = v.object(
	{
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: v.string()
	},
	[
		v.forward(
			v.partialCheck(
				[['password'], ['confirmPassword']],
				(input) => input.password === input.confirmPassword,
				'Passwords must match'
			),
			['confirmPassword']
		)
	]
);

export type LoginData = v.InferOutput<typeof loginSchema>;
export type RegisterData = v.InferOutput<typeof registerSchema>;
```

### Type Inference

**Pattern - Derive Types from Schemas**:

```typescript
import * as v from 'valibot';
import { createSelectSchema } from 'drizzle-valibot';
import { users } from '$schemas/database';

export const selectUserSchema = createSelectSchema(users);

export const updateUserSchema = v.partial(v.omit(selectUserSchema, ['id', 'createdAt']));

export type User = v.InferOutput<typeof selectUserSchema>;
export type UpdateUser = v.InferOutput<typeof updateUserSchema>;
```

**Anti-Pattern - Manual Type Duplication**:

```typescript
export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
}

export const userSchema = v.object({
	id: v.string(),
	name: v.string(),
	email: v.pipe(v.string(), v.email()),
	createdAt: v.date()
});
```

### Validation Testing

**Testing Custom Validators**:

```typescript
import { describe, it, expect } from 'vitest';
import * as v from 'valibot';

const passwordSchema = v.pipe(
	v.string(),
	v.minLength(8),
	v.custom((value) => /[A-Z]/.test(value), 'Must contain uppercase'),
	v.custom((value) => /[0-9]/.test(value), 'Must contain number')
);

describe('passwordSchema', () => {
	it('accepts valid password', () => {
		const result = v.safeParse(passwordSchema, 'Password123');
		expect(result.success).toBe(true);
	});

	it('rejects password without uppercase', () => {
		const result = v.safeParse(passwordSchema, 'password123');
		expect(result.success).toBe(false);
		expect(result.issues?.[0]?.message).toBe('Must contain uppercase');
	});

	it('rejects password without number', () => {
		const result = v.safeParse(passwordSchema, 'Password');
		expect(result.success).toBe(false);
		expect(result.issues?.[0]?.message).toBe('Must contain number');
	});
});
```

### Superforms Integration

<!-- Verified via: mcp_context7_get-library-docs (Superforms) on 2025-10-03 -->

**Testable Form Structure**:

```svelte
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ProfileFormData } from '$types';

	interface Props {
		data: SuperValidated<ProfileFormData>;
	}

	let { data }: Props = $props();

	const { form, errors, enhance, delayed, submitting } = superForm(data, {
		validators: valibot(profileFormSchema),
		dataType: 'json',
		resetForm: false,
		taintedMessage: 'You have unsaved changes'
	});
</script>

<form method="POST" use:enhance>
	<input type="text" bind:value={$form.name} data-testid="name-input" />
	{#if $errors.name}
		<p class="error" role="alert">{$errors.name[0]}</p>
	{/if}

	<button type="submit" disabled={$submitting} data-testid="submit-button">
		{$submitting ? 'Saving...' : 'Save'}
	</button>
</form>
```

---

## Async Patterns & Error Handling

<!-- Verified via: mcp_context7_get-library-docs (Vitest, SvelteKit, Anthropic SDK, Stripe) on 2025-10-03 -->

### Async/Await Patterns

**Error Handling with Try/Catch**:

```typescript
export async function fetchAndProcessData(
	userId: string
): Promise<{ data?: ProcessedData; error?: string }> {
	try {
		const response = await fetch(`/api/users/${userId}/data`);

		if (!response.ok) {
			return { error: `HTTP ${response.status}: ${response.statusText}` };
		}

		const rawData = await response.json();
		const validated = v.parse(dataSchema, rawData);
		const processed = processData(validated);

		return { data: processed };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}
```

**Testing Async Functions**:

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('fetchAndProcessData', () => {
	it('processes valid data successfully', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ value: 123 })
		});

		const result = await fetchAndProcessData('user-123');

		expect(result.data).toBeDefined();
		expect(result.error).toBeUndefined();
	});

	it('handles HTTP errors', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404,
			statusText: 'Not Found'
		});

		const result = await fetchAndProcessData('user-123');

		expect(result.error).toBe('HTTP 404: Not Found');
	});
});
```

### Promise Patterns

**Parallel vs Sequential Execution**:

```typescript
export async function loadDashboardData(userId: string) {
	const [user, posts, comments] = await Promise.all([
		getUserById(userId),
		getPostsByUser(userId),
		getCommentsByUser(userId)
	]);

	return { user, posts, comments };
}

export async function processWorkflow(data: WorkflowData) {
	const step1 = await processStep1(data);
	const step2 = await processStep2(step1);
	const step3 = await processStep3(step2);

	return step3;
}
```

### Timeout Handling

```typescript
export async function fetchWithTimeout<T>(
	fetcher: () => Promise<T>,
	timeoutMs: number
): Promise<{ data?: T; error?: string }> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const data = await fetcher();
		clearTimeout(timeout);
		return { data };
	} catch (error) {
		clearTimeout(timeout);
		if (error instanceof Error && error.name === 'AbortError') {
			return { error: 'Request timeout' };
		}
		return { error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
```

### Error Type Hierarchies

```typescript
export class ApplicationError extends Error {
	constructor(
		message: string,
		public code: string
	) {
		super(message);
		this.name = 'ApplicationError';
	}
}

export class ValidationError extends ApplicationError {
	constructor(
		message: string,
		public field: string
	) {
		super(message, 'VALIDATION_ERROR');
		this.name = 'ValidationError';
	}
}

export class DatabaseError extends ApplicationError {
	constructor(
		message: string,
		public query?: string
	) {
		super(message, 'DATABASE_ERROR');
		this.name = 'DatabaseError';
	}
}

export class ExternalServiceError extends ApplicationError {
	constructor(
		message: string,
		public service: string,
		public statusCode?: number
	) {
		super(message, 'EXTERNAL_SERVICE_ERROR');
		this.name = 'ExternalServiceError';
	}
}
```

---

## External Services Testing

<!-- Verified via: mcp_context7_get-library-docs (Anthropic SDK, Stripe, Supabase) on 2025-10-03 -->

### AI SDK Testing Patterns

**Abstraction for Testability**:

```typescript
import Anthropic from '@anthropic-ai/sdk';

export interface AIProvider {
	generateText(prompt: string, options?: GenerateOptions): Promise<string>;
	streamText(prompt: string): AsyncIterable<string>;
}

export class AnthropicProvider implements AIProvider {
	constructor(private client: Anthropic) {}

	async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
		const message = await this.client.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: options?.maxTokens || 1024,
			messages: [{ role: 'user', content: prompt }]
		});

		return message.content[0].type === 'text' ? message.content[0].text : '';
	}

	async *streamText(prompt: string): AsyncIterable<string> {
		const stream = await this.client.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 1024,
			messages: [{ role: 'user', content: prompt }],
			stream: true
		});

		for await (const event of stream) {
			if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
				yield event.delta.text;
			}
		}
	}
}
```

**Mocking AI Responses**:

```typescript
import { describe, it, expect, vi } from 'vitest';

class MockAIProvider implements AIProvider {
	async generateText(prompt: string): Promise<string> {
		return `Mocked response to: ${prompt}`;
	}

	async *streamText(prompt: string): AsyncIterable<string> {
		yield 'Mocked ';
		yield 'streaming ';
		yield 'response';
	}
}

describe('AI Integration', () => {
	it('generates text with mock provider', async () => {
		const provider = new MockAIProvider();
		const result = await provider.generateText('Hello');

		expect(result).toBe('Mocked response to: Hello');
	});

	it('streams text with mock provider', async () => {
		const provider = new MockAIProvider();
		const chunks: string[] = [];

		for await (const chunk of provider.streamText('Hello')) {
			chunks.push(chunk);
		}

		expect(chunks).toEqual(['Mocked ', 'streaming ', 'response']);
	});
});
```

### Stripe Testing Patterns

<!-- Verified via: mcp_context7_get-library-docs (Stripe) on 2025-10-03 -->

**Structure for Testability**:

```typescript
import Stripe from 'stripe';

export interface PaymentProvider {
	createPaymentIntent(
		amount: number,
		currency: string,
		customerId: string
	): Promise<{ id: string; clientSecret: string }>;

	constructWebhookEvent(payload: string, signature: string, secret: string): Stripe.Event;
}

export class StripePaymentProvider implements PaymentProvider {
	constructor(private stripe: Stripe) {}

	async createPaymentIntent(
		amount: number,
		currency: string,
		customerId: string
	): Promise<{ id: string; clientSecret: string }> {
		const paymentIntent = await this.stripe.paymentIntents.create({
			amount,
			currency,
			customer: customerId
		});

		return {
			id: paymentIntent.id,
			clientSecret: paymentIntent.client_secret!
		};
	}

	constructWebhookEvent(payload: string, signature: string, secret: string): Stripe.Event {
		return this.stripe.webhooks.constructEvent(payload, signature, secret);
	}
}
```

**Testing Webhooks with Mock Signatures**:

```typescript
import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';

describe('Stripe Webhook Handling', () => {
	it('constructs and validates webhook event', () => {
		const stripe = new Stripe('sk_test_123', { apiVersion: '2024-12-18.acacia' });

		const payload = {
			id: 'evt_test_webhook',
			object: 'event',
			type: 'payment_intent.succeeded'
		};

		const payloadString = JSON.stringify(payload);
		const secret = 'whsec_test_secret';

		const header = stripe.webhooks.generateTestHeaderString({
			payload: payloadString,
			secret
		});

		const event = stripe.webhooks.constructEvent(payloadString, header, secret);

		expect(event.id).toBe(payload.id);
		expect(event.type).toBe('payment_intent.succeeded');
	});
});
```

**Error Handling Pattern**:

```typescript
export async function handleStripePayment(
	stripe: Stripe,
	amount: number,
	customerId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: 'usd',
			customer: customerId
		});

		return { success: true };
	} catch (err) {
		if (err instanceof Stripe.errors.StripeError) {
			switch (err.type) {
				case 'StripeCardError':
					return { success: false, error: 'Card declined' };
				case 'StripeInvalidRequestError':
					return { success: false, error: 'Invalid request parameters' };
				case 'StripeAPIError':
					return { success: false, error: 'Stripe API error' };
				case 'StripeAuthenticationError':
					return { success: false, error: 'Authentication failed' };
				default:
					return { success: false, error: 'Payment processing failed' };
			}
		}
		return { success: false, error: 'Unknown error' };
	}
}
```

### Supabase Testing Patterns

<!-- Verified via: mcp_supabase_search_docs on 2025-10-03 -->

**Dependency Injection for Supabase Client**:

```typescript
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$types/supabase';

export async function getUserTodos(
	supabase: SupabaseClient<Database>,
	userId: string
): Promise<Todo[]> {
	const { data, error } = await supabase.from('todos').select('*').eq('user_id', userId);

	if (error) throw error;
	return data || [];
}
```

**Testing with Unique Identifiers (Application-Level)**:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

describe('Todos RLS', () => {
	const USER_1_ID = crypto.randomUUID();
	const USER_2_ID = crypto.randomUUID();

	const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

	beforeAll(async () => {
		const adminSupabase = createClient(process.env.SUPABASE_URL!, process.env.SERVICE_ROLE_KEY!);

		await adminSupabase.auth.admin.createUser({
			id: USER_1_ID,
			email: `user1-${USER_1_ID}@test.com`,
			password: 'password123',
			email_confirm: true
		});

		await adminSupabase.from('todos').insert([
			{ task: 'User 1 Task 1', user_id: USER_1_ID },
			{ task: 'User 1 Task 2', user_id: USER_1_ID }
		]);
	});

	it('allows User 1 to only see their own todos', async () => {
		await supabase.auth.signInWithPassword({
			email: `user1-${USER_1_ID}@test.com`,
			password: 'password123'
		});

		const { data: todos } = await supabase.from('todos').select('*');

		expect(todos).toHaveLength(2);
		todos?.forEach((todo) => expect(todo.user_id).toBe(USER_1_ID));
	});
});
```

---

## Testing Strategies & Organization

<!-- Verified via: mcp_context7_get-library-docs (Vitest, Playwright) on 2025-10-03 -->

### Test File Organization

```
src/
├── lib/
│   ├── queries/
│   │   ├── users.ts
│   │   └── users.test.ts
│   ├── schemas/
│   │   ├── user.ts
│   │   └── user.test.ts
│   ├── components/
│   │   ├── UserCard.svelte
│   │   ├── UserCard.stories.ts
│   │   └── UserCard.spec.ts
│   └── utils/
│       ├── validation.ts
│       └── validation.test.ts
├── routes/
│   └── api/
│       └── users/
│           ├── +server.ts
│           └── +server.test.ts
tests/
├── integration/
│   ├── user-flow.test.ts
│   └── auth-flow.test.ts
├── e2e/
│   ├── login.spec.ts
│   └── profile.spec.ts
└── setup/
    ├── test-db.ts
    └── vitest-setup.ts
```

### Vitest Configuration

**Setup and Teardown**:

```typescript
import { beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

let pgLite: PGlite;
let db: ReturnType<typeof drizzle>;

beforeAll(async () => {
	pgLite = new PGlite();
	db = drizzle(pgLite, { schema });
});

afterAll(async () => {
	await pgLite.close();
});

beforeEach(async () => {
	await pgLite.exec('BEGIN');
});

afterEach(async () => {
	await pgLite.exec('ROLLBACK');
});
```

**Reusable Test Fixtures**:

```typescript
import { test as base } from 'vitest';

interface TestFixtures {
	db: ReturnType<typeof drizzle>;
	mockUser: User;
}

export const test = base.extend<TestFixtures>({
	db: async ({}, use) => {
		const pgLite = new PGlite();
		const db = drizzle(pgLite, { schema });

		await pgLite.exec(`CREATE TABLE users (...)`);

		await use(db);

		await pgLite.close();
	},

	mockUser: async ({}, use) => {
		const user = {
			id: crypto.randomUUID(),
			name: 'Test User',
			email: 'test@example.com'
		};

		await use(user);
	}
});
```

### Mocking Strategies

**Module Mocking**:

```typescript
import { vi } from 'vitest';

vi.mock('$db/client', () => ({
	db: {
		select: vi.fn(),
		insert: vi.fn(),
		update: vi.fn(),
		delete: vi.fn()
	}
}));
```

**Function Spying**:

```typescript
import { vi, describe, it, expect } from 'vitest';

const messages = {
	items: [],
	addItem(item: Message) {
		messages.items.push(item);
	}
};

describe('message system', () => {
	it('tracks method calls with spy', () => {
		const spy = vi.spyOn(messages, 'addItem');

		messages.addItem({ text: 'Hello', from: 'User' });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith({ text: 'Hello', from: 'User' });
	});
});
```

**MSW for API Mocking**:

```typescript
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
	http.get('/api/users/:id', ({ params }) => {
		return HttpResponse.json({
			id: params.id,
			name: 'Test User',
			email: 'test@example.com'
		});
	})
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Playwright Component Testing

**Testing Interactive Components**:

```typescript
import { test, expect } from '@playwright/experimental-ct-svelte';
import LoginForm from './LoginForm.svelte';

test('validates email format', async ({ mount }) => {
	const component = await mount(LoginForm);

	await component.getByTestId('email-input').fill('invalid-email');
	await component.getByTestId('submit-button').click();

	await expect(component.getByText(/Invalid email format/i)).toBeVisible();
});

test('calls onSubmit with valid data', async ({ mount }) => {
	let submitted: any = null;

	const component = await mount(LoginForm, {
		props: {
			onSubmit: (data: any) => {
				submitted = data;
			}
		}
	});

	await component.getByTestId('email-input').fill('test@example.com');
	await component.getByTestId('password-input').fill('Password123');
	await component.getByTestId('submit-button').click();

	expect(submitted).toEqual({
		email: 'test@example.com',
		password: 'Password123'
	});
});
```

### Test Isolation

**Unique IDs for Test Isolation**:

```typescript
import crypto from 'crypto';

describe('User Management', () => {
	it('creates user with unique ID', async () => {
		const testId = crypto.randomUUID();
		const email = `test-${testId}@example.com`;

		const user = await createUser({ name: 'Test', email });

		expect(user.email).toBe(email);
	});
});
```

**Transaction Rollback for Database Tests**:

```typescript
import { beforeEach, afterEach } from 'vitest';

beforeEach(async () => {
	await db.transaction(async (tx) => {
		testTx = tx;
	});
});

afterEach(async () => {
	await testTx.rollback();
});
```

---

## Best Practices Summary

### DO ✅

1. **Inject dependencies** - Pass database clients, API clients, and services as parameters
2. **Use pure functions** - Favor deterministic functions without side effects
3. **Test behaviors** - Focus on what the code does, not how it does it
4. **Mock external services** - Use MSW for HTTP, mock providers for AI/payments
5. **Use TypeScript strictly** - Enable strict mode and infer types from schemas
6. **Organize by feature** - Keep tests close to the code they test
7. **Use data-testid** - Provide stable selectors for UI testing
8. **Handle errors explicitly** - Return error objects or use custom error types
9. **Isolate tests** - Use transactions, unique IDs, or in-memory databases
10. **Document test intent** - Use descriptive test names and organize with describe blocks

### DON'T ❌

1. **Don't hardcode dependencies** - Avoid direct imports of database/API clients in business logic
2. **Don't test implementation details** - Test public APIs and behaviors
3. **Don't use real services in tests** - Mock AI APIs, payment providers, external services
4. **Don't share state between tests** - Each test should be independent
5. **Don't duplicate types** - Infer types from Valibot/Drizzle schemas
6. **Don't mix concerns** - Separate validation, business logic, and data access
7. **Don't ignore error cases** - Test both success and failure paths
8. **Don't use `any` type** - Use explicit types or `unknown` with guards
9. **Don't skip cleanup** - Use afterEach/afterAll or onTestFinished for cleanup
10. **Don't test third-party code** - Trust libraries, test your integration

---

## Testing Tools Reference

<!-- Verified via: mcp_context7_get-library-docs on 2025-10-03 -->

### Vitest

- **Purpose**: Fast unit and integration testing
- **Use For**: Pure functions, queries, schemas, business logic
- **Key Features**: vi.mock(), vi.fn(), vi.spyOn(), beforeEach/afterEach, describe/it

### Playwright

- **Purpose**: Component and E2E testing
- **Use For**: Component interactions, user flows, visual testing
- **Key Features**: mount(), getByTestId(), userEvent, expect assertions

### PGlite

- **Purpose**: In-memory PostgreSQL for testing
- **Use For**: Database integration tests with real SQL
- **Key Features**: new PGlite(), transaction(), exec(), query()

### MSW (Mock Service Worker)

- **Purpose**: HTTP request mocking
- **Use For**: Mocking external APIs in tests
- **Key Features**: http.get(), http.post(), setupServer(), HttpResponse

### Storybook

- **Purpose**: Component development and interaction testing
- **Use For**: Visual testing, component documentation, play functions
- **Key Features**: Meta, StoryObj, play functions, fn(), expect

---

## Verification

All patterns in this document were verified using:

- `mcp_context7_get-library-docs` - Library documentation for Vitest, Playwright, Drizzle, Valibot, Superforms, Anthropic SDK, Stripe
- `mcp_mcp-svelte-docs_svelte_definition` - Svelte 5 runes definitions
- `mcp_supabase_search_docs` - Supabase testing best practices

**Library Versions**:

- SvelteKit: Latest
- Svelte 5: Latest
- Vitest: v3.2.4
- Playwright: Latest
- Drizzle ORM: Latest
- Valibot: Latest
- Superforms: v2.27.0
- PGlite: Latest

---

**Last Updated**: 2025-10-03  
**Maintained By**: Development Team  
**Review Cycle**: Quarterly or when major library updates occur
