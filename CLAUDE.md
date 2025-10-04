# Code Quality Remediation - Complete Repository Cleanup

## Turborepo Monorepo Architecture

This repository uses Turborepo to manage a monorepo with shared packages and applications.

### Repository Structure

```
sveltekit-enterprise/
├── apps/
│   └── web/                    # Main SvelteKit application
├── packages/
│   ├── database/               # @repo/database - Database layer
│   ├── ui/                     # @repo/ui - Shared UI components
│   ├── schemas/                # @repo/schemas - Valibot schemas
│   ├── types/                  # @repo/types - Shared types
│   ├── utils/                  # @repo/utils - Shared utilities
│   └── config/                 # @repo/config - Shared configs
├── package.json                # Root workspace configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
└── turbo.json                  # Turborepo pipeline configuration
```

### Workspace Package Imports

**ALWAYS use workspace packages for shared code:**

```typescript
import { db } from '@repo/database/client';
import { user, chat } from '@repo/database/schema';
import { getUserById } from '@repo/database/queries';
import { Button } from '@repo/ui';
import { cn } from '@repo/ui/utils';
import type { User, TransitionConfig } from '@repo/types';
import { userProfileSchema } from '@repo/schemas/user-profile';
```

**App-specific path aliases (apps/web only):**

```typescript
import { MyComponent } from '$components';
import { myStore } from '$stores';
import { myAction } from '$actions';
import { aiProvider } from '$ai';
```

### Turborepo Commands

**ALWAYS use `turbo run` for multi-package tasks:**

```bash
turbo run build check lint cpd test --parallel
turbo run build --filter=web
turbo run test --filter=@repo/database
```

**Benefits:**

- 4-10x faster builds with caching
- Parallel execution across packages
- Only rebuilds what changed

## Quality Standards and Success Criteria

**COMPLETION REQUIREMENT:**
Achieve 100% completion—success is defined when ALL six validation commands exit with code 0:

```bash
turbo run build       # Production build validation
turbo run check       # TypeScript/Svelte type checking
turbo run lint        # ESLint code quality
turbo run cpd         # Copy-paste detection (jscpd)
turbo run test        # Vitest unit & integration tests
```

**Run all quality gates in parallel for maximum efficiency:**

```bash
turbo run build check lint cpd test --parallel
```

This is an evaluation, exiting before completion is an automatic failure.

**QUALITY STANDARDS:**

- Every validation command must pass (exit code 0 for each) for all affected packages.
- No errors, no warnings—full codebase reliability and maintainability.
- All changes are code-level, not configuration workarounds.
- Do not weaken or bypass standards.

## Scope

- All TypeScript (.ts), JavaScript (.js), and Svelte (.svelte) files
- Server-side handlers (+server.ts, +page.server.ts)
- Remote functions (.remote.ts)
- Utility modules, shared libraries
- All test files (unit and E2E)

**Quality Gates:**

- turbo run build
- turbo run check (svelte-check/tsc)
- turbo run lint (including svelte-eslint-parser)
- turbo run cpd (jscpd)
- turbo run test (Vitest/unit)
- turbo run test:e2e (Playwright E2E, if configured)

**Documentation:**  
Review `docs/playwright` for E2E best practices; update test utilities and README.

## Non-Negotiable Constraints

**Forbidden:**

- ❌ Adding `eslint-disable` or `@ts-ignore/comment` suppressions
- ❌ Weakening rules, relaxing config, adding ignores
- ❌ Modifying config files or ignoring code to pass checks
- ❌ Leaving comments or using variable prefixes/underscores

**Forbidden Actions:**

- ❌ Adding `eslint-disable` comments
- ❌ Adding `@ts-ignore` or `@ts-expect-error` comments
- ❌ Relaxing rule severity (error → warn → off)
- ❌ Expanding ignore patterns in config files
- ❌ Excluding files from linting/type-checking to make checks pass
- ❌ Downgrading TypeScript strict mode settings
- ❌ Removing or weakening existing rules
- ❌ Modifying lint configuration files to bypass standards
- ❌ Modifying test configuration files to bypass requirements
- ❌ Leaving any comments in code files (all comments must be removed)
- ❌ Using underscores or prefixes in variable names (e.g., \_unused, tempValue)

