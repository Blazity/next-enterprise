# Interaction Testing with Play Functions

<!-- Verified via: mcp_context7_get-library-docs on 2025-10-03 -->

## Overview

Interaction testing in Storybook allows you to simulate user interactions and verify component behavior through automated sequences. Play functions are the core mechanism for defining interactive behaviors in stories, enabling comprehensive testing of user flows and state changes within your SvelteKit components.

## Why Interaction Testing?

Interaction testing provides several key benefits:

- **User Journey Simulation**: Test complete user workflows within components
- **State Management**: Verify component state changes and side effects
- **Error Scenarios**: Test error handling and edge cases
- **Accessibility**: Verify keyboard navigation and screen reader compatibility
- **Performance**: Measure interaction performance and responsiveness

## Prerequisites

```bash
npm install --save-dev @storybook/test @storybook/addon-interactions
```

## Advanced Production Example: User Profile Form

<!-- Verified via: mcp_context7_get-library-docs (Storybook, Drizzle, Valibot, Superforms) on 2025-10-03 -->

This comprehensive example demonstrates:

1. Loading data from Drizzle database
2. Making external API call with database data
3. Populating Superforms with Valibot schema validation
4. Testing complete user interaction flow with Storybook
5. End-to-end validation with Playwright

### 1. Database Schema Definition

```typescript
// src/lib/schemas/database.ts
import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const userProfiles = pgTable('user_profiles', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.references(() => users.id)
		.notNull(),
	bio: text('bio'),
	skills: text('skills').array(),
	yearsExperience: integer('years_experience'),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
```

### 2. Valibot Schema with Drizzle Integration

```typescript
// src/lib/schemas/index.ts
import { createSelectSchema, createInsertSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { users, userProfiles } from './database';

export const selectUserSchema = createSelectSchema(users);
export const selectProfileSchema = createSelectSchema(userProfiles);

export const profileFormSchema = v.object({
	firstName: v.pipe(v.string(), v.nonEmpty('First name is required'), v.maxLength(50)),
	lastName: v.pipe(v.string(), v.nonEmpty('Last name is required'), v.maxLength(50)),
	email: v.pipe(v.string(), v.nonEmpty('Email is required'), v.email('Invalid email format')),
	bio: v.pipe(v.string(), v.maxLength(500, 'Bio must be 500 characters or less')),
	skills: v.array(v.pipe(v.string(), v.nonEmpty())),
	yearsExperience: v.pipe(v.number(), v.minValue(0), v.maxValue(50))
});

export const enrichmentApiResponseSchema = v.object({
	suggestedBio: v.string(),
	suggestedSkills: v.array(v.string()),
	estimatedExperience: v.number()
});
```

### 3. Type Definitions

```typescript
// src/lib/types/index.ts
import type * as v from 'valibot';
import type {
	selectUserSchema,
	selectProfileSchema,
	profileFormSchema,
	enrichmentApiResponseSchema
} from '$schemas';

export type User = v.InferOutput<typeof selectUserSchema>;
export type UserProfile = v.InferOutput<typeof selectProfileSchema>;
export type ProfileFormData = v.InferOutput<typeof profileFormSchema>;
export type EnrichmentApiResponse = v.InferOutput<typeof enrichmentApiResponseSchema>;
```

### 4. Database Queries

```typescript
// src/lib/queries/index.ts
import { db } from '$db/client';
import { users, userProfiles } from '$schemas/database';
import { eq } from 'drizzle-orm';
import type { User, UserProfile } from '$types';

export async function getUserById(id: string): Promise<User | null> {
	const [user] = await db.select().from(users).where(eq(users.id, id));
	return user || null;
}

export async function getProfileByUserId(userId: string): Promise<UserProfile | null> {
	const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
	return profile || null;
}

export async function upsertProfile(
	userId: string,
	data: Omit<UserProfile, 'id' | 'userId' | 'updatedAt'>
): Promise<UserProfile> {
	const existing = await getProfileByUserId(userId);

	if (existing) {
		const [updated] = await db
			.update(userProfiles)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(userProfiles.userId, userId))
			.returning();
		return updated;
	}

	const [created] = await db
		.insert(userProfiles)
		.values({ ...data, userId })
		.returning();
	return created;
}
```

### 5. SvelteKit Server Route with API Integration

