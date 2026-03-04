# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js Enterprise Boilerplate — a production-ready Next.js 15 starter with App Router, built by Blazity. Uses pnpm as the package manager (pnpm@10.0.0, Node >=20.0.0).

## Common Commands

```bash
pnpm dev                # Start dev server (uses --turbo)
pnpm build              # Production build
pnpm lint               # ESLint check
pnpm lint:fix           # ESLint auto-fix
pnpm prettier           # Prettier check
pnpm prettier:fix       # Prettier auto-fix
pnpm test               # Run unit/integration tests (Vitest)
pnpm test -- path/to/file.test.tsx  # Run a single test file
pnpm test:watch         # Vitest watch mode
pnpm test:coverage      # Vitest with coverage
pnpm e2e:headless       # Playwright E2E tests (all browsers)
pnpm e2e:ui             # Playwright interactive mode
pnpm storybook          # Storybook dev server (port 6006)
pnpm build-storybook    # Build Storybook
ANALYZE=true pnpm build # Bundle analysis
```

## Architecture

- **Framework**: Next.js 15 with App Router (`app/` directory)
- **Styling**: Tailwind CSS v4 via PostCSS (no tailwind.config file — uses CSS-first config in `styles/tailwind.css`)
- **UI Components**: Radix UI primitives + Class Variance Authority (CVA) for variant-based styling
- **State Management**: Zustand (stores live in project root or component files)
- **Type-safe Env**: `env.mjs` uses `@t3-oss/env-nextjs` + Zod for validated environment variables
- **Path Alias**: `@/*` maps to project root (e.g., `@/components/Button/Button`)

### Component Pattern

Components live in `components/` with co-located tests and Storybook stories:
```
components/Button/
  Button.tsx          # Component (uses CVA for variants + tailwind-merge)
  Button.test.tsx     # Vitest + React Testing Library
  Button.stories.tsx  # Storybook stories
```

Client components that use hooks/state must have `"use client"` directive.

### Testing

- **Unit/Integration**: Vitest + React Testing Library (jsdom environment, globals enabled)
- **E2E**: Playwright (`e2e/` directory) — runs against all 3 browsers (Chromium, Firefox, WebKit)
- **Storybook**: Component stories in `components/**/*.stories.tsx`

### CI/CD (GitHub Actions)

CI runs on push to main/master/develop and on PRs:
- Lint + Prettier checks
- Vitest unit/integration tests
- Storybook build + Playwright smoke tests
- Bundle size analysis (compares against base branch)

Node version for CI is pinned in `.github/nodejs.version`.

## Code Conventions

- **Commits**: Conventional commits enforced via git hook. Types: `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `build`, `ops`, `docs`, `chore`, `merge`, `revert`
- **TypeScript**: Strict mode with `noUncheckedIndexedAccess`. Uses `ts-reset` for enhanced type safety.
- **ESLint**: Flat config (`eslint.config.mjs`). Imports are auto-sorted by group.
- **Prettier**: 120 char width, no semicolons, trailing commas (es5), Tailwind class sorting plugin
- **Class utilities**: Use `cn()` (tailwind-merge) for merging Tailwind classes. CVA for component variants.
- **Health checks**: `/healthz`, `/health`, `/ping` all rewrite to `/api/health`