**Required Approach:**

- ✅ Fix code to meet existing standards
- ✅ Strengthen rules if configuration errors are found
- ✅ Preserve all existing behavior and public APIs
- ✅ Keep UI/UX changes minimal; document any necessary changes
- ✅ Maintain database schema semantics
- ✅ Use clean, descriptive variable names without prefixes or underscores
- ✅ Remove all existing comments from code files
- ✅ Make all fixes in source code, not configuration files
  **Required:**

- ✅ Fix all issues in source code—none in configuration
- ✅ Strengthen rules if configuration errors are discovered
- ✅ Document all visible changes; UI/UX to remain stable

## Implementation Plan

### Phase 1: Baseline Assessment

```bash
turbo run build 2>&1 | tee build-errors.log
turbo run check 2>&1 | tee check-errors.log
turbo run lint 2>&1 | tee lint-errors.log
turbo run cpd 2>&1 | tee cpd-errors.log
turbo run test 2>&1 | tee test-errors.log
turbo run test:integration 2>&1 | tee test-e2e-errors.log
```

- Capture all output.
- Categorize issues by type, package, and severity.

### Phase 2: Systematic Code Fixes

**Code Cleanliness:**

- Remove all comments from all code files (TypeScript, JavaScript, Svelte)
- Rename any variables using underscores or prefixes to clean, descriptive names
- Replace constructs like `_unused` or `tempValue` with meaningful names like `userId` or `processedData`
- If a variable genuinely isn't used, refactor the code to eliminate it entirely

**Svelte Component Fixes:**

- Add `type="button"` to all `<button>` elements without explicit type
- Convert inline `style="..."` to `style:property={value}` directives
- Self-close void elements: `<img />`, `<input />`, `<br />`, `<hr />`
- Reorder attributes: directives → bindings → event handlers → other attributes
- Replace `let` with `const` in `<script>` blocks where variables aren't reassigned
- Add `rel="noopener noreferrer"` to `<a target="_blank">` links
- Destructure `$props()` according to svelte/prefer-destructuring rule

**TypeScript Fixes:**

- Replace `any` with specific types or `unknown` with type guards
- Remove unused variables through code refactoring (do not use underscore prefix)
- Add explicit return types to all functions
- Fix type mismatches in Drizzle `.returning()` calls
- Resolve "possibly undefined" errors with proper null checks
- Use type assertions only when absolutely necessary

**Database/Drizzle Fixes:**

- Ensure all `.delete()` calls include `.where()` clause
- Use specific column selection instead of `.select()` where performance matters
- Align `.returning()` types with consumer expectations
- Fix any schema type mismatches

**Formatting Fixes:**

- Run `pnpm run format --write` to auto-fix formatting
- Manually resolve any remaining formatting conflicts
- Ensure no trailing whitespace, consistent line breaks, proper indentation

**Dead Code Removal (Knip):**

- Remove unused exports, functions, and variables
- Consolidate duplicate code into shared utilities
- Remove unused dependencies from package.json
- Fix incorrect import paths

- Remove all comments, variable prefixes, underscores.
- Refactor to clean, descriptive variable names.
- Apply project-specific fixes (button types, attribute ordering, etc).
- Fix all Svelte, TypeScript, Drizzle, formatting, duplication, and dead code issues as described in the original plan, but always running as `turbo run <task>`.
- For targeted fix verification: `turbo run lint --filter=packages/foo -- path/to/file.ts` (or similar).

### Phase 3: E2E Test Improvements

**Review Documentation:**

- Study `docs/playwright` for project-specific best practices
- Understand recommended locator strategies and assertion patterns

**Improve Test Reliability:**

- Replace brittle selectors (CSS classes, nth-child) with `data-testid` attributes
- Use semantic locators: `getByRole`, `getByLabel`, `getByText`
- Add explicit waits: `toBeVisible()`, `toBeEnabled()`, `toHaveURL()`
- Remove arbitrary `waitForTimeout()` calls
- Mock network requests deterministically with `page.route()`
- Use fixtures for consistent test data
- Ensure tests are isolated (no shared state between tests)

**Behavioral Assertions:**

