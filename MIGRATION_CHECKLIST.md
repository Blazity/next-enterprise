# Migration and Integration Checklist

## Phase 1: Remove Next.js Remnants ✅ COMPLETE

- [x] Delete `env.mjs`
- [x] Delete `instrumentation.ts`
- [x] Delete `report-bundle-size.js`
- [x] Delete `.github/workflows/nextjs_bundle_analysis.yml`
- [x] Create `src/lib/env.ts` with SvelteKit environment handling
- [x] Update `eslint.config.mjs` to remove Next.js plugin
- [x] Update `eslint.config.mjs` to add Svelte plugin
- [x] Update ignore patterns from `.next/` to `.svelte-kit/`
- [x] Fix database initialization to be lazy-loaded

## Phase 2: Convert JavaScript to TypeScript ✅ COMPLETE

### Type Definitions

- [x] Create `src/lib/types/index.ts` with all type definitions

### Utility Files

- [x] Convert `utils.js` → `src/lib/utils/timer.ts`
- [x] Convert `eases.js` → `src/lib/utils/easing.ts`
- [x] Convert `shape.js` → `src/lib/utils/shape.ts`
- [x] Convert `mapbox.js` → `src/lib/utils/mapbox.ts`
- [x] Convert `styles.js` → `src/lib/utils/styles.ts`
- [x] Create `src/lib/utils/index.ts`

### Store Files

- [x] Convert writable stores → `src/lib/stores/count.ts`
- [x] Convert readable stores → `src/lib/stores/time.ts`
- [x] Convert derived stores → `src/lib/stores/elapsed.ts`
- [x] Convert custom stores → `src/lib/stores/custom-count.ts`
- [x] Create `src/lib/stores/index.ts`

### Action Files

- [x] Convert `click_outside.js` → `src/lib/actions/click-outside.ts`
- [x] Convert `longpress.js` → `src/lib/actions/longpress.ts`
- [x] Convert `pannable.js` → `src/lib/actions/pannable.ts`
- [x] Create `src/lib/actions/index.ts`

### Data Files

- [x] Convert `images.js` → `src/lib/data/images.ts`
- [x] Convert area chart `data.js` → `src/lib/data/area-chart.ts`
- [x] Convert scatterplot `data.js` → `src/lib/data/scatterplot.ts`
- [x] Create `src/lib/data/index.ts`

### Transition Files

- [x] Convert `custom-transitions.js` → `src/lib/transitions/custom.ts`
- [x] Create `src/lib/transitions/index.ts`

## Phase 3: Integrate Examples into Main Codebase ⏳ IN PROGRESS

### Infrastructure

- [x] Create `src/routes/examples/` directory
- [x] Create `src/routes/examples/+page.svelte` index page
- [ ] Create category subdirectories

### Example Categories to Integrate

- [ ] 00-introduction (5 examples)
  - [ ] hello-world
  - [ ] dynamic-attributes
  - [ ] styling
  - [ ] nested-components
  - [ ] html-tags

- [ ] 01-reactivity (3 examples)
  - [ ] reactive-assignments
  - [ ] reactive-declarations
  - [ ] reactive-statements

- [ ] 02-props (3 examples)
  - [ ] declaring-props
  - [ ] default-values
  - [ ] spread-props

- [ ] 03-logic (6 examples)
  - [ ] if-blocks
  - [ ] else-blocks
  - [ ] else-if-blocks
  - [ ] each-blocks
  - [ ] keyed-each-blocks
  - [ ] await-blocks

- [ ] 04-events (4 examples)
  - [ ] dom-events
  - [ ] inline-handlers
  - [ ] component-events
  - [ ] event-forwarding

- [ ] 05-bindings (13 examples)
  - [ ] text-inputs
  - [ ] numeric-inputs
  - [ ] checkbox-inputs
  - [ ] group-inputs
  - [ ] textarea-inputs
  - [ ] file-inputs
  - [ ] select-bindings
  - [ ] multiple-select
  - [ ] each-block-bindings
  - [ ] media-elements
  - [ ] dimensions
  - [ ] bind-this
  - [ ] component-bindings

