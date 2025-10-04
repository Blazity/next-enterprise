# Path Aliases and Workspace Packages Reference

This document provides a quick reference for workspace packages and path aliases in the SvelteKit Enterprise monorepo.

## Workspace Packages (Shared Code)

**ALWAYS use workspace packages for shared code across the monorepo:**

| Package          | Import Path                      | Purpose                       | Example Usage                                                       |
| ---------------- | -------------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| `@repo/database` | `@repo/database/client`          | Database client               | `import { db } from '@repo/database/client'`                        |
| `@repo/database` | `@repo/database/schema`          | Drizzle table schemas         | `import { user } from '@repo/database/schema'`                      |
| `@repo/database` | `@repo/database/queries`         | Database query functions      | `import { getUserById } from '@repo/database/queries'`              |
| `@repo/database` | `@repo/database/valibot-schemas` | Valibot schemas from Drizzle  | `import { selectUserSchema } from '@repo/database/valibot-schemas'` |
| `@repo/database` | `@repo/database/errors/db`       | Database error types          | `import { DbNotFoundError } from '@repo/database/errors/db'`        |
| `@repo/ui`       | `@repo/ui`                       | Shared UI components (Button) | `import { Button } from '@repo/ui'`                                 |
| `@repo/ui`       | `@repo/ui/utils`                 | UI utilities (cn, shadcn)     | `import { cn } from '@repo/ui/utils'`                               |
| `@repo/ui`       | `@repo/ui/components/ui/*`       | Individual UI components      | `import { Sidebar } from '@repo/ui/components/ui/sidebar'`          |
| `@repo/schemas`  | `@repo/schemas`                  | Valibot validation schemas    | `import { schema } from '@repo/schemas'`                            |
| `@repo/schemas`  | `@repo/schemas/user-profile`     | User profile schemas          | `import { userProfileSchema } from '@repo/schemas/user-profile'`    |
| `@repo/types`    | `@repo/types`                    | Shared TypeScript types       | `import type { User } from '@repo/types'`                           |

## Path Aliases (apps/web only)

**Use path aliases for app-specific code in the web application:**

| Alias          | Path                  | Purpose                 | Example Usage                               |
| -------------- | --------------------- | ----------------------- | ------------------------------------------- |
| `$lib`         | `src/lib`             | Default SvelteKit alias | `import { something } from '$lib/file'`     |
| `$components`  | `src/lib/components`  | App-specific components | `import { MyComponent } from '$components'` |
| `$stores`      | `src/lib/stores`      | Svelte stores           | `import { count } from '$stores'`           |
| `$remote`      | `src/lib/remote`      | Remote functions        | `import { analyzeData } from '$remote'`     |
| `$actions`     | `src/lib/actions`     | Svelte actions          | `import { clickOutside } from '$actions'`   |
| `$transitions` | `src/lib/transitions` | Custom transitions      | `import { expand } from '$transitions'`     |
| `$data`        | `src/lib/data`        | Static data files       | `import { images } from '$data'`            |
| `$ai`          | `src/lib/server/ai`   | AI SDK code             | `import { generateText } from '$ai'`        |
| `$mcp`         | `src/lib/server/mcp`  | MCP tools               | `import { mcpTool } from '$mcp'`            |
| `$api`         | `src/routes/api`      | API endpoints           | `import { handler } from '$api/endpoint'`   |

## Usage Examples

### Workspace Packages (Shared Code)

```typescript
import { db } from '@repo/database/client';
import { user, chat, message } from '@repo/database/schema';
import { getUserById, saveChat } from '@repo/database/queries';
import type { User, Chat, Message } from '@repo/database/schema';

import { Button } from '@repo/ui';
import { cn } from '@repo/ui/utils';
import { Sidebar, SidebarContent } from '@repo/ui/components/ui/sidebar';

import { userProfileSchema } from '@repo/schemas/user-profile';
import type { TransitionConfig, MapboxContext } from '@repo/types';
```

### App-Specific Code (apps/web)

```typescript
import { MyComponent, AppHeader } from '$components';
import { count, time, elapsed } from '$stores';
import { clickOutside, longpress, pannable } from '$actions';
import { images, areaChartData } from '$data';
import { expand } from '$transitions';
import { aiProvider } from '$ai';
import { mcpTool } from '$mcp';
```

## Best Practices

1. **Use workspace packages for shared code** - Import from `@repo/*` for code shared across apps
2. **Use path aliases for app-specific code** - Use `$` aliases only within `apps/web`
3. **Never use relative imports** - Avoid `../../../packages/database/src/queries`
4. **Import from index files** - Each package/directory has an `index.ts` that exports public APIs
5. **Type imports** - Use `import type` for type-only imports
6. **Consistent naming** - Follow established patterns in each package

## Decision Tree: Workspace Package vs Path Alias

```
Is the code shared across multiple apps?
├─ YES → Use workspace package (@repo/*)
│   ├─ Database code → @repo/database
│   ├─ UI components → @repo/ui
│   ├─ Types → @repo/types
│   └─ Schemas → @repo/schemas
│
└─ NO → Use path alias ($*)
    ├─ App components → $components
    ├─ App stores → $stores
    ├─ App actions → $actions
    └─ Server code → $ai, $mcp
```

## Configuration

### Workspace Packages

Workspace packages are configured in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Each package has its own `package.json` with exports:

```json
{
	"name": "@repo/database",
	"exports": {
		"./client": "./src/db.ts",
		"./schema": "./src/schema/index.ts",
		"./queries": "./src/queries.ts"
	}
}
```

### Path Aliases (apps/web)

Path aliases are configured in `apps/web/svelte.config.js`:

```javascript
kit: {
  alias: {
    $components: 'src/lib/components',
    $stores: 'src/lib/stores',
    $ai: 'src/lib/server/ai',
    // ... etc
  }
}
```

TypeScript automatically picks up these aliases through SvelteKit's generated configuration.

## Adding New Workspace Packages

To add a new workspace package:

1. Create a new directory in `packages/`
2. Add a `package.json` with `name: "@repo/package-name"`
3. Define exports in `package.json`
4. Create `src/index.ts` to export public API
5. Run `pnpm install` to link the package
6. Import using `@repo/package-name`

## Adding New Path Aliases

To add a new path alias (apps/web only):

1. Add it to `apps/web/svelte.config.js` in the `kit.alias` section
2. Create the corresponding directory structure
3. Add an `index.ts` file to export the public API
4. Update this documentation

## Troubleshooting

### Workspace Packages Not Resolving

1. Run `pnpm install` to ensure packages are linked
2. Check that the package is listed in `pnpm-workspace.yaml`
3. Verify the package has a valid `package.json` with exports
4. Restart your development server

### Path Aliases Not Working

1. Restart your development server
2. Run `turbo run check --filter=web` to regenerate TypeScript config
3. Check that the alias is defined in `apps/web/svelte.config.js`
4. Verify the target directory exists

### Import Errors

If you see import errors:

1. **Check if code should be shared** - If yes, move to workspace package
2. **Use correct import path** - `@repo/*` for packages, `$*` for app code
3. **Run quality gates** - `turbo run build check lint --parallel`
