# Improved Prompt for AI Coding Agent

## Objective

Update Storybook documentation pages (existing, or create news ones if not) with advanced, TypeScript-focused examples for SvelteKit. **You MUST use only the provided tools to retrieve accurate, up-to-date information. Do NOT rely on general knowledge or pre-trained information.**

## Target Documentation

- `@https://storybook.js.org/docs/writing-tests/interaction-testing`
- `@https://storybook.js.org/docs/writing-tests/integrations/stories-in-end-to-end-tests`

## Required Tools (MUST USE FOR ALL INFORMATION)

1. **mcp_context7_resolve-library-id** - Resolve library names to Context7 IDs
2. **mcp_context7_get-library-docs** - Get current library documentation
3. **mcp_supabase_search_docs** - Search Supabase documentation
4. **mcp_mcp-svelte-docs_svelte_definition** - Get Svelte 5 definitions and syntax

## Mandatory Workflow

### Phase 1: Information Gathering (Tool Use Only)

1. **Resolve ALL library IDs** using `mcp_context7_resolve-library-id` for:
   - `storybook` (latest version)
   - `playwright`
   - `drizzle-orm`
   - `drizzle-valibot`
   - `sveltekit-superforms`
   - `valibot`

2. **Retrieve current documentation** using `mcp_context7_get-library-docs` for each library:
   - Storybook interaction testing APIs
   - Playwright test runner integration with Storybook
   - Drizzle ORM with Valibot schema validation
   - Superforms setup and usage patterns
   - Valibot schema definition syntax

3. **Get Svelte 5 specifics** using `mcp_mcp-svelte-docs_svelte_definition`:
   - Component syntax (runes: `$state`, `$derived`, `$effect`)
   - Form handling patterns
   - TypeScript integration
   - SvelteKit-specific features (`load` functions, form actions)

4. **Search for integration patterns** using `mcp_supabase_search_docs` (if Supabase is involved in examples)

### Phase 2: Example Development Requirements

Create a **complete, production-ready example** featuring:

#### Complex Form Component Scenario

```
User Flow:
1. Component loads → fetch data from Drizzle database
2. Transform database data → make external API call with retrieved data
3. Receive API response → populate Superforms with Valibot schema
4. Display form with pre-populated data from API response
5. User interactions are testable via Storybook interaction tests
6. End-to-end flow validated with Playwright
```

#### Technical Requirements (Verify EACH with tools):

- **TypeScript**: Strict mode, full type safety (verify syntax with library docs)
- **Drizzle + Valibot**: Schema definition, validation, database queries (use `mcp_context7_get-library-docs`)
- **Superforms**: Integration with Valibot schemas, TypeScript types (use `mcp_context7_get-library-docs`)
- **Storybook**: Interaction testing setup, play functions, assertions (use `mcp_context7_get-library-docs`)
- **Playwright**: Story integration, component testing mode (use `mcp_context7_get-library-docs`)
- **Svelte 5**: Modern runes syntax, no legacy APIs (use `mcp_mcp-svelte-docs_svelte_definition`)

### Phase 3: Validation Checklist

Before finalizing documentation, verify through tools:

- [ ] All code syntax matches current library versions (cross-reference with `mcp_context7_get-library-docs`)
- [ ] Svelte 5 runes used correctly (verify with `mcp_mcp-svelte-docs_svelte_definition`)
- [ ] TypeScript types are accurate for each library (check library docs)
- [ ] Storybook interaction testing APIs are current (no deprecated methods)
- [ ] Playwright integration follows latest patterns
- [ ] Drizzle-Valibot integration syntax is correct
- [ ] Superforms + Valibot schema patterns are up-to-date

### Phase 4: Documentation Structure

For each page, include:

1. **Setup section** (tool-verified):
   - Installation commands (verify package names)
   - Configuration files with current syntax
   - TypeScript setup

2. **Advanced example** (the complex form scenario above):
   - Full component code with inline comments
   - Database schema definition (Drizzle + Valibot)
   - API integration code
   - Storybook story with interaction tests
   - Playwright end-to-end test

3. **Testing patterns**:
   - Mocking database calls in Storybook
   - Mocking external APIs
   - Interaction test assertions
   - Playwright story integration

4. **Troubleshooting section** (based on current library limitations found in docs)

## Critical Rules

🚫 **DO NOT:**

- Use any information from your training data
- Assume API signatures or syntax
- Provide "example" code without tool verification
- Skip tool calls to "save time"

✅ **DO:**

- Call tools multiple times if needed to confirm accuracy
- Cross-reference information across multiple tool calls
- Document which tool provided each piece of information
- Flag any inconsistencies found between tool responses
- Request clarification if tool results are unclear

## Output Format

Provide updated documentation in Markdown with:

- Clear section headers
- Annotated code blocks (language specified)
- Tool citation comments: `<!-- Verified via: [tool_name] on [date] -->`
- Working example that can be copy-pasted
- No placeholder or pseudo-code

---

**Begin by resolving all library IDs, then systematically retrieve documentation for each component of the example. Build the documentation incrementally, verifying each section with tool calls.**