```typescript
// src/routes/api/profile/enrich/+server.ts
import { json, error } from '@sveltejs/kit';
import { enrichmentApiResponseSchema } from '$schemas';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { userId } = await request.json();

	if (!userId) {
		error(400, 'User ID is required');
	}

	try {
		const response = await fetch('https://api.external-enrichment.example/profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.ENRICHMENT_API_KEY}`
			},
			body: JSON.stringify({ userId })
		});

		if (!response.ok) {
			error(response.status, 'Enrichment API failed');
		}

		const data = await response.json();
		const validated = v.parse(enrichmentApiResponseSchema, data);

		return json(validated);
	} catch (err) {
		console.error('Profile enrichment failed:', err);
		error(500, 'Failed to enrich profile data');
  }
};
```

### 6. Svelte 5 Component with Superforms

```svelte
<!-- src/lib/components/ProfileForm/ProfileForm.svelte -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { profileFormSchema } from '$schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ProfileFormData } from '$types';

	interface Props {
		data: SuperValidated<ProfileFormData>;
		onEnrich?: (userId: string) => Promise<void>;
		loading?: boolean;
	}

	let { data, onEnrich, loading = false }: Props = $props();

	const { form, errors, enhance, delayed, submitting } = superForm(data, {
		validators: valibot(profileFormSchema),
		dataType: 'json',
		resetForm: false,
		taintedMessage: 'You have unsaved changes. Are you sure you want to leave?'
	});

	let enriching = $state(false);

	async function handleEnrich() {
		if (!onEnrich) return;
		enriching = true;
		try {
			await onEnrich($form.email);
		} finally {
			enriching = false;
		}
	}
</script>