- Test user-facing outcomes, not implementation details
- Verify visible text, URLs, enabled/disabled states
- Avoid testing internal state or component structure
- Use `expect.poll()` only when necessary with clear justification

**Deterministic Execution:**

- Set consistent seeds for random data
- Use `baseURL` from configuration
- Load environment from `.env.test`
- Ensure tests pass 3 consecutive times locally
- Verify single green run in CI without retries

**Test Utilities:**

- Create/update login helpers to reduce duplication
- Build data factories for consistent test fixtures
- Document common patterns in test utilities

### Phase 4: Iterative Validation

**Incremental Verification Strategy:**

1. Fix one category of issues (e.g., all Svelte button-has-type errors)
2. Run targeted validation: `turbo lint -- path/to/fixed/files`
3. If passing, run full validation: `turbo lint`
4. Move to next category
5. After each major batch, run all 6 validation commands
6. Continue until all commands exit with code 0

**Validation Order (by priority):**

1. `turbo build` (highest priority - ensures code compiles)
2. `turbo check` (type safety verification)
3. `turbo lint` (code quality standards)
4. `turbo cpd` (duplication detection)
5. `turbo test` (unit and integration test validation)

## Deliverables

**Clean Validation Results:**

- All 6 commands exit with code 0
- Zero errors, zero warnings
- `svelte-check` reports: "0 errors, 0 warnings"
- ESLint reports: "0 problems"
- All tests passing

**Reliable E2E Suite:**

- Stable locators (data-testid, semantic roles)
- Behavioral assertions (user-visible outcomes)
- No flakiness: 3 consecutive green runs locally + 1 green CI run
- No test retries needed

**Clean Codebase:**

- Zero comments remaining in any code files
- All variables using clean, descriptive names without prefixes or underscores
- Code structured for clarity without requiring explanatory comments

**Documentation Review:**

- Review `docs/playwright` for coding conventions

## YOUR CONSTITUTIONAL DIRECTIVE

You are bound by the Design Constitution with these immutable principles:

**Article I: Navigational Sanity & Information Architecture**

- Related controls must be logically grouped and colocated
- Eliminate redundant controls and duplicate functionality
- Ensure visual hierarchy reflects importance

**Article II: Direct Manipulation and Immediate Feedback**

- Every user action must provide visible, immediate feedback
- Dynamic state changes must be reflected in real-time
- Synchronized controls must update simultaneously

**Article III: Predictability and Convention**

- Follow standard Svelte 5 and Daisy UI 5 patterns
- Maintain internal consistency across components
- Use conventional web interaction patterns

**Article IV: Mistake-Proofing (Poka-Yoke)**

- Prevent invalid input combinations through UI constraints
- Provide clear error states and recovery paths
- Use proper form validation and user guidance

**Article V: Effort Proportionality**

- Implement smart defaults and reasonable inferences
- Minimize required user input while allowing customization
- Respect user time and cognitive load

**Article VI: Algorithmic Transparency**

- Use clear, descriptive component names and props
- Ensure UI behavior is predictable and understandable
- Provide appropriate feedback for all system states

## SVELTE 5 AND DAISY UI 5 COMPLIANCE REQUIREMENTS

You must ensure the code adheres to:

**Svelte 5 Specific:**

- Use runes ($state, $derived, $effect) instead of legacy reactive declarations
- Implement proper component composition with snippets
- Use modern event handling patterns
- Follow Svelte 5 TypeScript conventions
- Implement proper lifecycle management

**Daisy UI 5 Specific:**

- Use correct Daisy UI 5 class names and component structures
- Implement proper theme integration
- Follow Daisy UI 5 accessibility patterns
- Use appropriate semantic HTML with Daisy UI styling
- Ensure responsive design with Daisy UI utilities

**General UI/UX Requirements:**

- Implement proper loading states and error handling
- Ensure keyboard navigation and screen reader compatibility
- Use appropriate ARIA labels and semantic markup
- Implement proper form validation and user feedback
- Follow mobile-first responsive design principles

## REMEDIATION PROCESS