- [ ] 06-lifecycle (3 examples)
  - [ ] onmount
  - [ ] ondestroy
  - [ ] tick

- [ ] 07-stores (5 examples)
  - [ ] writable-stores
  - [ ] auto-subscriptions
  - [ ] readable-stores
  - [ ] derived-stores
  - [ ] custom-stores

- [ ] 08-motion (2 examples)
  - [ ] tweened
  - [ ] spring

- [ ] 09-transitions (7 examples)
  - [ ] transition
  - [ ] parameters
  - [ ] in-and-out
  - [ ] custom-css
  - [ ] custom-js
  - [ ] transition-events
  - [ ] deferred

- [ ] 10-animations (1 example)
  - [ ] animate

- [ ] 11-easing (1 example)
  - [ ] easing

- [ ] 12-svg (5 examples)
  - [ ] clock
  - [ ] bar-chart
  - [ ] area-chart
  - [ ] scatterplot
  - [ ] svg-transitions

- [ ] 13-actions (3 examples)
  - [ ] actions
  - [ ] parameters
  - [ ] pannable

- [ ] 14-classes (2 examples)
  - [ ] classes
  - [ ] class-shorthand

- [ ] 15-composition (6 examples)
  - [ ] render-props
  - [ ] fallbacks
  - [ ] named-render-props
  - [ ] render-prop-props
  - [ ] conditional
  - [ ] modal

- [ ] 16-context (1 example)
  - [ ] context-api

- [ ] 17-special-elements (6 examples)
  - [ ] svelte-element
  - [ ] svelte-window
  - [ ] window-bindings
  - [ ] svelte-document
  - [ ] svelte-body
  - [ ] svelte-head

- [ ] 18-module-context (1 example)
  - [ ] module-exports

- [ ] 19-debugging (1 example)
  - [ ] debug

- [ ] 20-7guis (6 examples)
  - [ ] counter
  - [ ] temperature
  - [ ] flight-booker
  - [ ] timer
  - [ ] crud
  - [ ] circles

- [ ] 21-miscellaneous (3 examples)
  - [ ] recursive-components
  - [ ] dynamic-components
  - [ ] hacker-news

## Phase 4: Update GitHub Workflows ✅ COMPLETE

- [x] Update `.github/workflows/check.yml`
  - [x] Add `pnpm run check` for type checking
  - [x] Fix format command to `pnpm run format`
  - [x] Add `pnpm run build` for build verification
  - [x] Ensure proper command ordering

- [x] Verify `.github/workflows/playwright.yml` is SvelteKit-compatible

## Phase 5: Configuration Updates ✅ COMPLETE

- [x] Update `svelte.config.js` with path aliases
- [x] Create comprehensive path alias configuration
- [x] Document path aliases in `docs/PATH_ALIASES.md`

## Phase 6: Standards Compliance ✅ COMPLETE (for created files)

- [x] No comments in any newly created code files
- [x] No underscores or prefixes in variable names
- [x] All imports use path aliases
- [x] Explicit return types on all functions
- [x] No `any` types used
- [x] All buttons have `type="button"` attribute
- [x] All void elements are self-closing

## Phase 7: Validation ⏳ PENDING

- [ ] Run `turbo run build` - verify exit code 0
- [ ] Run `turbo run check` - verify exit code 0
- [ ] Run `turbo run lint` - verify exit code 0
- [ ] Run `turbo run cpd` - verify exit code 0
- [ ] Run `turbo run test` - verify exit code 0
- [ ] Fix any issues found
- [ ] Re-run all validation commands until all pass

## Phase 8: Documentation ⏳ PENDING

- [ ] Update README.md with new structure
- [ ] Document example integration approach
- [ ] Update contributing guidelines
- [ ] Create migration guide for future reference

## Success Criteria

- [ ] 100% of codebase is TypeScript (no .js files except config)
- [ ] 100% of codebase is SvelteKit (zero Next.js dependencies)
- [ ] All examples integrated and functional
- [ ] Zero violations of CLAUDE.md standards
- [ ] All GitHub workflows passing
- [ ] All validation commands exit with code 0
