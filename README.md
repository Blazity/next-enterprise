# SvelteKit Enterprise

A comprehensive SvelteKit project template with Svelte 5, TypeScript, and modern development tools.

## Features

- **Svelte 5** with runes (`$state`, `$derived`, `$effect`, `$props`)
- **TypeScript** with strict type checking
- **Tailwind CSS** for styling
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Storybook** for component development
- **ESLint** for code quality
- **Prettier** for code formatting
- **Turbo** for monorepo management

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
pnpm dev --open
```

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm test:integration # Run integration tests

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm check            # Run TypeScript checks
pnpm cpd              # Detect copy-paste code

# Storybook
pnpm storybook        # Start Storybook
pnpm test-storybook   # Test Storybook stories

# All quality checks
turbo run build       # Production build validation
turbo run check       # TypeScript/Svelte type checking
turbo run lint        # ESLint code quality
turbo run cpd         # Copy-paste detection
turbo run test        # Vitest unit & integration tests
```

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── actions/        # Svelte actions
│   ├── stores/         # Svelte stores
│   ├── data/          # Static data
│   ├── transitions/   # Custom transitions
│   ├── hooks/         # Custom hooks
│   └── server/        # Server-side utilities
├── routes/            # SvelteKit routes
├── stories/           # Storybook stories
└── tests/             # Test files

docs/                  # Documentation
├── testing/           # Testing guides
├── storybook-playwright/ # Storybook & Playwright docs
└── testing_examples/  # Testing examples
```

## Path Aliases

The project uses path aliases for clean imports:

| Alias          | Path                  | Purpose                 |
| -------------- | --------------------- | ----------------------- |
| `$lib`         | `src/lib`             | Default SvelteKit alias |
| `$components`  | `src/lib/components`  | UI components           |
| `$stores`      | `src/lib/stores`      | Svelte stores           |
| `$actions`     | `src/lib/actions`     | Svelte actions          |
| `$data`        | `src/lib/data`        | Static data             |
| `$transitions` | `src/lib/transitions` | Custom transitions      |

## Development Guidelines

### Code Quality Standards

- **No comments in code files** - Code should be self-documenting
- **Clean variable names** - No underscores or prefixes
- **Type safety** - Use TypeScript types throughout
- **Consistent formatting** - Prettier handles this automatically

### Testing Strategy

- **Unit tests** - Test pure functions and utilities with Vitest
- **Component tests** - Test component interactions with Playwright CT
- **E2E tests** - Test full user workflows with Playwright
- **Visual tests** - Test component appearance with Storybook

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

## Documentation

- **[Path Aliases](docs/PATH_ALIASES.md)** - Complete reference for import aliases
- **[Testing Guide](docs/testing/README.md)** - Comprehensive testing documentation
- **[Storybook & Playwright](docs/storybook-playwright/)** - Component development and testing
- **[Testing Examples](docs/testing_examples/)** - Practical testing patterns

## License

MIT
