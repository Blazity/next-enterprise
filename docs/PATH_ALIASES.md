# Path Aliases Reference

This document provides a quick reference for all configured path aliases in the SvelteKit Enterprise project.

## Available Path Aliases

| Alias          | Path                      | Purpose                                  | Example Usage                             |
| -------------- | ------------------------- | ---------------------------------------- | ----------------------------------------- |
| `$lib`         | `src/lib`                 | Default SvelteKit alias for library code | `import { something } from '$lib/file'`   |
| `$components`  | `src/lib/components`      | UI components                            | `import { Button } from '$components'`    |
| `$schemas`     | `src/lib/schemas`         | Valibot schemas (Drizzle-derived)        | `import { userSchema } from '$schemas'`   |
| `$types`       | `src/lib/types`           | TypeScript type definitions              | `import type { User } from '$types'`      |
| `$models`      | `src/lib/models`          | Business logic classes                   | `import { UserModel } from '$models'`     |
| `$queries`     | `src/lib/queries`         | Database queries                         | `import { getUserById } from '$queries'`  |
| `$remote`      | `src/lib/remote`          | Remote functions                         | `import { analyzeData } from '$remote'`   |
| `$utils`       | `src/lib/utils`           | Utility functions                        | `import { formatDate } from '$utils'`     |
| `$stores`      | `src/lib/stores`          | Svelte stores                            | `import { count } from '$stores'`         |
| `$actions`     | `src/lib/actions`         | Svelte actions                           | `import { clickOutside } from '$actions'` |
| `$transitions` | `src/lib/transitions`     | Custom transitions                       | `import { expand } from '$transitions'`   |
| `$data`        | `src/lib/data`            | Static data files                        | `import { images } from '$data'`          |
| `$db`          | `src/lib/server/database` | Database client                          | `import { db } from '$db'`                |
| `$ai`          | `src/lib/server/ai`       | AI SDK code                              | `import { generateText } from '$ai'`      |
| `$mcp`         | `src/lib/server/mcp`      | MCP tools                                | `import { mcpTool } from '$mcp'`          |
| `$api`         | `src/routes/api`          | API endpoints                            | `import { handler } from '$api/endpoint'` |

## Usage Examples

### Components

```typescript
import { Button, Card, Modal } from '$components';
```

### Types

```typescript
import type { User, Post, Comment } from '$types';
```

### Stores

```typescript
import { count, time, elapsed } from '$stores';
```

### Actions

```typescript
import { clickOutside, longpress, pannable } from '$actions';
```

### Utilities

```typescript
import { onInterval, eases, mapbox } from '$utils';
```

### Data

```typescript
import { images, areaChartData, scatterplotData } from '$data';
```

### Transitions

```typescript
import { expand } from '$transitions';
```

### Database

```typescript
import { db } from '$db';
```

## Best Practices

1. **Always use path aliases** - Never use relative imports like `../../../lib/components`
2. **Import from index files** - Each directory has an `index.ts` that exports all public APIs
3. **Type imports** - Use `import type` for type-only imports
4. **Consistent naming** - Follow the established patterns in each directory

## Configuration

Path aliases are configured in `svelte.config.js`:

```javascript
kit: {
  alias: {
    $components: 'src/lib/components',
    $schemas: 'src/lib/schemas',
    // ... etc
  }
}
```

TypeScript automatically picks up these aliases through SvelteKit's generated configuration.

## Adding New Aliases

To add a new path alias:

1. Add it to `svelte.config.js` in the `kit.alias` section
2. Create the corresponding directory structure
3. Add an `index.ts` file to export the public API
4. Update this documentation

## Troubleshooting

If path aliases are not working:

1. Restart your development server
2. Run `pnpm run check` to regenerate TypeScript config
3. Check that the alias is defined in `svelte.config.js`
4. Verify the target directory exists
