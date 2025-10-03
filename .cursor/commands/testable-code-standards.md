# Multi-Page Testable Code Standards Structure

---

## 📁 Folder Structure: docs/testing_standards/

```
docs/testing_standards/
├── 00-INDEX.md                    # Overview and navigation
├── 01-CORE_PRINCIPLES.md          # Separation of concerns, DI, pure functions
├── 02-SVELTEKIT_PATTERNS.md       # +page.server.ts, +server.ts, form actions
├── 03-SVELTE_COMPONENTS.md        # Component organization, Svelte 5 runes
├── 04-DATABASE_PATTERNS.md        # Drizzle queries, PGLite, transactions
├── 05-VALIDATION_API_CLIENTS.md   # Valibot schemas, API client patterns
├── 06-ASYNC_STATE_ERRORS.md       # Async/await, state management, error handling
├── 07-FILE_EXTERNAL_SERVICES.md   # File ops, AI, payments, external services
├── 08-TESTABILITY_SMELLS.md       # Anti-patterns, code smells to avoid
└── 09-REFACTORING_CHECKLIST.md    # How to refactor untestable code
```

---

## PROMPT: Generate Index

```
Create docs/testing_standards/00-INDEX.md:

# Testable Code Standards - Index

## Purpose
This documentation defines how to write predictable, maintainable, and testable code for our SvelteKit 5 application. Every standard is grounded in:
- Analysis reports: docs/testing/01-10
- Library documentation: docs/llms/, docs/playwright/
- Actual codebase patterns and issues
- Current testing infrastructure

## Why This Matters
From analysis reports, document:
- From 01-test-quality-audit.md: How many tests were low quality due to untestable code? Quote statistics.
- From 09-business-logic-testing-needs.md: What percentage of business logic is hard to test? Quote findings.
- Cost of untestable code: Time to write tests, flaky tests, bugs in production

## Document Structure

### [01. Core Principles](./01-CORE_PRINCIPLES.md)
**Topics**: Separation of concerns, dependency injection, pure functions, explicit over implicit
**Ground in**: 09-business-logic-testing-needs.md, 02-architecture-module-map.md, 01-test-quality-audit.md
**Key patterns from**: src/lib/utils/, src/lib/features/, src/lib/services/

### [02. SvelteKit Patterns](./02-SVELTEKIT_PATTERNS.md)
**Topics**: +page.server.ts, +server.ts, form actions, load functions, API routes
**Ground in**: 05-api-routes-catalog.md, src/routes/api/, src/tests/routes/
**References**: docs/llms/svelte/kit-docs.txt, sveltekit-superforms (^2.27.1)

### [03. Svelte Components](./03-SVELTE_COMPONENTS.md)
**Topics**: Component organization, Svelte 5 runes, extracting business logic, props, events
**Ground in**: 07-component-testing-surface.md, actual components with tests
**References**: docs/llms/svelte/llms-full.txt (Svelte 5 documentation)
**Examples from**: CareerCard.svelte, LocationCard.svelte, UserProfileCard.svelte

### [04. Database Patterns](./04-DATABASE_PATTERNS.md)
**Topics**: Drizzle ORM queries, connection injection, transactions, PGLite testing
**Ground in**: 04-database-layer-inventory.md, src/lib/db/queries/, tests/test-db/client.ts
**References**: docs/llms/drizzle-llms-full.txt, drizzle-orm (^0.44.5), @electric-sql/pglite (^0.3.8)

### [05. Validation & API Clients](./05-VALIDATION_API_CLIENTS.md)
**Topics**: Valibot schemas, type inference, API client organization, error handling
**Ground in**: 06-validation-schema-coverage.md, src/lib/schemas/, src/lib/remote/
**References**: docs/llms/valibot-llms.txt, valibot (^1.1.0), drizzle-valibot (^0.4.2)

### [06. Async, State & Error Handling](./06-ASYNC_STATE_ERRORS.md)
**Topics**: Async/await patterns, state management, error handling, Result types
**Ground in**: 01-test-quality-audit.md (async test issues), 07-component-testing-surface.md (state patterns)
**References**: docs/llms/svelte/svelte-store.md, docs/llms/svelte/Context.md

### [07. Files & External Services](./07-FILE_EXTERNAL_SERVICES.md)
**Topics**: File operations, AI integration, payments, Supabase, service abstraction
**Ground in**: 09-business-logic-testing-needs.md, src/lib/ai/, src/lib/storage/
**References**: @ai-sdk/anthropic (^2.0.18), stripe (^13.3.0), @supabase/* packages

### [08. Testability Smells](./08-TESTABILITY_SMELLS.md)
**Topics**: Anti-patterns, code smells, what makes code hard to test, real examples from codebase
**Ground in**: 01-test-quality-audit.md, 09-business-logic-testing-needs.md
**Examples**: Actual problematic patterns found in audit

### [09. Refactoring Checklist](./09-REFACTORING_CHECKLIST.md)
**Topics**: How to identify untestable code, step-by-step refactoring, before/after examples
**Ground in**: All analysis reports, prioritized by 09-business-logic-testing-needs.md
**Actionable**: Specific files from codebase that need refactoring

## How to Use This Guide

### For New Code
1. Read relevant sections before writing code
2. Follow patterns from "good examples"
3. Avoid patterns from "testability smells"
4. Reference actual codebase examples

### For Existing Code
1. Start with 08-TESTABILITY_SMELLS.md - identify issues
2. Use 09-REFACTORING_CHECKLIST.md - plan refactoring
3. Follow relevant pattern guides for refactoring
4. Improve test coverage as you refactor

### For Code Review
1. Check against standards in relevant sections
2. Flag anti-patterns from 08-TESTABILITY_SMELLS.md
3. Suggest patterns from relevant guides
4. Ensure new code is testable before merge

## Grounding Requirements
Every standard in these documents must be:
- **Evidence-based**: From analysis reports or actual codebase
- **Referenced**: Cite specific files, line numbers, or documents
- **Verifiable**: Can be confirmed by checking sources
- **No speculation**: Only documented patterns or findings

## Related Documentation
- Testing standards: docs/testing/TESTING_STANDARDS.md
- Testing procedures: docs/testing/TESTING_PROCEDURES.md (when created)
- Test templates: docs/testing/TEST_TEMPLATES.md (when created)
- Analysis reports: docs/testing/00-testing-analysis-summary.md

## Maintenance
- Review quarterly
- Update when new patterns emerge
- Add examples from code reviews
- Remove outdated patterns
- Re-run analysis to validate

**Created**: [Date]
**Last Updated**: [Date]
**Next Review**: [Date + 3 months]

Save to: docs/testing_standards/00-INDEX.md
```

