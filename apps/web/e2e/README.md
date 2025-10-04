# E2E Testing with Playwright

Comprehensive end-to-end testing suite with automatic error logging, console monitoring, and organized test structure.

## 📁 Directory Structure

```
e2e/
├── fixtures/              # Test fixtures (auth, page objects, API)
│   ├── base.fixtures.ts   # Error logging & console monitoring (auto)
│   ├── auth.fixtures.ts   # Authentication fixtures
│   ├── api.fixtures.ts    # API request fixtures
│   ├── page-objects.fixtures.ts  # Page object fixtures
│   └── index.ts           # Main exports
├── page-objects/          # Page Object Models
│   └── home.page.ts       # Homepage page object
├── tests/
│   ├── public/           # 🔓 Unauthenticated tests
│   │   ├── homepage.spec.ts
│   │   └── homepage-console-errors.spec.ts
│   └── authenticated/    # 🔐 Authenticated tests (future)
├── utils/                # Utility functions (future)
└── .auth/                # Storage states (gitignored)
```

## 🚀 Running Tests

### Run all tests

```bash
pnpm playwright test
```

### Run specific test suite

```bash
# Public tests only
pnpm playwright test tests/public

# Specific test file
pnpm playwright test tests/public/homepage-console-errors
```

### Run with UI mode (recommended for development)

```bash
pnpm playwright test --ui
```

### Debug mode

```bash
pnpm playwright test --debug
```

### Run specific browser

```bash
pnpm playwright test --project=chromium-public
```

### Headed mode (see browser)

```bash
pnpm playwright test --headed
```

## 📝 Writing Tests

### Unauthenticated Test (Public)

```typescript
import { publicTest as test, expect } from '../../fixtures';

test('should display homepage', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/My App/);
});
```

### Authenticated Test (Future)

```typescript
import { test, expect } from '../../fixtures';

test('should access protected page', async ({ authenticatedPage }) => {
	await authenticatedPage.goto('/dashboard');
	await expect(authenticatedPage).toHaveURL('/dashboard');
});
```

### API Test (Future)

```typescript
import { apiTest as test, expect } from '../../fixtures';

test('should create resource', async ({ apiHelpers }) => {
	const result = await apiHelpers.createChat('New Chat');
	expect(result.id).toBeTruthy();
});
```

## 🔧 Available Fixtures

### Built-in (always available)

- `page` - Browser page
- `context` - Browser context
- `browser` - Browser instance
- `request` - API request context

### Custom Fixtures

#### Public Tests (`publicTest`)

- `errorLogger` - ✅ Auto-logs errors on failure
- `consoleMonitor` - ✅ Captures console messages
- `testUser` - Fresh user for testing

#### Authenticated Tests (`test`) - Future

- `authenticatedPage` - Pre-authenticated page
- `workerUser` - Shared user (worker-scoped)
- `homePage` - Homepage page object

#### API Tests (`apiTest`) - Future

- `authenticatedAPI` - Authenticated API context
- `apiHelpers` - Helper methods

## 📊 Automatic Error Logging

All tests automatically capture and log:

- ❌ Console errors
- 🔴 Page errors (uncaught exceptions)
- 🌐 Failed requests
- 🚨 HTTP errors (4xx, 5xx)

Logs are saved to: `test-results/<test-name>/logs/error-logs.txt`

### Example Error Log

```
═══════════════════════════════════════════════════════════
❌ TEST FAILURE REPORT
═══════════════════════════════════════════════════════════
📝 Test: should not have any console errors
📂 File: e2e/tests/public/homepage-console-errors.spec.ts
⏱️  Duration: 1234ms
🕐 Time: 2025-01-15T10:30:00.000Z
🌐 Browser: chromium-public
📊 Status: failed

───────────────────────────────────────────────────────────
📋 CAPTURED LOGS
───────────────────────────────────────────────────────────
[2025-01-15T10:30:00.123Z] [CONSOLE_ERROR]
  Uncaught TypeError: Cannot read property 'foo' of undefined

[2025-01-15T10:30:00.456Z] [HTTP_ERROR]
  404 Not Found: http://localhost:4173/api/missing

───────────────────────────────────────────────────────────
❗ ERRORS
───────────────────────────────────────────────────────────
TypeError: Cannot read property 'foo' of undefined
    at Object.<anonymous> (main.js:42:10)

═══════════════════════════════════════════════════════════
```

## 🎯 Test Coverage

### Public Pages (Unauthenticated)

All public page tests verify:

- ✅ No console errors
- ✅ No console warnings (with allowed patterns)
- ✅ No failed HTTP requests (4xx, 5xx)
- ✅ Valid HTML structure
- ✅ Basic accessibility compliance

#### `tests/public/homepage.spec.ts`

**Tests:**

