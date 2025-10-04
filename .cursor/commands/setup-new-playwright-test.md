# Setup New Playwright Test

Create a complete Playwright E2E test with page object for: **$ARGUMENTS**

## 📋 Pre-Setup Checklist

Before creating files, determine:

- [ ] **Page Name**: What page are you testing? (e.g., `dashboard`, `chat`, `settings`)
- [ ] **Route Path**: What's the URL path? (e.g., `/dashboard`, `/chat`, `/settings`)
- [ ] **Auth Required**: Is authentication required? (yes/no)
- [ ] **Test Category**: Where does it belong? (e.g., `chat`, `profile`, `admin`)

---

## ✅ Setup Checklist

### 1. **Create Page Object Model**

**Location**: `apps/web/e2e/page-objects/<category>/<page-name>.page.ts`

```typescript
import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for <Page Name>
 * Route: <route-path>
 * Auth Required: <yes/no>
 */
export class <PageName>Page {
  readonly page: Page;

  // 🎯 TODO: Add your locators here
  readonly heading: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;

    // 🎯 TODO: Initialize your locators
    this.heading = page.getByRole('heading', { name: /TODO: add heading text/i });
    this.mainContent = page.locator('[data-testid="main-content"]');
  }

  /**
   * Navigate to the <page-name> page
   */
  async goto() {
    await this.page.goto('<route-path>');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify the page is loaded correctly
   */
  async isLoaded(): Promise<boolean> {
    await expect(this.heading).toBeVisible();
    await expect(this.mainContent).toBeVisible();
    return true;
  }

  // 🎯 TODO: Add your page-specific methods here
  // Example:
  // async clickButton() {
  //   await this.someButton.click();
  // }
}
```

**Checklist for Page Object:**

- [ ] File created in correct location
- [ ] Class name uses PascalCase with 'Page' suffix
- [ ] All locators use semantic selectors (role, label, text)
- [ ] `goto()` method implemented
- [ ] `isLoaded()` method implemented
- [ ] JSDoc comments added

---

### 2. **Update Page Object Index**

**Location**: `apps/web/e2e/page-objects/<category>/index.ts`

```typescript
export { <PageName>Page } from './<page-name>.page';
```

**Checklist:**

- [ ] Export added to index file
- [ ] File follows kebab-case naming

---

### 3. **Create Page Object Fixture** (if new category)

**Location**: `apps/web/e2e/fixtures/page-objects.fixtures.ts`

Add to existing fixtures:

```typescript
import { <PageName>Page } from '../page-objects/<category>/<page-name>.page';

// Add to type definition
type PageObjectFixtures = {
  // ... existing fixtures
  <pageName>Page: <PageName>Page;
};

// Add to fixture extension
export const pageObjectTest = authTest.extend<PageObjectFixtures>({
  // ... existing fixtures

  <pageName>Page: async ({ <authenticated-or-page> }, use) => {
    const <pageName>Page = new <PageName>Page(<authenticated-or-page>);
    await <pageName>Page.goto();
    await use(<pageName>Page);
  },
});
```

**Checklist:**

- [ ] Import added
- [ ] Type added to `PageObjectFixtures`
- [ ] Fixture implementation added
- [ ] Uses correct page (authenticated vs regular)

---

### 4. **Create Test File**

**Location**: `apps/web/e2e/tests/<public-or-authenticated>/<category>/<page-name>.spec.ts`

**For AUTHENTICATED pages:**

```typescript
import { test, expect } from '@/e2e/fixtures';

/**
 * E2E Tests for <Page Name>
 *
 * @route <route-path>
 * @requires authentication
 */
test.describe('<Page Name> - Authenticated', () => {
  test.beforeEach(async ({ <pageName>Page }) => {
    // Page is already loaded by fixture
    await <pageName>Page.isLoaded();
  });

  test('🚀 SMOKE: should load <page-name> page successfully', async ({ <pageName>Page }) => {
    // Verify page title
    await expect(<pageName>Page.page).toHaveTitle(/TODO: add expected title/i);

    // Verify main heading
    await expect(<pageName>Page.heading).toBeVisible();

    // Verify main content
    await expect(<pageName>Page.mainContent).toBeVisible();
  });

  test.fixme('TODO: should handle main user action', async ({ <pageName>Page }) => {
    // 🎯 TODO: Implement test for primary user action
    // Example: await <pageName>Page.clickButton();
  });

  test.fixme('TODO: should display error messages correctly', async ({ <pageName>Page }) => {
    // 🎯 TODO: Implement error handling test
  });

  test.fixme('TODO: should validate form inputs', async ({ <pageName>Page }) => {
    // 🎯 TODO: Implement form validation test if applicable
  });

  test.describe('Edge Cases', () => {
    test.fixme('TODO: should handle network errors', async ({ <pageName>Page }) => {
      // 🎯 TODO: Test network error handling
    });

    test.fixme('TODO: should work with empty state', async ({ <pageName>Page }) => {
      // 🎯 TODO: Test empty state if applicable
    });
  });
});
```

**For PUBLIC pages:**