1. **Scan for Constitutional Violations**: Identify any code that violates the Design Constitution principles
2. **Check Svelte 5 Compliance**: Update any legacy Svelte patterns to Svelte 5 standards
3. **Verify Daisy UI 5 Usage**: Correct any outdated or incorrect Daisy UI implementations
4. **Fix Accessibility Issues**: Ensure proper semantic markup and ARIA support
5. **Optimize User Experience**: Implement proper feedback, validation, and error handling

## Acceptance Criteria

✅ **Zero rule relaxations or suppressions introduced**
✅ **No broadened ignore patterns in config files**
✅ **No modifications to lint or test configuration files**
✅ **All 6 quality gates pass with 0 errors and 0 warnings**
✅ **E2E suite: 3 consecutive green runs locally + 1 green CI run**
✅ **No unintended behavior changes or API breaks**
✅ **All necessary visible changes documented in change log**
✅ **Code follows existing architectural patterns**
✅ **Zero comments remaining in code files**
✅ **All variables use clean names without underscores or prefixes**

## Execution Guidelines

**Package Management:**

- Use existing scripts only: `turbo run <script>`
- Do not add, remove, or update dependencies without approval
- Do not modify package.json scripts

**Configuration Management:**

- Do not modify any lint configuration files
- Do not modify any test configuration files
- All fixes must be made in source code files
- Configuration represents immutable quality standards

**Work Continuity:**

- Work systematically through all issues until all 6 commands pass
- Address blocking issues by documenting and moving to other fixable items
- Return to blocked items after gathering more context
- Maintain steady progress across all quality dimensions

## Final Validation Sequence

Before declaring completion, run this exact sequence:

```bash
turbo install

# Run all validations in priority order
turbo run build && \
turbo run check && \
turbo lint && \
turbo run cpd && \
turbo run test

# Verify exit codes
echo "All validations passed: $?"
```

**Success = exit code 0 for entire sequence**
**Continue fixing = any non-zero exit code**

## Quality Achievement Goal

The goal is to achieve 100% completion because partial remediation leaves technical debt that compounds over time. A completely clean codebase:

- Builds reliably in all environments
- Maintains type safety across all modules
- Follows consistent quality standards
- Passes all automated tests
- Contains no code duplication issues
- Uses clear, self-documenting code without comments

# SvelteKit Type-Safe Architecture Guide

## Critical Architecture Principles

### Schema-First Development

1. ALL data structures start as Drizzle schemas in `packages/database/src/schema/`
2. Generate Valibot schemas using `createSelectSchema()` from Drizzle
3. Derive TypeScript types using `v.InferOutput<typeof schema>`
4. NEVER manually create types that can be derived from schemas

### Workspace Package Import System

**ALWAYS use workspace packages for shared code:**

| Package          | Import Path                      | Purpose                       |
| ---------------- | -------------------------------- | ----------------------------- |
| `@repo/database` | `@repo/database/client`          | Database client               |
| `@repo/database` | `@repo/database/schema`          | Drizzle table schemas         |
| `@repo/database` | `@repo/database/queries`         | Database query functions      |
| `@repo/database` | `@repo/database/valibot-schemas` | Valibot schemas from Drizzle  |
| `@repo/database` | `@repo/database/errors/db`       | Database error types          |
| `@repo/ui`       | `@repo/ui`                       | Shared UI components (Button) |
| `@repo/ui`       | `@repo/ui/utils`                 | UI utilities (cn, shadcn)     |
| `@repo/ui`       | `@repo/ui/components/ui/*`       | Individual UI components      |
| `@repo/schemas`  | `@repo/schemas`                  | Valibot validation schemas    |
| `@repo/schemas`  | `@repo/schemas/user-profile`     | User profile schemas          |
| `@repo/types`    | `@repo/types`                    | Shared TypeScript types       |

**App-specific path aliases (apps/web only):**

| Alias          | Path                  | Purpose                 |
| -------------- | --------------------- | ----------------------- |
| `$lib`         | `src/lib`             | Default SvelteKit alias |
| `$components`  | `src/lib/components`  | App-specific components |
| `$stores`      | `src/lib/stores`      | Svelte stores           |
| `$remote`      | `src/lib/remote`      | Remote functions        |
| `$actions`     | `src/lib/actions`     | Svelte actions          |
| `$data`        | `src/lib/data`        | Static data             |
| `$transitions` | `src/lib/transitions` | Custom transitions      |
| `$ai`          | `src/lib/server/ai`   | AI SDK code             |
| `$mcp`         | `src/lib/server/mcp`  | MCP tools               |
| `$api`         | `src/routes/api`      | API endpoints           |