<form method="POST" use:enhance class="space-y-6">
	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="firstName" class="block text-sm font-medium"> First Name </label>
			<input
				id="firstName"
				type="text"
				bind:value={$form.firstName}
				aria-invalid={!!$errors.firstName}
				aria-describedby={$errors.firstName ? 'firstName-error' : undefined}
				class="mt-1 block w-full rounded-md border-gray-300"
				data-testid="firstName"
			/>
			{#if $errors.firstName}
				<p id="firstName-error" class="mt-1 text-sm text-red-600" role="alert">
					{$errors.firstName[0]}
				</p>
			{/if}
		</div>

		<div>
			<label for="lastName" class="block text-sm font-medium"> Last Name </label>
			<input
				id="lastName"
				type="text"
				bind:value={$form.lastName}
				aria-invalid={!!$errors.lastName}
				aria-describedby={$errors.lastName ? 'lastName-error' : undefined}
				class="mt-1 block w-full rounded-md border-gray-300"
				data-testid="lastName"
			/>
			{#if $errors.lastName}
				<p id="lastName-error" class="mt-1 text-sm text-red-600" role="alert">
					{$errors.lastName[0]}
				</p>
			{/if}
		</div>
	</div>

	<div>
		<label for="email" class="block text-sm font-medium"> Email </label>
		<input
			id="email"
			type="email"
			bind:value={$form.email}
			aria-invalid={!!$errors.email}
			aria-describedby={$errors.email ? 'email-error' : undefined}
			class="mt-1 block w-full rounded-md border-gray-300"
			data-testid="email"
		/>
		{#if $errors.email}
			<p id="email-error" class="mt-1 text-sm text-red-600" role="alert">
				{$errors.email[0]}
			</p>
		{/if}
	</div>

	<div>
		<label for="bio" class="block text-sm font-medium"> Bio </label>
		<textarea
			id="bio"
			bind:value={$form.bio}
			rows="4"
			aria-invalid={!!$errors.bio}
			aria-describedby={$errors.bio ? 'bio-error' : undefined}
			class="mt-1 block w-full rounded-md border-gray-300"
			data-testid="bio"
		/>
		{#if $errors.bio}
			<p id="bio-error" class="mt-1 text-sm text-red-600" role="alert">
				{$errors.bio[0]}
			</p>
		{/if}
	</div>

	<div>
		<label for="yearsExperience" class="block text-sm font-medium"> Years of Experience </label>
		<input
			id="yearsExperience"
			type="number"
			min="0"
			max="50"
			bind:value={$form.yearsExperience}
			aria-invalid={!!$errors.yearsExperience}
			aria-describedby={$errors.yearsExperience ? 'yearsExperience-error' : undefined}
			class="mt-1 block w-full rounded-md border-gray-300"
			data-testid="yearsExperience"
		/>
		{#if $errors.yearsExperience}
			<p id="yearsExperience-error" class="mt-1 text-sm text-red-600" role="alert">
				{$errors.yearsExperience[0]}
			</p>
		{/if}
	</div>

	<div class="flex gap-4">
		<button
			type="button"
			onclick={handleEnrich}
			disabled={enriching || $submitting}
			class="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
			data-testid="enrichButton"
		>
			{enriching ? 'Enriching...' : 'Enrich Profile'}
		</button>

		<button
			type="submit"
			disabled={$submitting || $delayed}
			class="rounded-md bg-green-600 px-4 py-2 text-white disabled:opacity-50"
			data-testid="submitButton"
		>
			{$submitting ? 'Saving...' : 'Save Profile'}
		</button>
	</div>

	{#if loading || $delayed}
		<div class="mt-4" role="status" aria-live="polite">
			<span class="text-gray-600">Processing...</span>
		</div>
	{/if}
</form>
```

### 7. Storybook Story with Interaction Testing

```typescript
// src/lib/components/ProfileForm/ProfileForm.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import { expect, fn, waitFor, within, userEvent } from '@storybook/test';
import ProfileForm from './ProfileForm.svelte';
import { defaults } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { profileFormSchema } from '$schemas';

const meta = {
	title: 'Forms/ProfileForm',
	component: ProfileForm,
  parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Production-ready profile form with external API enrichment and full validation.'
			}
		}
	},
	tags: ['autodocs']
} satisfies Meta<ProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		data: defaults(valibot(profileFormSchema)),
		onEnrich: fn(),
		loading: false
	}
};

export const CompleteUserFlow: Story = {
	args: {
		data: defaults(valibot(profileFormSchema)),
		onEnrich: fn(async (userId: string) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return {
				suggestedBio: 'Experienced software engineer',
				suggestedSkills: ['TypeScript', 'Svelte', 'Node.js'],
				estimatedExperience: 5
			};
		}),
		loading: false
	},
	play: async ({ args, canvas, step }) => {
		const screen = within(canvas);

		await step('Fill out basic information', async () => {
			const firstNameInput = screen.getByTestId('firstName');
			const lastNameInput = screen.getByTestId('lastName');
			const emailInput = screen.getByTestId('email');

			await userEvent.type(firstNameInput, 'John');
			await userEvent.type(lastNameInput, 'Doe');
			await userEvent.type(emailInput, 'john.doe@example.com');

			await expect(firstNameInput).toHaveValue('John');
			await expect(lastNameInput).toHaveValue('Doe');
			await expect(emailInput).toHaveValue('john.doe@example.com');
		});

		await step('Click enrich button and wait for API response', async () => {
			const enrichButton = screen.getByTestId('enrichButton');
			await userEvent.click(enrichButton);

			await expect(args.onEnrich).toHaveBeenCalledWith('john.doe@example.com');

			await waitFor(() => {
				expect(enrichButton).not.toBeDisabled();
			});
		});

		await step('Fill enriched data', async () => {
			const bioInput = screen.getByTestId('bio');
			const experienceInput = screen.getByTestId('yearsExperience');

			await userEvent.clear(bioInput);
			await userEvent.type(bioInput, 'Experienced software engineer');

			await userEvent.clear(experienceInput);
			await userEvent.type(experienceInput, '5');

			await expect(bioInput).toHaveValue('Experienced software engineer');
			await expect(experienceInput).toHaveValue(5);
		});

		await step('Submit form', async () => {
			const submitButton = screen.getByTestId('submitButton');
			await userEvent.click(submitButton);

			await expect(submitButton).toBeDisabled();
		});
	}
};

export const ValidationErrors: Story = {
	args: {
		data: defaults(valibot(profileFormSchema)),
		onEnrich: fn(),
		loading: false
	},
	play: async ({ canvas, step }) => {
		const screen = within(canvas);

		await step('Submit empty form to trigger validation', async () => {
			const submitButton = screen.getByTestId('submitButton');
			await userEvent.click(submitButton);

			await waitFor(() => {
				const firstNameError = screen.queryByText(/First name is required/i);
				const lastNameError = screen.queryByText(/Last name is required/i);
				const emailError = screen.queryByText(/Email is required/i);

				expect(firstNameError).toBeInTheDocument();
				expect(lastNameError).toBeInTheDocument();
				expect(emailError).toBeInTheDocument();
			});
		});

		await step('Fix validation errors one by one', async () => {
			const firstNameInput = screen.getByTestId('firstName');
			await userEvent.type(firstNameInput, 'John');

    await waitFor(() => {
				const firstNameError = screen.queryByText(/First name is required/i);
				expect(firstNameError).not.toBeInTheDocument();
			});
		});
	}
};

