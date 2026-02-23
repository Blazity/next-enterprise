# ADR 001 — Base UI Setup & Docs


## What Changed

### 1. CVE Remediation — Next.js / React Server Components
**Commit:** `c16deae`

- Updated `next` to `15.3.3` (patched) and pinned `react-server-dom-webpack`, `react-server-dom-parcel`, and `react-server-dom-turbopack` to their respective fixed versions.
- `pnpm-lock.yaml` regenerated to lock the resolved tree.

**CVEs addressed:** React Server Components arbitrary code execution vulnerabilities reported in the official React advisory (Dec 2025).

---

### 2. Package Manager Migration — npm → pnpm
**Commit:** `78640d5`

- Added `"packageManager": "pnpm@10.0.0"` to `package.json`, which causes `npm install` to hard-fail, enforcing a single package manager across all environments.
- Switched `playwright.config.ts` `webServer.command` from `npm run dev` to `pnpm dev`.
- Removed stale `package-lock.json`; `pnpm-lock.yaml` is now the single source of truth.
- Updated `DOCS.md` with prerequisite instructions, warning about npm peer-dep failures, and a full command reference.

**Why pnpm:** The project already had a `@radix-ui/react-form` peer-dependency conflict that `npm`'s strict resolver rejects. `pnpm` resolves it correctly via its virtual store. Consistent tooling also eliminates CI/local discrepancies caused by different lockfile formats.

---

### 3. Developer Tooling — Husky + lint-staged + ESLint + Prettier
**Commit:** `9e0e67c`

- Installed `husky` and `lint-staged` as dev dependencies.
- Ran `pnpm exec husky init` to create `.husky/pre-commit` and add `"prepare": "husky"` to `package.json` (hooks auto-install after every `pnpm install`).
- Configured `lint-staged` in `package.json`:
  - `*.{js,jsx,ts,tsx}` → `eslint --fix` then `prettier --write`
  - `*.{json,md,css}` → `prettier --write`
- Extended `DOCS.md` with hook documentation (what runs, bypass procedure, setup steps).

**Why:** Without pre-commit enforcement, linting and formatting checks exist only in CI, meaning broken code can be committed locally and only caught after a push. Shifting these checks left to commit-time provides faster feedback and keeps commit history clean.

---

### 4. Landing Page Cleanup
**Commit:** `c6e242b`

- Stripped the boilerplate hero section, feature grid, and promotional links from `app/page.tsx`.
- Retained only an `<h1>` placeholder (`iTunes`) and the base section/container layout as a neutral starting point.
- Minor metadata cleanup in `app/layout.tsx`.

**Why:** The boilerplate default page contains content unrelated to this project. Clearing it to a minimal shell prevents confusion and gives a clean canvas for the actual product UI.

---

## What AI Helped With

| Area | AI Contribution |
|---|---|
| **DOCS.md authoring** | Drafted the full developer documentation covering setup, directory structure, component API, scripts, environment variables, testing, CI workflows, and git hooks. |
| **ADR structure** | Assisted in identifying the right scope and framing for this document. |
| **CVE context** | Explained the React Server Components vulnerability surface and confirmed which package versions are safe. |
| **pnpm migration rationale** | Helped articulate the peer-dependency conflict root cause and why pnpm resolves it while npm fails. |

AI did **not** select dependency versions autonomously — all version pins were taken from the official advisory and verified manually. AI did **not** write production component code or tests.

---

## What Was Manually Validated

| Check | Method | Result |
|---|---|---|
| App boots | `pnpm dev` → visited `http://localhost:3000` | Page loads with `iTunes` heading, no console errors |
| `npm install` blocked | Ran `npm install` from a clean shell | Hard-fails with `packageManager` enforcement error |
| Pre-commit hook fires | Staged a file with a lint error, ran `git commit` | Hook ran `eslint --fix` + `prettier --write`, aborted on unfixable error |
| Unit tests pass | `pnpm test` | All Vitest tests pass |
| Lint clean | `pnpm lint` | No ESLint errors or warnings |
| Prettier clean | `pnpm prettier` | No formatting violations |
| CVE packages resolved | `pnpm list next react-server-dom-webpack` | Confirmed patched versions in resolved tree |

> **Audit screenshots:** See `/docs/adr/screenshots/` (attach locally — `pnpm dev` output, `pnpm test` output, hook firing on bad commit, `pnpm list` showing patched versions).

---

## Notes on AI Usage

- Claude Code (claude-sonnet-4-6) was used as the primary authoring assistant for `DOCS.md` and this ADR.
- All AI-generated content was reviewed line-by-line before committing. No AI output was committed without human review.
- Dependency versions were cross-referenced against the official React advisory and the npm registry — not taken from AI suggestions alone.
- The AI did not have access to run arbitrary shell commands outside of what was explicitly reviewed and approved.

**Risk of AI-assisted changes:** Low. Changes are limited to documentation, tooling configuration, and dependency version pins. No application logic was altered by AI.

---