```typescript
import { publicTest as test, expect } from '@/e2e/fixtures';

/**
 * E2E Tests for <Page Name>
 *
 * @route <route-path>
 * @public accessible without authentication
 */
test.describe('<Page Name> - Public', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('<route-path>');
		await page.waitForLoadState('networkidle');
	});

	test('🚀 SMOKE: should load <page-name> page successfully', async ({ page }) => {
		// Verify page title
		await expect(page).toHaveTitle(/TODO: add expected title/i);

		// Verify main heading
		await expect(page.getByRole('heading', { name: /TODO/i })).toBeVisible();

		// Verify page is accessible without auth
		const url = page.url();
		expect(url).toContain('<route-path>');
	});

	test.fixme('TODO: should display all public content', async ({ page }) => {
		// 🎯 TODO: Verify public content is visible
	});

	test.fixme('TODO: should navigate to login when required', async ({ page }) => {
		// 🎯 TODO: Test auth redirect if applicable
	});

	test.fixme('TODO: should validate form inputs', async ({ page }) => {
		// 🎯 TODO: Test form validation if applicable
	});
});
```

**Checklist for Test File:**

- [ ] File created in correct location (public vs authenticated)
- [ ] Uses correct test import (`test` vs `publicTest`)
- [ ] Descriptive test.describe() name
- [ ] Smoke test is runnable (not test.fixme)
- [ ] Additional tests marked with test.fixme()
- [ ] JSDoc comments with route and auth info
- [ ] Follows naming convention: `<page-name>.spec.ts`

---

## 🏗️ File Structure Summary

After completion, you should have:

```
apps/web/e2e/
├── page-objects/
│   └── <category>/
│       ├── <page-name>.page.ts        ✅ Created
│       └── index.ts                    ✅ Updated
├── fixtures/
│   └── page-objects.fixtures.ts        ✅ Updated
└── tests/
    └── <public|authenticated>/
        └── <category>/
            └── <page-name>.spec.ts     ✅ Created
```

---

## 🧪 Verification Steps

### Step 1: Run the Smoke Test

```bash
# Run only the new smoke test
pnpm playwright test <page-name>.spec.ts --grep "SMOKE"

# Or run all tests in the file
pnpm playwright test <page-name>.spec.ts
```

**Expected Result:**

- ✅ Smoke test should PASS or show clear TODO errors
- ✅ test.fixme() tests should be SKIPPED
- ✅ No TypeScript errors

### Step 2: Run with UI Mode

```bash
pnpm playwright test <page-name>.spec.ts --ui
```

**Verify:**

- [ ] Test appears in correct category
- [ ] Can select and run the test
- [ ] Can see page object interactions
- [ ] Error logging works (check logs on failure)

### Step 3: Run in Debug Mode

```bash
pnpm playwright test <page-name>.spec.ts --debug
```

**Verify:**

- [ ] Debugger opens
- [ ] Can step through test
- [ ] Page object methods work
- [ ] Locators are correct

### Step 4: Check TypeScript

```bash
pnpm tsc --noEmit
```

**Verify:**

- [ ] No TypeScript errors
- [ ] All imports resolve correctly
- [ ] Types are correct

---

## 📝 Next Steps

1. **Update the Smoke Test**
   - Replace TODO comments with actual values
   - Update expected title
   - Update locator selectors

2. **Implement Page Object Methods**
   - Add methods for user interactions
   - Add methods for verifying state
   - Add helper methods as needed

3. **Complete Test Cases**
   - Remove test.fixme() from each test
   - Implement test logic
   - Add assertions

4. **Add Test Data**
   - Create test data in `e2e/utils/test-data.ts`
   - Use data factories for complex objects

5. **Review and Refine**
   - Ensure tests are independent
   - Check for flaky selectors
   - Add proper waits
   - Follow best practices

---

## 🎨 Naming Conventions Reference

| Item              | Convention         | Example                     |
| ----------------- | ------------------ | --------------------------- |
| Page Object File  | kebab-case.page.ts | `dashboard.page.ts`         |
| Page Object Class | PascalCase + Page  | `DashboardPage`             |
| Test File         | kebab-case.spec.ts | `dashboard.spec.ts`         |
| Fixture Name      | camelCase + Page   | `dashboardPage`             |
| Test Describe     | Title Case         | `Dashboard - Authenticated` |
| Directory         | kebab-case         | `chat/`, `profile/`         |

---

## 🔍 Common Issues & Solutions

### Issue: "Cannot find module '@/e2e/fixtures'"

**Solution**: Check `tsconfig.json` has path alias:

```json
{
	"compilerOptions": {
		"paths": {
			"@/*": ["./apps/web/*"]
		}
	}
}
```

### Issue: "Fixture 'authenticatedPage' not found"

**Solution**: You're using authenticated fixture in public test. Change:

```typescript
// ❌ Wrong
import { test, expect } from '@/e2e/fixtures';

// ✅ Correct for public tests
import { publicTest as test, expect } from '@/e2e/fixtures';
```

### Issue: Test times out

**Solution**: Add explicit waits:

```typescript
await page.waitForLoadState('networkidle');
await page.waitForSelector('[data-testid="main-content"]');
```

### Issue: Flaky test

**Solution**: Use proper Playwright assertions (auto-wait):

```typescript
// ❌ Avoid
expect(await element.isVisible()).toBe(true);

// ✅ Use
await expect(element).toBeVisible();
```
