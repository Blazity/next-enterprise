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
| Package manager | npm (bundled with Node.js) |

---

## 2. Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version | Install |
|---|---|---|
| Node.js | >= 20.0.0 | [nodejs.org](https://nodejs.org) or via `nvm` |
| Git | any | [git-scm.com](https://git-scm.com) |

> **Using nvm?** Run `nvm install 20 && nvm use 20` to switch to a compatible Node version. npm is bundled with Node — no separate install needed.

> **Note on `--legacy-peer-deps`:** `@radix-ui/react-form@0.0.3` declares peer support for React 16/17/18 only, but this project uses React 19. npm is strict about this mismatch, so `--legacy-peer-deps` is required on every `npm install`. This is safe — the package works correctly with React 19.

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/Blazity/next-enterprise.git
cd next-enterprise
```

### Step 2 — Install dependencies

```bash
npm install --legacy-peer-deps
```

`--legacy-peer-deps` is required due to a peer dependency mismatch between `@radix-ui/react-form@0.0.3` and React 19. This also automatically runs `patch-package` via the `postinstall` hook — you will see output like `applying patch …` in the terminal. This is expected.

### Step 3 — Start the development server

```bash
npm run dev
```

The app starts at **http://localhost:3000** using Turbopack for fast hot-module replacement.

### Step 4 — (Optional) Verify everything works

```bash
npm run lint          # ESLint — should exit with no errors
npm test              # Vitest unit tests — should all pass
npm run e2e:headless  # Playwright E2E — requires the dev server to be running
```

---

### All commands at a glance

```bash
# 1. Clone
git clone https://github.com/Blazity/next-enterprise.git
cd next-enterprise

# 2. Install all dependencies
npm install --legacy-peer-deps

# 3. Start dev server → http://localhost:3000
npm run dev

# 4. Run unit tests
npm test

# 5. Start Storybook → http://localhost:6006
npm run storybook

# 6. Run E2E tests (headless)
npm run e2e:headless
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

```tsx
import { MyComponent } from "components/MyComponent/MyComponent"
```

---

## 5. Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server with Turbopack on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server (run after `build`) |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run prettier` | Check Prettier formatting (`*.js,jsx,ts,tsx`) |
| `npm run prettier:fix` | Auto-format JS/TS files |
| `npm run format` | Auto-format TS, TSX, and MD files |
| `npm run analyze` | Build with bundle analyzer UI (`ANALYZE=true`) |
| `npm test` | Run Vitest unit tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:ui` | Vitest browser dashboard |
| `npm run test:coverage` | Unit test coverage report |
| `npm run storybook` | Storybook dev server on port 6006 |
| `npm run build-storybook` | Static Storybook build |
| `npm run test-storybook` | Run Storybook interaction tests |
| `npm run e2e:headless` | Playwright E2E tests (headless, all browsers) |
| `npm run e2e:ui` | Playwright E2E with interactive UI |
| `npm run coupling-graph` | Generate component dependency graph as `graph.svg` |

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
npm test                   # single run
npm run test:watch         # watch mode
npm run test:coverage      # with coverage report
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

### E2E Tests (Playwright)

**Config:** [playwright.config.ts](playwright.config.ts)
- Test directory: `e2e/`
- Browsers: Chromium, Firefox, WebKit
- Base URL: `http://127.0.0.1:3000`
- Dev server starts automatically via `npm run dev` before tests run
- CI settings: retries = 2, workers = 1, `forbidOnly` enabled

```bash
npm run e2e:headless    # all browsers, no UI
npm run e2e:ui          # interactive Playwright UI
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


## 10. Contributing

### Commit Message Format

| Type | Version bump | Use for |
|---|---|---|
| `feat` | Minor | New features |
| `fix` | Patch | Bug fixes |
| `docs` | None | Documentation only |
| `chore` | None | Maintenance, dependency updates |
| `refactor` | None | Code restructuring without behavior change |
| `test` | None | Adding or updating tests |
| `BREAKING CHANGE` (footer) | Major | Breaking API changes |

---