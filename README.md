# SvelteKit Enterprise

A comprehensive SvelteKit monorepo template with Svelte 5, TypeScript, Turborepo, and modern development tools.

## Features

- **Turborepo Monorepo** - Optimized build caching and parallel execution (4-10x faster builds)
- **Svelte 5** with runes (`$state`, `$derived`, `$effect`, `$props`)
- **TypeScript** with strict type checking
- **Workspace Packages** - Shared database, UI components, schemas, and types
- **Drizzle ORM** with PGlite for type-safe database operations
- **Valibot** for runtime validation
- **Tailwind CSS** + **DaisyUI** for styling
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Storybook** for component development
- **ESLint** for code quality
- **Prettier** for code formatting

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
turbo run dev

# Start only the web app
turbo run dev --filter=web
```

## Available Scripts

### Development

```bash
turbo run dev              # Start all apps in development mode
turbo run dev --filter=web # Start only the web app
turbo run build            # Build all packages and apps
turbo run preview          # Preview production builds
```

### Testing

```bash
turbo run test             # Run all tests (unit + integration)
turbo run test:e2e         # Run E2E tests
turbo run test --filter=web # Run tests for web app only
```

### Code Quality

```bash
turbo run lint             # Run ESLint on all packages
turbo run format           # Format code with Prettier
turbo run check            # Run TypeScript/Svelte type checking
turbo run cpd              # Detect copy-paste code
turbo run knip             # Detect unused exports
```

### Database

```bash
turbo run db:push          # Push schema changes to database
turbo run db:generate      # Generate Drizzle migrations
turbo run db:migrate       # Run database migrations
turbo run db:studio        # Open Drizzle Studio
```

### Storybook

```bash
turbo run storybook        # Start Storybook
turbo run build-storybook  # Build Storybook for production
```

### All Quality Checks (Parallel Execution)

```bash
# Run all quality gates in parallel (recommended for CI/CD)
turbo run build check lint cpd test --parallel

