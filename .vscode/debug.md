# Debugging in VSCode/Cursor (no Turbopack)

This project includes a VSCode debug configuration using the `pwa-node` debugger.

- Turbopack is disabled during debugging to ensure stable breakpoint support across platforms (especially on Windows).
- The debugger starts Next.js in development mode using `pnpm exec next dev`.

## How to Use

1. Press **F5** or start debugging via the VSCode/Cursor menu (Run → Start Debugging)
2. Set breakpoints in your code
3. For pages/components: save the file to trigger Fast Refresh  
   For API routes: manually re-trigger the route (e.g. in the browser), since they don’t re-run automatically on save