export const LoadingState: Story = {
  args: {
		data: defaults(valibot(profileFormSchema)),
		onEnrich: fn(),
		loading: true
	},
	play: async ({ canvas }) => {
		const screen = within(canvas);

		const loadingIndicator = await screen.findByRole('status');
		await expect(loadingIndicator).toHaveTextContent(/Processing/i);
  }
};
```

### 8. Playwright E2E Test

```typescript
// tests/profile-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Profile Form E2E', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:6006/?path=/story/forms-profileform--complete-user-flow');
    await page.waitForLoadState('networkidle');
	});

	test('complete user journey with API enrichment', async ({ page }) => {
		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await test.step('Fill basic information', async () => {
			await storyFrame.getByTestId('firstName').fill('Jane');
			await storyFrame.getByTestId('lastName').fill('Smith');
			await storyFrame.getByTestId('email').fill('jane.smith@example.com');

			await expect(storyFrame.getByTestId('firstName')).toHaveValue('Jane');
		});

		await test.step('Enrich profile data', async () => {
			await storyFrame.getByTestId('enrichButton').click();

			await expect(storyFrame.getByTestId('enrichButton')).toBeDisabled();
			await expect(storyFrame.getByTestId('enrichButton')).toContainText(/Enriching/i);

			await expect(storyFrame.getByTestId('enrichButton')).not.toBeDisabled({ timeout: 5000 });
		});

		await test.step('Complete and submit form', async () => {
			await storyFrame.getByTestId('bio').fill('Senior full-stack developer');
			await storyFrame.getByTestId('yearsExperience').fill('7');

			await storyFrame.getByTestId('submitButton').click();

			await expect(storyFrame.getByTestId('submitButton')).toBeDisabled();
			await expect(storyFrame.getByTestId('submitButton')).toContainText(/Saving/i);
		});
	});

	test('validates required fields', async ({ page }) => {
		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await storyFrame.getByTestId('submitButton').click();

		await expect(storyFrame.getByText(/First name is required/i)).toBeVisible();
		await expect(storyFrame.getByText(/Last name is required/i)).toBeVisible();
		await expect(storyFrame.getByText(/Email is required/i)).toBeVisible();
	});

	test('validates email format', async ({ page }) => {
		const storyFrame = page.frameLocator('[data-testid="storybook-preview-iframe"]').first();

		await storyFrame.getByTestId('email').fill('invalid-email');
		await storyFrame.getByTestId('submitButton').click();

		await expect(storyFrame.getByText(/Invalid email format/i)).toBeVisible();
  });
});
```

## Best Practices

### 1. Use `step()` for Organized Tests

```typescript
play: async ({ canvas, step }) => {
	await step('User authentication', async () => {
		// Test authentication flow
	});

	await step('Data loading', async () => {
		// Test data fetching
	});

	await step('Form submission', async () => {
		// Test form submission
	});
};
```

### 2. Mock External Dependencies

```typescript
export const WithMockedAPI: Story = {
	parameters: {
		msw: {
			handlers: [
				http.post('/api/profile/enrich', () => {
					return HttpResponse.json({
						suggestedBio: 'Mock bio',
						suggestedSkills: ['Skill1', 'Skill2'],
						estimatedExperience: 3
					});
				})
			]
		}
  }
};
```

### 3. Test Accessibility

```typescript
play: async ({ canvas }) => {
	const screen = within(canvas);

	const firstNameInput = screen.getByLabelText(/first name/i);
	await expect(firstNameInput).toHaveAccessibleName('First Name');

	await userEvent.type(firstNameInput, '');
	const errorMessage = screen.getByRole('alert');
	await expect(errorMessage).toBeInTheDocument();
};
```

### 4. Handle Async Operations

```typescript
play: async ({ canvas }) => {
	const screen = within(canvas);

	await userEvent.click(screen.getByRole('button'));

	await waitFor(
		() => {
			expect(screen.getByText('Success')).toBeInTheDocument();
		},
		{ timeout: 5000 }
	);
};
```

## Next Steps

With interaction testing configured, you can:

1. Test complete user journeys within components
2. Verify database integration and API calls
3. Validate form submission and error handling
4. Ensure TypeScript type safety throughout
5. Run comprehensive E2E tests with Playwright

Continue to: **CI/CD Integration** for automated testing workflows.