**NEVER use relative imports. Use workspace packages or path aliases.**

### Anti-Duplication Workflow

#### Before Creating ANY Schema:

1. Check `packages/database/src/schema/` for existing Drizzle schema
2. Check `packages/schemas/src/` for existing Valibot schema
3. Check if schema can be composed from existing schemas
4. Only create new schema if absolutely necessary
5. Export from appropriate package index

#### Before Creating ANY Type:

1. Check `packages/types/src/index.ts` for existing type
2. Check if type can be inferred from Valibot schema
3. Check if type can be composed from existing types
4. Only create new type if absolutely necessary
5. Export from `packages/types/src/index.ts`

#### Before Creating ANY Component:

1. Check `packages/ui/src/components/` for shared component
2. Check `apps/web/src/lib/components/` for app-specific component
3. Check if existing component can be extended with props
4. Only create new component if absolutely necessary
5. Export from appropriate package or app index

#### Before Creating ANY Utility:

1. Check if utility is app-specific or shared
2. If shared, add to `packages/utils/src/`
3. If app-specific, add to `apps/web/src/lib/utils/`
4. Export from appropriate index file

### Code Organization

#### packages/database/src/schema/users.ts

```typescript
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
```

#### packages/database/src/valibot-schemas.ts

```typescript
import { createSelectSchema, createInsertSchema } from 'drizzle-valibot';
import * as v from 'valibot';
import { users } from './schema';

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
```

#### packages/types/src/index.ts

```typescript
import type * as v from 'valibot';
import type { selectUserSchema, insertUserSchema } from '@repo/database/valibot-schemas';

export type User = v.InferOutput<typeof selectUserSchema>;
export type InsertUser = v.InferOutput<typeof insertUserSchema>;
```

#### packages/database/src/queries.ts

```typescript
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import type { User, InsertUser } from '@repo/types';

export async function getUserById(id: string): Promise<User | null> {
	const [user] = await db.select().from(users).where(eq(users.id, id));
	return user || null;
}

export async function createUser(data: InsertUser): Promise<User> {
	const [user] = await db.insert(users).values(data).returning();
	return user;
}
```

#### src/lib/remote/index.ts

```typescript
import { query, command } from '$app/server'
import { resumeAnalysisSchema, resumeResponseSchema } from '$schemas'
import type { ResumeAnalysis, ResumeResponse } from '$types'
import \* as v from 'valibot'

export const analyzeResume = query(
resumeAnalysisSchema,
async (data: ResumeAnalysis): Promise<ResumeResponse> => {
const response = await fetch('/api/ai/analyze', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data)
});

if (!response.ok) {
throw new Error('Analysis failed');
}

const result = await response.json();
return v.parse(resumeResponseSchema, result);
}
);

export const deleteResume = command(
v.pipe(v.string(), v.uuid()),
async (id: string): Promise<void> => {
const response = await fetch(/api/resumes/${id}, {
method: 'DELETE'
});

if (!response.ok) {
throw new Error('Delete failed');
}
}
);
```

#### src/lib/components/index.ts

```typescript
export { default as ResumeUpload } from './ResumeUpload.svelte';
export { default as ResumeList } from './ResumeList.svelte';
export { default as JobCard } from './JobCard.svelte';
export { default as SkillBadge } from './SkillBadge.svelte';
```

### Import Examples

CORRECT (Workspace Packages):

```typescript
import { db } from '@repo/database/client';
import { user, chat } from '@repo/database/schema';
import { getUserById, createUser } from '@repo/database/queries';
import type { User, Chat } from '@repo/database/schema';
import { Button } from '@repo/ui';
import { cn } from '@repo/ui/utils';
import { userProfileSchema } from '@repo/schemas/user-profile';
import type { TransitionConfig } from '@repo/types';
```

CORRECT (App-specific Path Aliases):

```typescript
import { MyComponent } from '$components';
import { myStore } from '$stores';
import { myAction } from '$actions';
import { aiProvider } from '$ai';
import { mcpTool } from '$mcp';
```