---

## PROMPT: Generate Core Principles

```
Create docs/testing_standards/01-CORE_PRINCIPLES.md:

# Core Principles for Testable Code

**Navigation**: [← Index](./00-INDEX.md) | [Next: SvelteKit Patterns →](./02-SVELTEKIT_PATTERNS.md)

## Overview
Ground this entire document in:
- 09-business-logic-testing-needs.md (what logic is hard to test and why)
- 02-architecture-module-map.md (current code organization)
- 01-test-quality-audit.md (test quality correlation with code structure)
- Actual codebase files (src/lib/utils/, src/lib/features/, src/lib/services/)

---

## Principle 1: Separation of Concerns

### Why It Matters
**Extract from sources**:
- From 09-business-logic-testing-needs.md: Find specific examples where business logic is mixed with UI, database, or API code
- Quote: [Specific finding about mixed concerns making testing difficult]
- From 01-test-quality-audit.md: Did mixed concerns correlate with lower test quality scores? Quote statistics if available.
- List specific files from audit that have poor separation

### Current State Analysis
**Examine codebase structure**:
- From 02-architecture-module-map.md: Document how code is currently organized
- src/lib/utils/ - what's in here? Are they pure utilities or mixed?
- src/lib/features/ - how are features organized? Good or bad separation?
- src/lib/services/ - service layer patterns?
- src/lib/remote/ - API client separation?
- src/lib/db/queries/ - database operation separation?

### Standards

#### Where Business Logic Should Live
**Ground in actual structure**:
- Pure business logic → [cite actual directory from 02-architecture-module-map.md]
- Examples of well-separated logic: [list 3-5 actual files from src/lib/utils/ or src/lib/features/]
- Examples of poorly-separated logic: [list from 09-business-logic-testing-needs.md if found]

#### Where API Calls Should Live
**Ground in actual structure**:
- API clients → [verify src/lib/remote/ pattern exists and document it]
- List actual *.remote.ts files: [from 02-architecture-module-map.md]
- Good examples: [cite specific remote client files]
- Issues found: [from 09-business-logic-testing-needs





——————————————


```

Based on analysis reports (docs/testing/01-10), library documentation (docs/llms/, docs/playwright/), actual codebase patterns, and configuration files, create docs/testing/TESTABLE_CODE_STANDARDS.md:

# Testable Code Standards for SvelteKit 5 Application

## Purpose

Define how to write code that is predictable, maintainable, and easy to test. Every standard must be grounded in:

- Issues found in analysis reports that made code hard to test
- SvelteKit 5 and Svelte 5 best practices from docs/llms/svelte/
- Current codebase patterns from docs/testing/02-architecture-module-map.md
- Testing infrastructure from docs/testing/03-vitest-configuration-analysis.md
- Actual code examples from the codebase (good and bad)

