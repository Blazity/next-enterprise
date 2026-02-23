<!-- Developer-facing internals. For project motivation and feature list, see README.md. -->

# Developer Documentation

## 1. Project Overview

`next-enterprise` is a production-ready Next.js 15 App Router boilerplate. It provides a pre-configured foundation for building scalable web applications with strict type safety, comprehensive testing, and CI/CD out of the box.

| Detail | Value |
|---|---|
| Framework | Next.js 15.3.8 (App Router) |
| Runtime | React 19.1.0 |
| Language | TypeScript 5.8.3 (strict mode) |
| Styling | Tailwind CSS v4 |
| Node.js | >= 20.0.0 |
| Package manager | pnpm 10.0.0 (enforced via `packageManager` field) |

---

## 2. Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version | Install |
|---|---|---|
| Node.js | >= 20.0.0 | [nodejs.org](https://nodejs.org) or via `nvm` |
| pnpm | 10.0.0 | `npm install -g pnpm@10.0.0` |
| Git | any | [git-scm.com](https://git-scm.com) |

> **Using nvm?** Run `nvm install 20 && nvm use 20` to switch to a compatible Node version.

> **WARNING: Do not use `npm install` or `yarn install`.** This project enforces `pnpm` via the `packageManager` field in `package.json`. Using `npm` will fail with a peer dependency conflict (`@radix-ui/react-form` vs React 19) because `npm` is strict about peer deps. `pnpm` resolves this correctly. Always use `pnpm install`.

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/Blazity/next-enterprise.git
cd next-enterprise
```

### Step 2 — Install dependencies

```bash
pnpm install
```

This installs all packages from `package.json` and automatically runs `patch-package` via the `postinstall` hook to apply any local dependency patches. This is expected — you will see output like `applying patch …` in the terminal.

### Step 3 — Start the development server

```bash
pnpm dev
```

The app starts at **http://localhost:3000** using Turbopack for fast hot-module replacement.

### Step 4 — (Optional) Verify everything works

```bash
pnpm lint          # ESLint — should exit with no errors
pnpm test          # Vitest unit tests — should all pass
pnpm e2e:headless  # Playwright E2E — requires the dev server to be running
```

---

### All commands at a glance

```bash
# 1. Clone
git clone https://github.com/Blazity/next-enterprise.git
cd next-enterprise

# 2. Install all dependencies (patch-package runs automatically)
pnpm install

# 3. Start dev server → http://localhost:3000
pnpm dev

# 4. Run unit tests
pnpm test

# 5. Start Storybook → http://localhost:6006
pnpm storybook

# 6. Run E2E tests (headless)
pnpm e2e:headless
```

---

## 3. Directory Structure

```
next-enterprise/
├── app/
│   ├── layout.tsx              # Root HTML shell; imports styles/tailwind.css
│   ├── page.tsx                # Home/landing page (server component)
│   └── api/
│       └── health/
│           └── route.ts        # Health check handler → GET /api/health
├── components/
│   ├── Button/
│   │   ├── Button.tsx          # CVA-based anchor-as-button component
│   │   ├── Button.test.tsx     # Vitest + RTL unit tests
│   │   └── Button.stories.tsx  # Storybook story
│   └── Tooltip/
│       └── Tooltip.tsx         # Radix UI tooltip wrapper (client component)
├── e2e/
│   └── example.spec.ts         # Playwright smoke test
├── styles/
│   └── tailwind.css            # Tailwind v4 entry point + compatibility layer
├── assets/                     # Static SVG logos
├── .github/
│   ├── nodejs.version          # Pinned Node.js version for CI
│   └── workflows/
│       ├── check.yml           # Lint + format + unit + Storybook tests
│       ├── playwright.yml      # E2E browser tests
│       └── nextjs_bundle_analysis.yml  # Bundle size tracking on PRs
├── .storybook/
│   ├── main.ts                 # Storybook config (Next.js framework, addons)
│   └── preview.ts              # Global decorators; imports tailwind.css
├── env.mjs                     # T3 Env: Zod-validated environment variables
├── lp-items.tsx                # Static data for landing page feature grid
├── instrumentation.ts          # OpenTelemetry registration via @vercel/otel
├── next.config.ts              # Next.js config; health check rewrites; bundle analyzer
├── tsconfig.json               # Strict TS, noUncheckedIndexedAccess, baseUrl "."
├── vitest.config.ts            # Vitest config (jsdom, globals, tsconfigPaths)
├── vitest.setup.ts             # Imports @testing-library/jest-dom matchers
├── playwright.config.ts        # Playwright config (3 browsers, baseURL 3000)
├── eslint.config.mjs           # ESLint 9 flat config
├── prettier.config.js          # Prettier (120 char width, no semi, tailwind plugin)
└── postcss.config.js           # PostCSS plugins (postcss-import, tailwindcss)
```

**Absolute imports:** `tsconfig.json` sets `"baseUrl": "."`, so all imports are absolute from the project root. There are no `../../` relative imports.

---

## 4. Component API

### Button

**Source:** [components/Button/Button.tsx](components/Button/Button.tsx)

Renders an `<a>` (anchor) tag styled as a button. Use this for navigation links, not form submissions.

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | required | URL the anchor navigates to |
| `intent` | `"primary" \| "secondary"` | `"primary"` | `primary` = filled blue; `secondary` = outlined with blue border |
| `size` | `"sm" \| "lg"` | `"lg"` | `sm` = min-h-10; `lg` = min-h-12 |
| `underline` | `boolean` | `false` | Underlines the label text |
| `className` | `string` | — | Additional classes merged via tailwind-merge |
| `...rest` | `React.ButtonHTMLAttributes<HTMLAnchorElement>` | — | All standard anchor attributes (`target`, `rel`, etc.) |

**Examples:**

```tsx
// Primary (default)
<Button href="/dashboard">Go to Dashboard</Button>

// Secondary, small, opens in new tab
<Button href="https://example.com" intent="secondary" size="sm" target="_blank" rel="noopener noreferrer">
  External Link
</Button>

// With underline
<Button href="/terms" underline>Terms of Service</Button>
```

---

### Tooltip

**Source:** [components/Tooltip/Tooltip.tsx](components/Tooltip/Tooltip.tsx)

`"use client"` — must be used in a client component tree. Built on `@radix-ui/react-tooltip` with a 200ms open delay.

| Prop | Type | Default | Description |
|---|---|---|---|
| `explainer` | `React.ReactElement \| string` | required | Content rendered inside the tooltip popup |
| `children` | `React.ReactElement` | required | Element that triggers the tooltip on hover |
| `intent` | `"primary"` | `"primary"` | Visual style (zinc-700 background, white text) |
| `size` | `"md"` | `"md"` | Size of the tooltip panel |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Which side of the trigger the tooltip appears on |
| `withArrow` | `boolean` | `false` | Renders a directional arrow pointing to the trigger |
| `className` | `string` | — | Additional classes for the tooltip content panel |
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | — | Uncontrolled initial open state |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when open state changes |

**Examples:**

```tsx
// Basic usage
<Tooltip explainer="This is a tooltip">
  <button>Hover me</button>
</Tooltip>

// With arrow, positioned to the right
<Tooltip explainer="More info" side="right" withArrow>
  <span>ℹ</span>
</Tooltip>

// Controlled
<Tooltip explainer="Controlled tooltip" open={isOpen} onOpenChange={setIsOpen}>
  <button>Click</button>
</Tooltip>
```

---

### Adding a New Component

Each component lives in its own directory with three co-located files:

```
components/
└── MyComponent/
    ├── MyComponent.tsx         # Component implementation
    ├── MyComponent.test.tsx    # Vitest + RTL unit tests
    └── MyComponent.stories.tsx # Storybook story
```

Use CVA + tailwind-merge for variants (follow the Button pattern). Import using absolute paths:

```tsx
import { MyComponent } from "components/MyComponent/MyComponent"
```

---

## 5. Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Dev server with Turbopack on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Start production server (run after `build`) |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint auto-fix |
| `pnpm prettier` | Check Prettier formatting (`*.js,jsx,ts,tsx`) |
| `pnpm prettier:fix` | Auto-format JS/TS files |
| `pnpm format` | Auto-format TS, TSX, and MD files |
| `pnpm analyze` | Build with bundle analyzer UI (`ANALYZE=true`) |
| `pnpm test` | Run Vitest unit tests once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:ui` | Vitest browser dashboard |
| `pnpm test:coverage` | Unit test coverage report |
| `pnpm storybook` | Storybook dev server on port 6006 |
| `pnpm build-storybook` | Static Storybook build |
| `pnpm test-storybook` | Run Storybook interaction tests |
| `pnpm e2e:headless` | Playwright E2E tests (headless, all browsers) |
| `pnpm e2e:ui` | Playwright E2E with interactive UI |
| `pnpm coupling-graph` | Generate component dependency graph as `graph.svg` |

---

## 6. Environment Variables

Environment variables are validated at build time using [T3 Env](https://env.t3.gg/) with Zod. Missing required variables cause a startup error, not a runtime error.

**Source:** [env.mjs](env.mjs)

| Variable | Scope | Type | Required | Description |
|---|---|---|---|---|
| `ANALYZE` | Server | `"true" \| "false"` | No | Enables the Next.js bundle analyzer during `next build`. Use `pnpm analyze` instead of setting this directly. |

**Adding a new variable:**

1. Add the Zod schema to the `server` or `client` block in `env.mjs`
2. Add the key to the `runtimeEnv` mapping
3. Client-side variables must be prefixed `NEXT_PUBLIC_`

```ts
// env.mjs
export const env = createEnv({
  server: {
    MY_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    MY_SECRET: process.env.MY_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
})
```

Local overrides go in `.env.local` (not committed).

---

## 7. API Routes

### Health Check

**Handler:** [app/api/health/route.ts](app/api/health/route.ts)
**Method:** GET
**Response:** `{ "status": "ok" }` (200)

Available at five paths via rewrites in [next.config.ts](next.config.ts):

| Path | Notes |
|---|---|
| `/api/health` | Canonical handler |
| `/healthz` | Rewritten to `/api/health` |
| `/api/healthz` | Rewritten to `/api/health` |
| `/health` | Rewritten to `/api/health` |
| `/ping` | Rewritten to `/api/health` |

```bash
curl http://localhost:3000/healthz
# {"status":"ok"}
```

The root-level aliases (`/healthz`, `/health`, `/ping`) exist to support Kubernetes liveness and readiness probes.

---

## 8. Testing

### Unit Tests (Vitest + React Testing Library)

**Config:** [vitest.config.ts](vitest.config.ts)
- Environment: `jsdom`
- Setup file: `vitest.setup.ts` (adds `@testing-library/jest-dom` matchers)
- Test globals enabled (no need to import `describe`, `it`, `expect`)
- Patterns: `**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`
- Excluded: `node_modules`, `dist`, `e2e/`, `.next/`

```bash
pnpm test           # single run
pnpm test:watch     # watch mode
pnpm test:coverage  # with coverage report
```

Example test following the Button pattern:

```tsx
import { render, screen } from "@testing-library/react"
import { Button } from "./Button"

describe("Button", () => {
  it("renders children", () => {
    render(<Button href="/test">Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("applies secondary intent classes", () => {
    render(<Button href="/test" intent="secondary">Secondary</Button>)
    expect(screen.getByText("Secondary")).toHaveClass("bg-transparent")
  })
})
```

---

### Component Stories (Storybook)

**Config:** [.storybook/main.ts](.storybook/main.ts)
- Framework: `@storybook/nextjs`
- Discovers stories from: `components/**/*.stories.{ts,tsx,mdx}`
- Port: 6006

```bash
pnpm storybook          # dev server → http://localhost:6006
pnpm build-storybook    # static build to storybook-static/
pnpm test-storybook     # run interaction tests (requires running Storybook)
```

Story file template:

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { MyComponent } from "./MyComponent"

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  args: {
    // default prop values
  },
}

export const Default: StoryObj<typeof MyComponent> = {
  render: (args) => <MyComponent {...args} />,
}

export default meta
```

---

### E2E Tests (Playwright)

**Config:** [playwright.config.ts](playwright.config.ts)
- Test directory: `e2e/`
- Browsers: Chromium, Firefox, WebKit
- Base URL: `http://127.0.0.1:3000`
- Dev server starts automatically via `pnpm dev` before tests run
- CI settings: retries = 2, workers = 1, `forbidOnly` enabled

```bash
pnpm e2e:headless    # all browsers, no UI
pnpm e2e:ui          # interactive Playwright UI
```

Example from [e2e/example.spec.ts](e2e/example.spec.ts):

```ts
import { expect, test } from "@playwright/test"

test("has title", async ({ page }) => {
  await page.goto("./")
  await expect(page).toHaveTitle(/Next.js Enterprise Boilerplate/)
})
```

Place new E2E tests in `e2e/feature-name.spec.ts`.

---

### CI Workflow

| Workflow | Trigger | Steps |
|---|---|---|
| `check.yml` | Push to main/master/develop; all PRs | Lint → Prettier check → Unit tests → Storybook smoke tests |
| `playwright.yml` | Push to main/master/develop; all PRs | E2E tests across Chromium, Firefox, WebKit |
| `nextjs_bundle_analysis.yml` | PRs | Tracks bundle size changes and comments on the PR |

---

## 9. Code Quality

### TypeScript

**Config:** [tsconfig.json](tsconfig.json)

Key settings:
- `"strict": true` — all strict checks enabled
- `"noUncheckedIndexedAccess": true` — array/object index access returns `T | undefined`, forcing null checks
- `"baseUrl": "."` — enables absolute imports from the project root

```ts
// Correct — absolute import
import { Button } from "components/Button/Button"

// Avoid — relative imports that traverse directories
import { Button } from "../../components/Button/Button"
```

The `noUncheckedIndexedAccess` flag affects all array and record lookups:

```ts
const items = ["a", "b", "c"]
const first = items[0]       // type: string | undefined
const safe = items[0] ?? ""  // type: string
```

---

### ESLint

**Config:** [eslint.config.mjs](eslint.config.mjs)

Active plugins:
- `typescript-eslint` (recommended rules)
- `eslint-plugin-import` — enforces import grouping and alphabetical order
- `@next/eslint-plugin-next` — Core Web Vitals rules
- `eslint-plugin-storybook` — Storybook-specific rules

Import group order enforced by `import/order`:
1. External packages
2. Built-in Node modules
3. Internal (project) modules
4. Sibling / parent / index

---

### Prettier

**Config:** [prettier.config.js](prettier.config.js)

| Setting | Value |
|---|---|
| `printWidth` | 120 |
| `tabWidth` | 2 |
| `semi` | `false` |
| `trailingComma` | `"es5"` |
| Plugin | `prettier-plugin-tailwindcss` (auto-sorts Tailwind class names) |

---

## 10. Git Hooks (Husky + lint-staged)

Husky runs `lint-staged` automatically on every `git commit`. Staged files are linted and formatted before the commit is created — if ESLint finds unfixable errors, the commit is aborted.

### What runs on commit

**Config:** `lint-staged` block in [package.json](package.json)

| File pattern | Commands |
|---|---|
| `*.{js,jsx,ts,tsx}` | `eslint --fix` then `prettier --write` |
| `*.{json,md,css}` | `prettier --write` |

Only **staged files** are processed — unchanged files are never touched.

### Hook location

**File:** [.husky/pre-commit](.husky/pre-commit)

```sh
npx lint-staged
```

### How it was set up

```bash
pnpm add -D husky lint-staged   # install packages
pnpm exec husky init            # creates .husky/ and adds "prepare": "husky" to package.json
# then edit .husky/pre-commit to run lint-staged
```

The `"prepare": "husky"` script in `package.json` ensures Husky hooks are installed automatically after every `pnpm install`.

### Bypassing the hook (use sparingly)

```bash
git commit --no-verify -m "chore: emergency fix"
```

> Only use `--no-verify` for genuine emergencies. All checks still run in CI and will block merging.

---

## 11. Contributing

### Commit Message Format

The project uses [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) with [Conventional Commits](https://www.conventionalcommits.org/). Commit message types determine automated version bumps and changelog entries.

```
<type>(<optional scope>): <subject>
```

| Type | Version bump | Use for |
|---|---|---|
| `feat` | Minor | New features |
| `fix` | Patch | Bug fixes |
| `docs` | None | Documentation only |
| `chore` | None | Maintenance, dependency updates |
| `refactor` | None | Code restructuring without behavior change |
| `test` | None | Adding or updating tests |
| `BREAKING CHANGE` (footer) | Major | Breaking API changes |

Examples:

```
feat(button): add disabled prop
fix(tooltip): correct arrow position on bottom side
docs: update component API reference
chore: upgrade radix-ui packages
```

---

### Pre-PR Checklist

Run these locally before opening a pull request. The same checks run in CI and will block merging if they fail.

```bash
pnpm lint           # ESLint — must pass
pnpm prettier       # Prettier format check — must pass
pnpm test           # Unit tests — must pass
pnpm e2e:headless   # E2E tests — should pass
```

---

## 11. Observability

**Source:** [instrumentation.ts](instrumentation.ts)

The app uses OpenTelemetry via `@vercel/otel`. Next.js calls the exported `register()` function automatically via the [instrumentation hook](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation).

```ts
import { registerOTel } from "@vercel/otel"

export function register() {
  registerOTel("next-app")
}
```

- On **Vercel**: traces are sent to Vercel Observability automatically — no configuration needed.
- On **custom collectors**: set the standard `OTEL_EXPORTER_OTLP_ENDPOINT` environment variable. Add it to `env.mjs` for build-time validation.