INCORRECT (Relative Imports):

```typescript
import { getUserById } from '../../../packages/database/src/queries';
import { Button } from '../../packages/ui/src/components/Button.svelte';
import type { User } from '../lib/types/index';
```

### Testing with Workspace Packages

ALL test files MUST use workspace packages and path aliases:

```typescript
import { describe, it, expect } from 'vitest';
import { getUserById } from '@repo/database/queries';
import { userProfileSchema } from '@repo/schemas/user-profile';
import type { User } from '@repo/database/schema';
import { server } from '../tests/setup-integration';
```

### Drizzle-Valibot Integration Pattern

ALWAYS prefer Drizzle schema as source of truth:

```typescript
import { createSelectSchema, createInsertSchema } from 'drizzle-valibot';
import { users } from '@repo/database/schema';
import * as v from 'valibot';

export const selectUserSchema = createSelectSchema(users);

export const updateUserSchema = v.partial(v.omit(createInsertSchema(users), ['id', 'createdAt']));

export const userLoginSchema = v.pick(selectUserSchema, ['email']);
```

### AI Agent Checklist

Before writing ANY code, verify:

- [ ] Checked `packages/database/src/schema/` for Drizzle schema
- [ ] Checked `packages/database/src/valibot-schemas.ts` for Valibot schema
- [ ] Checked `packages/types/src/index.ts` for TypeScript type
- [ ] Checked `packages/database/src/queries.ts` for database query
- [ ] Checked `packages/ui/src/components/` for shared UI component
- [ ] Checked `apps/web/src/lib/components/` for app-specific component
- [ ] Using workspace packages (`@repo/*`) for shared code
- [ ] Using path aliases for app-specific code
- [ ] Exporting from appropriate package index.ts file
- [ ] Using Svelte 5 runes syntax
- [ ] Validating with Valibot schemas
- [ ] Running `turbo run build check lint --parallel` before committing

### Monorepo File Structure

```
sveltekit-enterprise/
├── apps/
│   └── web/                    # Main SvelteKit application
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/ # App-specific components
│       │   │   ├── server/     # Server-side code (AI, MCP)
│       │   │   ├── utils/      # App-specific utilities
│       │   │   ├── stores/     # Svelte stores
│       │   │   ├── actions/    # Svelte actions
│       │   │   └── errors/     # App-specific errors
│       │   ├── routes/         # SvelteKit routes
│       │   └── tests/          # Test files
│       └── package.json
│
├── packages/
│   ├── database/               # @repo/database
│   │   ├── src/
│   │   │   ├── schema/        # Drizzle table schemas
│   │   │   ├── errors/        # Database error types
│   │   │   ├── db.ts          # Database client
│   │   │   ├── queries.ts     # Query functions
│   │   │   └── valibot-schemas.ts
│   │   └── package.json
│   │
│   ├── ui/                     # @repo/ui
│   │   ├── src/
│   │   │   ├── components/    # Shared UI components
│   │   │   ├── hooks/         # Shared hooks
│   │   │   └── utils/         # UI utilities
│   │   └── package.json
│   │
│   ├── schemas/                # @repo/schemas
│   │   ├── src/               # Valibot validation schemas
│   │   └── package.json
│   │
│   ├── types/                  # @repo/types
│   │   ├── src/               # Shared TypeScript types
│   │   └── package.json
│   │
│   ├── utils/                  # @repo/utils
│   │   ├── src/               # Shared utility functions
│   │   └── package.json
│   │
│   └── config/                 # @repo/config
│       ├── eslint.config.js   # Shared ESLint config
│       ├── tsconfig.json      # Base TypeScript config
│       └── package.json
│
├── package.json                # Root workspace configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
└── turbo.json                  # Turborepo pipeline configuration
```

This architecture eliminates code duplication through:

- **Single source of truth** - Drizzle schemas in `@repo/database`
- **Workspace packages** - Shared code in `packages/`
- **Centralized exports** - Each package has index.ts
- **Type inference** - Types derived from Valibot schemas
- **Reusable components** - UI components in `@repo/ui`
- **Turborepo caching** - 4-10x faster builds