---

## Section 1: Core Principles

### Separation of Concerns

**Ground in sources:**

- From 09-business-logic-testing-needs.md: Extract examples where business logic is mixed with UI or database code - what made these hard to test?
- From 02-architecture-module-map.md: Identify modules with good separation (src/lib/features/, src/lib/services/, src/lib/utils/) vs poor separation
- From 07-component-testing-surface.md: Which components have too much logic vs which are thin UI layers?
- From 01-test-quality-audit.md: Did test quality correlate with separation of concerns?

**Define standards:**

- Where should business logic live? (cite actual directories from codebase)
- Where should API calls live? (cite src/lib/remote/ pattern)
- Where should database operations live? (cite src/lib/db/queries/ pattern)
- Where should validation live? (cite src/lib/schemas/ pattern)
- Where should UI logic live? (cite .svelte component patterns)

**Provide file organization pattern:**

- Extract pattern from best-structured feature in codebase (from 02-architecture-module-map.md)
- Show how files are organized for testability
- Reference actual good examples: [cite specific modules like src/lib/features/specs/ or src/lib/services/]
- Reference actual bad examples: [cite from audit if modules mix concerns]

### Dependency Injection

**Ground in sources:**

- From 09-business-logic-testing-needs.md: Where are dependencies hard-coded? List specific files.
- From 01-test-quality-audit.md: Did hard-coded dependencies make tests harder to write?
- From src/lib/services/, src/lib/features/: Examine how dependencies are currently handled

**Define standards:**

- Functions: How should dependencies be passed? (analyze patterns in src/lib/utils/)
- Classes: How should dependencies be injected? (analyze patterns in src/lib/services/)
- SvelteKit context: How to access dependencies properly? (reference docs/llms/svelte/kit-docs.txt)
- Reference actual examples from codebase of good dependency injection
- Reference actual examples from codebase of hard-coded dependencies that need refactoring

### Pure Functions First

**Ground in sources:**

- From src/lib/utils/: List which functions are pure (deterministic, no side effects)
- From 09-business-logic-testing-needs.md: Which utils have side effects that make testing hard?
- From 01-test-quality-audit.md: Are pure functions easier to test? What's the correlation?
- From src/lib/utils/password.ts, template-processor.ts: Are these pure or impure?

**Define standards:**

- Characteristics of pure functions
- Where pure functions should live in codebase structure
- Where impure functions should live
- How to achieve high test coverage on pure functions
- Reference actual pure functions from utils/
- Reference actual impure functions that need refactoring or are necessarily impure

### Explicit Over Implicit

**Ground in sources:**

- From 09-business-logic-testing-needs.md: Find functions with implicit dependencies (global state, hidden parameters)
- From codebase: Search for getSession(), getDb(), getContext() calls without parameters
- From 01-test-quality-audit.md: Did implicit behavior make tests harder to write?

**Define standards:**

- Always explicit parameters (show pattern from well-tested functions)
- Always explicit return types (check if tsconfig.json enforces this)
- Always explicit error handling (reference actual error handling patterns in codebase)

---

## Section 2: SvelteKit 5 Specific Patterns

### Server-Side Code (+page.server.ts, +server.ts)

**Ground in sources:**

- From 05-api-routes-catalog.md: Which API routes are well-structured for testing?
- From src/routes/api/: Examine actual +server.ts files - what patterns exist?
- From src/tests/routes/: What patterns make routes testable?
- Reference docs/llms/svelte/kit-docs.txt for official SvelteKit patterns

**Define standards for:**

- **+page.server.ts load functions**: Extract pattern from actual well-tested load functions in codebase
- **+server.ts API routes**: Extract pattern from actual API routes, how is business logic separated?
- **Form actions**: Reference sveltekit-superforms (^2.27.1 from package.json), extract patterns from actual form actions
- How to structure for testability (separate handlers from route definitions)

**Reference actual files:**

- Good examples: [cite specific +page.server.ts or +server.ts that are well-structured]
- Bad examples: [cite from audit if routes have too much inline logic]

### Svelte 5 Components

**Ground in sources:**

- From 07-component-testing-surface.md: Which components are testable? (CareerCard.svelte, LocationCard.svelte, UserProfileCard.svelte have tests)
- Examine these actual component files - what makes them testable?
- From components without tests: What makes them hard to test?
- Reference docs/llms/svelte/llms-full.txt for Svelte 5 runes documentation

**Define standards for:**

- **Component organization**: What order should script content be in? (examine actual components)
- **Svelte 5 runes usage**: $state, $derived, $effect, $props - extract patterns from actual components
- **Business logic extraction**: Where should complex logic go instead of components? (reference actual patterns)
- **Component props**: How to type properly? (examine actual typed components)