- Should display homepage
- Should have no JavaScript errors on load
- Should load all critical resources

#### `tests/public/homepage-console-errors.spec.ts`

**Tests:**

- Should not have any console errors
- Should not have any console warnings
- Should not have any failed HTTP requests
- Should load successfully
- Should not have any unhandled promise rejections
- Should have valid HTML structure
- Should not have basic accessibility violations

#### `tests/public/auth/login.spec.ts`

**Tests:**

- Should not have any console errors
- Should not have any console warnings
- Should not have any failed HTTP requests
- Should have valid HTML structure
- Should not have basic accessibility violations
- Should display login form
- Should have link to signup page

#### `tests/public/auth/signup.spec.ts`

**Tests:**

- Should not have any console errors
- Should not have any console warnings
- Should not have any failed HTTP requests
- Should have valid HTML structure
- Should not have basic accessibility violations
- Should display signup form
- Should have link to login page

#### `tests/public/examples.spec.ts`

**Tests:**

- Should not have any console errors
- Should not have any console warnings
- Should not have any failed HTTP requests
- Should have valid HTML structure
- Should not have basic accessibility violations
- Should display examples list
- Should have working example links

### Authenticated Pages

All authenticated page tests verify:

- ✅ No console errors
- ✅ No console warnings (with allowed patterns)
- ✅ No failed HTTP requests (4xx, 5xx)
- ✅ Valid HTML structure
- ✅ Basic accessibility compliance

#### `tests/authenticated/chat.spec.ts`

**Tests:**

- Should not have any console errors
- Should not have any console warnings
- Should not have any failed HTTP requests
- Should have valid HTML structure
- Should not have basic accessibility violations
- Should load chat interface

#### `tests/authenticated/profile.spec.ts`

**Tests:**

- Should not have any console errors
- Should not have any console warnings
- Should not have any failed HTTP requests
- Should have valid HTML structure
- Should not have basic accessibility violations
- Should load profile page

### Page Objects

#### `page-objects/home.page.ts`

- **HomePage** - Homepage page object
- Methods: `goto()`, `getTitle()`, `expectNoConsoleErrors()`

#### `page-objects/auth/login.page.ts`

- **LoginPage** - Login page object with form interactions
- Methods: `goto()`, `login()`, `expectError()`, `goToSignup()`

#### `page-objects/auth/signup.page.ts`

- **SignupPage** - Signup page object with form interactions
- Methods: `goto()`, `signup()`, `expectError()`, `goToLogin()`

#### `page-objects/chat/chat.page.ts`

- **ChatPage** - Chat page object with message interactions
- Methods: `goto()`, `sendMessage()`, `createNewChat()`, `getMessageCount()`, `waitForAIResponse()`

#### `page-objects/profile/profile.page.ts`

- **ProfilePage** - Profile page object with form interactions
- Methods: `goto()`, `updateProfile()`, `expectSuccess()`

### Test Statistics

- **Total Test Files**: 7
- **Public Tests**: 5 files
- **Authenticated Tests**: 2 files
- **Page Objects**: 5 classes
- **Total Test Cases**: ~50+ individual tests

## 🐛 Debugging

### View test report

```bash
pnpm playwright show-report
```

### View trace

```bash
pnpm playwright show-trace test-results/<test-name>/trace.zip
```

### Run in headed mode

```bash
pnpm playwright test --headed
```

### Run with browser console

```bash
PWDEBUG=console pnpm playwright test
```

## 🎯 Best Practices

1. **Use Fixtures** - Import from `../../fixtures` for automatic error logging
2. **Use Page Objects** - Don't interact with page directly in tests
3. **Descriptive Test Names** - Be clear about what you're testing
4. **Keep Tests Independent** - Each test should work in isolation
5. **Proper Async** - Always await Playwright actions
6. **Smart Locators** - Prefer role-based locators over CSS selectors

## 📦 Adding New Tests

### 1. Create test file in appropriate directory

```bash
# Public test
touch e2e/tests/public/my-feature.spec.ts

# Authenticated test (future)
touch e2e/tests/authenticated/my-feature.spec.ts
```

### 2. Import fixtures

```typescript
import { publicTest as test, expect } from '../../fixtures';
// or
import { test, expect } from '../../fixtures';
```

### 3. Write tests

```typescript
test.describe('My Feature', () => {
	test('should work correctly', async ({ page }) => {
		// Test implementation
	});
});
```

## 🔄 CI/CD Integration

Tests are configured to run in CI with:

- Retries: 2 (on failure)
- Workers: 1 (sequential execution)
- Screenshots: On failure
- Videos: On failure
- Traces: On first retry

### GitHub Actions Example

```yaml
- name: Run E2E tests
  run: pnpm playwright test

- name: Upload test results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: apps/web/playwright-report/
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Page Object Model](https://playwright.dev/docs/pom)