# Run specific quality gates
turbo run build check --parallel
```

## Monorepo Structure

This project uses Turborepo to manage a monorepo with shared packages and applications.

```
sveltekit-enterprise/
├── apps/
│   └── web/                    # Main SvelteKit application
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/ # App-specific components
│       │   │   ├── server/     # Server-side code (AI, MCP)
│       │   │   ├── utils/      # App-specific utilities
│       │   │   └── errors/     # App-specific errors
│       │   ├── routes/         # SvelteKit routes
│       │   └── stories/        # Storybook stories
│       ├── static/             # Static assets
│       ├── tests/              # Test files
│       └── e2e/                # E2E tests
│
├── packages/
│   ├── database/               # @repo/database
│   │   ├── src/
│   │   │   ├── schema/        # Drizzle table schemas
│   │   │   ├── errors/        # Database error types
│   │   │   ├── db.ts          # Database client
│   │   │   ├── queries.ts     # Query functions
│   │   │   └── valibot-schemas.ts
│   │   └── drizzle.config.ts
│   │
│   ├── ui/                     # @repo/ui
│   │   ├── src/
│   │   │   ├── components/    # Shared UI components
│   │   │   │   ├── Button.svelte
│   │   │   │   └── ui/        # shadcn-svelte components
│   │   │   ├── hooks/         # Shared hooks
│   │   │   └── utils/         # UI utilities (cn, shadcn)
│   │   └── svelte.config.js
│   │
│   ├── schemas/                # @repo/schemas
│   │   └── src/               # Valibot validation schemas
│   │
│   ├── types/                  # @repo/types
│   │   └── src/               # Shared TypeScript types
│   │
│   ├── utils/                  # @repo/utils
│   │   └── src/               # Shared utility functions
│   │
│   └── config/                 # @repo/config
│       ├── eslint.config.js   # Shared ESLint config
│       └── tsconfig.json      # Base TypeScript config
│
├── docs/                       # Documentation
│   ├── testing/               # Testing guides
│   ├── storybook-playwright/  # Storybook & Playwright docs
│   └── testing_examples/      # Testing examples
│
├── package.json                # Root workspace configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
└── turbo.json                  # Turborepo pipeline configuration
```

## Workspace Packages

### @repo/database

Database layer with Drizzle ORM and PGlite.

**Exports:**

- `@repo/database` - Main exports (schemas, queries, client)
- `@repo/database/schema` - Drizzle table schemas
- `@repo/database/client` - Database client
- `@repo/database/queries` - Query functions
- `@repo/database/valibot-schemas` - Valibot schemas from Drizzle
- `@repo/database/errors/db` - Database error types

**Usage:**

```typescript
import { db } from '@repo/database/client';
import { user, chat } from '@repo/database/schema';
import { getUserById, saveChat } from '@repo/database/queries';
import type { User, Chat } from '@repo/database/schema';
```

### @repo/ui

Shared Svelte UI components library.

**Exports:**

- `@repo/ui` - Main component exports (Button)
- `@repo/ui/utils` - UI utilities (cn, shadcn utils)
- `@repo/ui/components/ui/*` - Individual UI components

**Usage:**

```typescript
import { Button } from '@repo/ui';
import { cn } from '@repo/ui/utils';
import { Sidebar, SidebarContent } from '@repo/ui/components/ui/sidebar';
```

### @repo/schemas

Valibot validation schemas.

**Usage:**

```typescript
import { userProfileSchema } from '@repo/schemas/user-profile';
import * as v from 'valibot';
```

### @repo/types

Shared TypeScript type definitions.

**Usage:**

```typescript
import type { TransitionConfig, MapboxContext } from '@repo/types';
```

## Path Aliases (apps/web)

The web app uses path aliases for clean imports:

| Alias          | Path                  | Purpose                 |
| -------------- | --------------------- | ----------------------- |
| `$lib`         | `src/lib`             | Default SvelteKit alias |
| `$components`  | `src/lib/components`  | App-specific components |
| `$stores`      | `src/lib/stores`      | Svelte stores           |
| `$actions`     | `src/lib/actions`     | Svelte actions          |
| `$data`        | `src/lib/data`        | Static data             |
| `$transitions` | `src/lib/transitions` | Custom transitions      |
| `$ai`          | `src/lib/server/ai`   | AI SDK code             |
| `$mcp`         | `src/lib/server/mcp`  | MCP tools               |

**Note:** For shared code, use workspace packages (`@repo/*`) instead of path aliases.

## Development Guidelines

### Code Quality Standards

- **No comments in code files** - Code should be self-documenting
- **Clean variable names** - No underscores or prefixes
- **Type safety** - Use TypeScript types throughout
- **Consistent formatting** - Prettier handles this automatically
- **Workspace packages** - Use `@repo/*` imports for shared code
- **Parallel execution** - Use `--parallel` flag for independent tasks

### Turborepo Best Practices

1. **Use `turbo run` for all multi-package tasks**

   ```bash
   turbo run build check lint test --parallel
   ```

2. **Filter tasks to specific packages**

   ```bash
   turbo run build --filter=web
   turbo run test --filter=@repo/database
   ```

3. **Leverage caching for faster builds**
   - First build: ~22 seconds
   - Cached build: ~2-5 seconds (4-10x faster)

4. **Run independent tasks in parallel**
   ```bash
   turbo run lint check cpd --parallel
   ```

### Testing Strategy

- **Unit tests** - Test pure functions and utilities with Vitest
- **Component tests** - Test component interactions with Playwright CT
- **E2E tests** - Test full user workflows with Playwright
- **Visual tests** - Test component appearance with Storybook
- **Package tests** - Test shared packages independently

### Svelte 5 Patterns

```svelte
<script>
	// Use runes instead of legacy syntax
	let count = $state(0);
	let doubled = $derived(count * 2);

	// Use $effect for side effects
	$effect(() => {
		console.log('Count changed:', count);
	});

	// Use $props for component props
	let { title, description } = $props();
</script>

<button onclick={() => count++}>
	Count: {count}, Doubled: {doubled}
</button>
```

## Performance Benefits

### Build Caching

Turborepo caches build outputs and only rebuilds what changed:

- **Initial build**: ~22 seconds
- **Cached build**: ~2-5 seconds
- **Speed improvement**: 4-10x faster

### Parallel Execution

Run independent tasks simultaneously:

```bash
# Run all quality gates in parallel
turbo run build check lint cpd test --parallel

# Turborepo automatically parallelizes tasks across packages
turbo run build  # Builds all packages in parallel
```

### Incremental Builds

Only rebuild packages that changed:

```bash
# Only rebuilds affected packages
turbo run build

# Force rebuild everything
turbo run build --force
```

## Documentation

- **[Monorepo Migration](MONOREPO_MIGRATION.md)** - Complete migration guide and architecture
- **[Path Aliases](docs/PATH_ALIASES.md)** - Complete reference for import aliases
- **[Testing Guide](docs/testing/README.md)** - Comprehensive testing documentation
- **[Storybook & Playwright](docs/storybook-playwright/)** - Component development and testing
- **[Testing Examples](docs/testing_examples/)** - Practical testing patterns

## Contributing

When adding new features:

1. **Determine if code should be shared** - If yes, add to appropriate package in `packages/`
2. **Use workspace packages** - Import from `@repo/*` instead of duplicating code
3. **Run quality gates** - `turbo run build check lint cpd test --parallel`
4. **Update documentation** - Keep README and package docs up to date

## License

MIT