**Reference actual components:**

- Good structure: [cite src/lib/components/context/CareerCard.svelte and explain what makes it testable]
- Complex components: [cite components that need refactoring from 07-component-testing-surface.md]

### Database Patterns

**Ground in sources:**

- From 04-database-layer-inventory.md: Which query patterns are testable?
- From src/lib/db/queries/: Examine actual query files (select.ts, insert.ts, update.ts, documents.ts)
- From existing tests: How are queries tested? (examine getCompleteProfile.consolidated.test.ts, update.test.ts)
- Reference docs/llms/drizzle-llms-full.txt for Drizzle ORM patterns

**Define standards for:**

- **Query functions**: How to structure for testability? (examine actual patterns in queries/)
- **Database connection injection**: How is db passed around? (examine actual code)
- **Transaction patterns**: How are multi-step operations handled? (find examples in codebase)
- **PGLite testing**: How are queries tested? (reference tests/test-db/client.ts and actual integration tests)

**Reference:**

- Package: drizzle-orm (^0.44.5 from package.json)
- Test database: @electric-sql/pglite (^0.3.8 from package.json)

### Validation Patterns

**Ground in sources:**

- From 06-validation-schema-coverage.md: Which schemas are well-structured?
- From src/lib/schemas/: Examine actual Valibot schemas (forms/, database.ts, etc.)
- From package.json: valibot (^1.1.0), @ai-sdk/valibot, drizzle-valibot
- Reference docs/llms/valibot-llms.txt for Valibot patterns

**Define standards for:**

- **Schema organization**: How are schemas structured? (examine actual schema files)
- **Type inference**: How to derive TypeScript types from schemas? (find InferOutput usage)
- **Validation functions**: Separate validation logic from usage? (find patterns in codebase)
- **Drizzle-Valibot integration**: How to share schemas? (check if used in codebase)

### API Client Patterns

**Ground in sources:**

- From 05-api-routes-catalog.md and 09-business-logic-testing-needs.md: How are API calls structured?
- From src/lib/remote/: Examine all \*.remote.ts files (what patterns exist?)
- From existing tests: How are remote clients tested? (\*.remote.test.ts files)

**Define standards for:**

- **Remote client organization**: How to structure API clients? (extract pattern from src/lib/remote/)
- **Fetch injection**: How to make fetch mockable? (examine actual patterns)
- **Error handling**: How are API errors handled? (examine actual error handling in remote clients)
- **Retry patterns**: Do any clients have retry logic? (search codebase)

---

## Section 3: Async/Await Patterns

**Ground in sources:**

- From 09-business-logic-testing-needs.md: Where is async code hard to test?
- From 01-test-quality-audit.md: What async patterns caused test issues?
- From codebase: Search for async/await patterns, Promise.all usage, try/catch patterns

**Define standards for:**

- **Error handling**: How should async errors be handled? (extract patterns from well-tested async code)
- **Promise.all usage**: When to use vs sequential? (find examples in codebase)
- **Timeout patterns**: Do any modules implement timeouts? (search for timeout implementations)
- **Result type pattern**: Is there a Result<T, E> type? (search types/ directory)

---

## Section 4: State Management

**Ground in sources:**

- From 07-component-testing-surface.md: How is state managed in components?
- From 02-architecture-module-map.md: Are Svelte stores documented?
- From src/lib/stores/: Do any stores exist? Examine them.
- Reference docs/llms/svelte/llms-full.txt for Svelte 5 runes
- Reference docs/llms/svelte/svelte-store.md for store patterns

**Define standards for:**

- **Svelte 5 runes**: When to use $state, $derived, $effect? (reference Svelte 5 docs)
- **Stores**: When to use stores vs runes? (reference Svelte docs + examine codebase)
- **Context**: When to use context? (reference docs/llms/svelte/Context.md)
- **Testability**: How to make stores testable? (examine if any store tests exist)

---

## Section 5: Error Handling

**Ground in sources:**

- From 01-test-quality-audit.md: How many tests check error scenarios? What percentage?
- From 05-api-routes-catalog.md: What error handling exists in API routes?
- From codebase: Search for Error classes, try/catch blocks, error handling patterns

**Define standards for:**

- **Result type pattern**: Does codebase use Result<T, E>? (search types/)
- **Error types**: What error classes exist? (search for class X extends Error)
- **Error boundaries**: How are errors handled in Svelte? (reference docs/llms/svelte/svelte-boundary.md)
- **API error responses**: What format? (examine actual API routes)

---

## Section 6: File System Operations

## **Ground in sources:**
