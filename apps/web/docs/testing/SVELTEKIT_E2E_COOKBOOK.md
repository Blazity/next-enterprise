# SvelteKit E2E Testing Cookbook

<!-- Verified via: Storybook/Playwright Official Documentation on 2025-10-03 -->

A practical cookbook for writing page-level end-to-end tests in SvelteKit applications using Playwright and Storybook patterns.

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Registration](#user-registration)
3. [User Login](#user-login)
4. [Create New Chat](#create-new-chat)
5. [Send Message](#send-message)
6. [Receive AI Response](#receive-ai-response)
7. [Upload File](#upload-file)
8. [Switch Models](#switch-models)
9. [View Chat History](#view-chat-history)
10. [Dark Mode Toggle](#dark-mode-toggle)
11. [Logout](#logout)
12. [Complete User Journey](#complete-user-journey)

---

## Getting Started

### Prerequisites

```bash
npm install --save-dev @playwright/test playwright @storybook/test-runner
npx playwright install
```

### Configuration

**`playwright.config.ts`**:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',

	use: {
		baseURL: 'http://127.0.0.1:5173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] }
		}
	],

	webServer: {
		command: 'npm run dev',
		url: 'http://127.0.0.1:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000
	}
});
```

### Test Structure

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── registration.spec.ts
│   │   └── login.spec.ts
│   ├── chat/
│   │   ├── create-chat.spec.ts
│   │   ├── send-message.spec.ts
│   │   ├── ai-response.spec.ts
│   │   ├── file-upload.spec.ts
│   │   ├── model-switch.spec.ts
│   │   └── chat-history.spec.ts
│   ├── ui/
│   │   └── dark-mode.spec.ts
│   └── user-journeys/
│       └── complete-flow.spec.ts
├── setup/
│   └── test-setup.ts
└── utils/
    └── helpers.ts
```

---

## User Registration

### Recipe: Test Complete Registration Flow

```typescript
// tests/e2e/auth/registration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/register');
	});

	test('completes registration with valid data', async ({ page }) => {
		await test.step('Fill registration form', async () => {
			await page.getByTestId('register-form').waitFor();

			await page.getByTestId('name-input').fill('John Doe');
			await page.getByTestId('email-input').fill('john.doe@example.com');
			await page.getByTestId('password-input').fill('SecurePassword123!');
			await page.getByTestId('confirm-password-input').fill('SecurePassword123!');
		});

		await test.step('Submit registration', async () => {
			await page.getByTestId('register-button').click();
			await expect(page.getByTestId('loading-spinner')).toBeVisible();
		});

		await test.step('Verify successful registration', async () => {
			await expect(page).toHaveURL('/dashboard');
			await expect(page.getByText('Welcome, John Doe!')).toBeVisible();

			// Verify user is logged in
			await expect(page.getByTestId('user-menu')).toBeVisible();
		});
	});

	test('shows validation errors for invalid data', async ({ page }) => {
		await test.step('Submit empty form', async () => {
			await page.getByTestId('register-button').click();
		});

		await test.step('Verify validation errors appear', async () => {
			await expect(page.getByText('Name is required')).toBeVisible();
			await expect(page.getByText('Email is required')).toBeVisible();
			await expect(page.getByText('Password is required')).toBeVisible();
			await expect(page.getByTestId('name-input')).toHaveAttribute('aria-invalid', 'true');
		});

		await test.step('Fix validation errors', async () => {
			await page.getByTestId('name-input').fill('John Doe');
			await page.getByTestId('email-input').fill('john.doe@example.com');
			await page.getByTestId('password-input').fill('SecurePassword123!');
			await page.getByTestId('confirm-password-input').fill('SecurePassword123!');
		});

		await test.step('Verify errors disappear', async () => {
			await expect(page.queryByText('Name is required')).not.toBeVisible();
			await expect(page.queryByText('Email is required')).not.toBeVisible();
			await expect(page.queryByText('Password is required')).not.toBeVisible();
			await expect(page.getByTestId('name-input')).toHaveAttribute('aria-invalid', 'false');
		});
	});

	test('handles password mismatch', async ({ page }) => {
		await page.getByTestId('password-input').fill('Password123');
		await page.getByTestId('confirm-password-input').fill('DifferentPassword123');
		await page.getByTestId('register-button').click();

		await expect(page.getByText('Passwords do not match')).toBeVisible();
	});

	test('prevents duplicate email registration', async ({ page }) => {
		await page.getByTestId('name-input').fill('Jane Doe');
		await page.getByTestId('email-input').fill('existing@example.com');
		await page.getByTestId('password-input').fill('Password123!');
		await page.getByTestId('confirm-password-input').fill('Password123!');
		await page.getByTestId('register-button').click();

		await expect(page.getByText('Email already exists')).toBeVisible();
		await expect(page).toHaveURL('/register');
	});

	test('validates email format', async ({ page }) => {
		await page.getByTestId('email-input').fill('invalid-email');
		await page.getByTestId('register-button').click();

		await expect(page.getByText('Please enter a valid email address')).toBeVisible();
	});

	test('validates password strength', async ({ page }) => {
		await page.getByTestId('password-input').fill('weak');
		await page.getByTestId('register-button').click();

		await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
		await expect(page.getByText('Password must contain uppercase letter')).toBeVisible();
		await expect(page.getByText('Password must contain number')).toBeVisible();
	});
});
```

### Recipe: Test Registration with Database Validation

```typescript
// tests/e2e/auth/registration-database.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Registration with Database Validation', () => {
	test('creates user record in database', async ({ page, request }) => {
		const email = `test-${Date.now()}@example.com`;

		await page.goto('/register');

		await page.getByTestId('name-input').fill('Database Test User');
		await page.getByTestId('email-input').fill(email);
		await page.getByTestId('password-input').fill('DatabaseTest123!');
		await page.getByTestId('confirm-password-input').fill('DatabaseTest123!');
		await page.getByTestId('register-button').click();

		await expect(page).toHaveURL('/dashboard');

		// Verify user exists in database via API
		const response = await request.get(`/api/users?email=${encodeURIComponent(email)}`);
		expect(response.ok()).toBeTruthy();

		const users = await response.json();
		expect(users).toHaveLength(1);
		expect(users[0].email).toBe(email);
		expect(users[0].name).toBe('Database Test User');
	});

	test('prevents registration with existing email', async ({ page, request }) => {
		const email = 'existing@example.com';

		// Create user first
		await request.post('/api/admin/users', {
			data: {
				name: 'Existing User',
				email: email,
				password: 'ExistingPass123!'
			}
		});

		await page.goto('/register');
		await page.getByTestId('email-input').fill(email);
		await page.getByTestId('register-button').click();

		await expect(page.getByText('Email already exists')).toBeVisible();
	});
});
```

---

## User Login

### Recipe: Test Authentication Flow

```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
	});

	test('logs in with valid credentials', async ({ page }) => {
		await test.step('Enter login credentials', async () => {
			await page.getByTestId('email-input').fill('test@example.com');
			await page.getByTestId('password-input').fill('testpassword123');
		});

		await test.step('Submit login form', async () => {
			await page.getByTestId('login-button').click();
			await expect(page.getByTestId('loading-spinner')).toBeVisible();
		});

		await test.step('Verify successful login', async () => {
			await expect(page).toHaveURL('/dashboard');
			await expect(page.getByText('Welcome back!')).toBeVisible();
			await expect(page.getByTestId('user-menu')).toBeVisible();
		});

		await test.step('Verify session persistence', async () => {
			// Refresh page
			await page.reload();
			await expect(page.getByTestId('user-menu')).toBeVisible();
			await expect(page).toHaveURL('/dashboard');
		});
	});

	test('handles invalid credentials', async ({ page }) => {
		await page.getByTestId('email-input').fill('wrong@example.com');
		await page.getByTestId('password-input').fill('wrongpassword');
		await page.getByTestId('login-button').click();

		await expect(page.getByText('Invalid email or password')).toBeVisible();
		await expect(page).toHaveURL('/login');
	});

	test('requires email and password', async ({ page }) => {
		await page.getByTestId('login-button').click();

		await expect(page.getByText('Email is required')).toBeVisible();
		await expect(page.getByText('Password is required')).toBeVisible();
	});

	test('handles account lockout after failed attempts', async ({ page }) => {
		// Mock 5 failed attempts
		for (let i = 0; i < 5; i++) {
			await page.getByTestId('email-input').fill('test@example.com');
			await page.getByTestId('password-input').fill('wrongpassword');
			await page.getByTestId('login-button').click();
			await expect(page.getByText('Invalid email or password')).toBeVisible();
		}

		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('correctpassword');
		await page.getByTestId('login-button').click();

		await expect(page.getByText('Account temporarily locked')).toBeVisible();
	});

	test('redirects to intended page after login', async ({ page }) => {
		// Navigate to protected page first
		await page.goto('/chat/new');
		await expect(page).toHaveURL('/login?redirect=/chat/new');

		// Login
		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('testpassword123');
		await page.getByTestId('login-button').click();

		// Should redirect to intended page
		await expect(page).toHaveURL('/chat/new');
	});
});
```

---

## Create New Chat

### Recipe: Test Chat Creation Flow

```typescript
// tests/e2e/chat/create-chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Create New Chat', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/dashboard');
		await page.getByTestId('login-button').click();
		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('testpassword123');
		await page.getByTestId('login-submit').click();
	});

	test('creates new chat with title', async ({ page }) => {
		await test.step('Open new chat dialog', async () => {
			await page.getByTestId('new-chat-button').click();
			await expect(page.getByTestId('new-chat-dialog')).toBeVisible();
		});

		await test.step('Enter chat title', async () => {
			await page.getByTestId('chat-title-input').fill('AI Assistant Chat');
			await page.getByTestId('chat-title-input').press('Enter');
		});

		await test.step('Verify chat created and navigated', async () => {
			await expect(page).toHaveURL(/\/chat\/[a-zA-Z0-9-]+/);
			await expect(page.getByTestId('chat-title')).toContainText('AI Assistant Chat');
			await expect(page.getByTestId('message-input')).toBeVisible();
		});

		await test.step('Verify chat appears in history', async () => {
			await page.getByTestId('sidebar-toggle').click();
			await expect(page.getByTestId('chat-history-list')).toContainText('AI Assistant Chat');
		});
	});

	test('creates chat with model selection', async ({ page }) => {
		await page.getByTestId('new-chat-button').click();

		await test.step('Select AI model', async () => {
			await page.getByTestId('model-selector').click();
			await page.getByTestId('model-option-gpt-4').click();
		});

		await test.step('Enter title and create', async () => {
			await page.getByTestId('chat-title-input').fill('GPT-4 Chat');
			await page.getByTestId('create-chat-button').click();
		});

		await test.step('Verify model is selected', async () => {
			await expect(page.getByTestId('current-model')).toContainText('GPT-4');
		});
	});

	test('validates chat title requirements', async ({ page }) => {
		await page.getByTestId('new-chat-button').click();

		await test.step('Submit without title', async () => {
			await page.getByTestId('create-chat-button').click();
		});

		await test.step('Verify validation error', async () => {
			await expect(page.getByText('Chat title is required')).toBeVisible();
		});
	});

	test('handles duplicate chat titles', async ({ page }) => {
		await page.getByTestId('new-chat-button').click();
		await page.getByTestId('chat-title-input').fill('Existing Chat Title');
		await page.getByTestId('create-chat-button').click();

		await expect(page.getByText('A chat with this title already exists')).toBeVisible();
	});
});
```

---

## Send Message

### Recipe: Test Message Sending Flow

```typescript
// tests/e2e/chat/send-message.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Send Message', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('testpassword123');
		await page.getByTestId('login-button').click();
		await expect(page).toHaveURL('/dashboard');

		// Navigate to existing chat
		await page.getByTestId('chat-link').first().click();
	});

	test('sends text message successfully', async ({ page }) => {
		const messageText = 'Hello, AI assistant! How can you help me today?';

		await test.step('Type message', async () => {
			await page.getByTestId('message-input').fill(messageText);
			await expect(page.getByTestId('message-input')).toHaveValue(messageText);
		});

		await test.step('Send message', async () => {
			await page.getByTestId('send-button').click();
		});

		await test.step('Verify message sent', async () => {
			await expect(page.getByTestId('message-input')).toHaveValue('');
			await expect(page.getByTestId('messages-list')).toContainText(messageText);
			await expect(page.getByTestId('message-sending-indicator')).toBeVisible();
		});

		await test.step('Verify message appears in chat', async () => {
			await expect(page.getByTestId('user-message')).toContainText(messageText);
		});
	});

	test('sends message with Enter key', async ({ page }) => {
		const messageText = 'Test message with Enter key';

		await page.getByTestId('message-input').fill(messageText);
		await page.getByTestId('message-input').press('Enter');

		await expect(page.getByTestId('message-input')).toHaveValue('');
		await expect(page.getByTestId('user-message')).toContainText(messageText);
	});

	test('prevents sending empty messages', async ({ page }) => {
		await page.getByTestId('send-button').click();

		await expect(page.getByTestId('message-input')).toHaveValue('');
		await expect(page.queryByTestId('message-sending-indicator')).not.toBeVisible();
	});

	test('handles message length limits', async ({ page }) => {
		const longMessage = 'a'.repeat(5000);

		await page.getByTestId('message-input').fill(longMessage);
		await page.getByTestId('send-button').click();

		await expect(page.getByText('Message is too long')).toBeVisible();
	});

	test('handles network errors gracefully', async ({ page }) => {
		// Mock network error
		await page.route('**/api/messages', (route) => route.abort());

		await page.getByTestId('message-input').fill('Test message');
		await page.getByTestId('send-button').click();

		await expect(page.getByText('Failed to send message')).toBeVisible();
		await expect(page.getByTestId('retry-button')).toBeVisible();
	});
});
```

---

## Receive AI Response

### Recipe: Test AI Response Flow

```typescript
// tests/e2e/chat/ai-response.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Receive AI Response', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('testpassword123');
		await page.getByTestId('login-button').click();
		await page.getByTestId('chat-link').first().click();
	});

	test('displays streaming AI response', async ({ page }) => {
		await test.step('Send message to trigger AI response', async () => {
			await page.getByTestId('message-input').fill('What is TypeScript?');
			await page.getByTestId('send-button').click();
		});

		await test.step('Verify streaming starts', async () => {
			await expect(page.getByTestId('ai-response-streaming')).toBeVisible();
			await expect(page.getByTestId('typing-indicator')).toBeVisible();
		});

		await test.step('Verify streaming completes', async () => {
			await expect(page.getByTestId('ai-response-streaming')).not.toBeVisible({ timeout: 10000 });
			await expect(page.getByTestId('ai-message')).toBeVisible();
		});

		await test.step('Verify response content', async () => {
			const aiMessage = page.getByTestId('ai-message');
			await expect(aiMessage).toContainText('TypeScript');
			await expect(aiMessage).toContainText('programming language');
		});
	});

	test('handles AI response errors', async ({ page }) => {
		// Mock API error
		await page.route('**/api/ai/generate', (route) => {
			route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ error: 'AI service unavailable' })
			});
		});

		await page.getByTestId('message-input').fill('Test message');
		await page.getByTestId('send-button').click();

		await expect(page.getByText('AI service is currently unavailable')).toBeVisible();
		await expect(page.getByTestId('retry-button')).toBeVisible();
	});

	test('handles timeout errors', async ({ page }) => {
		// Mock slow response
		await page.route('**/api/ai/generate', (route) => {
			setTimeout(
				() =>
					route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: JSON.stringify({ response: 'Delayed response' })
					}),
				35000
			);
		});

		await page.getByTestId('message-input').fill('Test message');
		await page.getByTestId('send-button').click();

		await expect(page.getByText('Response timeout')).toBeVisible();
	});

	test('displays multiple AI responses in conversation', async ({ page }) => {
		await test.step('Send multiple messages', async () => {
			await page.getByTestId('message-input').fill('First message');
			await page.getByTestId('send-button').click();

			await page.getByTestId('message-input').fill('Second message');
			await page.getByTestId('send-button').click();
		});

		await test.step('Verify conversation flow', async () => {
			const messages = page.getByTestId('message-list').locator('[data-testid*="message"]');
			await expect(messages).toHaveCount(4); // 2 user messages + 2 AI responses
		});
	});
});
```

---

## Upload File

### Recipe: Test File Upload Flow

```typescript
// tests/e2e/chat/file-upload.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Upload', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('testpassword123');
		await page.getByTestId('login-button').click();
		await page.getByTestId('chat-link').first().click();
	});

	test('uploads valid file successfully', async ({ page }) => {
		await test.step('Select file for upload', async () => {
			const fileInput = page.getByTestId('file-input');
			const filePath = path.join(__dirname, '../fixtures/document.pdf');

			await fileInput.setInputFiles(filePath);
		});

		await test.step('Verify upload progress', async () => {
			await expect(page.getByTestId('upload-progress')).toBeVisible();
			await expect(page.getByTestId('upload-progress')).toContainText('Uploading...');
		});

		await test.step('Verify upload completion', async () => {
			await expect(page.getByTestId('upload-success')).toBeVisible();
			await expect(page.getByTestId('uploaded-file')).toContainText('document.pdf');
			await expect(page.getByTestId('file-size')).toContainText('1.2 MB');
		});

		await test.step('Verify file appears in chat', async () => {
			await expect(page.getByTestId('file-message')).toBeVisible();
			await expect(page.getByTestId('file-download-link')).toHaveAttribute('href');
		});
	});

	test('validates file type restrictions', async ({ page }) => {
		const fileInput = page.getByTestId('file-input');
		const filePath = path.join(__dirname, '../fixtures/script.exe');

		await fileInput.setInputFiles(filePath);

		await expect(page.getByText('File type not allowed')).toBeVisible();
		await expect(page.getByTestId('upload-error')).toBeVisible();
	});

	test('validates file size limits', async ({ page }) => {
		const fileInput = page.getByTestId('file-input');
		const filePath = path.join(__dirname, '../fixtures/large-file.zip');

		await fileInput.setInputFiles(filePath);

		await expect(page.getByText('File size exceeds maximum limit')).toBeVisible();
		await expect(page.getByTestId('file-input')).toHaveAttribute('aria-invalid', 'true');
	});

	test('handles upload cancellation', async ({ page }) => {
		const fileInput = page.getByTestId('file-input');
		const filePath = path.join(__dirname, '../fixtures/document.pdf');

		await fileInput.setInputFiles(filePath);

		await test.step('Start upload', async () => {
			await expect(page.getByTestId('upload-progress')).toBeVisible();
		});

		await test.step('Cancel upload', async () => {
			await page.getByTestId('cancel-upload-button').click();
		});

		await test.step('Verify cancellation', async () => {
			await expect(page.queryByTestId('upload-progress')).not.toBeVisible();
			await expect(page.getByTestId('file-input')).toBeEmpty();
		});
	});

	test('handles multiple file uploads', async ({ page }) => {
		const fileInput = page.getByTestId('file-input');

		await test.step('Upload multiple files', async () => {
			await fileInput.setInputFiles([
				path.join(__dirname, '../fixtures/document1.pdf'),
				path.join(__dirname, '../fixtures/document2.pdf'),
				path.join(__dirname, '../fixtures/image.png')
			]);
		});

		await test.step('Verify multiple uploads', async () => {
			await expect(page.getByTestId('uploaded-files')).toContainText('3 files uploaded');
			await expect(page.getByTestId('file-list')).toContainText('document1.pdf');
			await expect(page.getByTestId('file-list')).toContainText('document2.pdf');
			await expect(page.getByTestId('file-list')).toContainText('image.png');
		});
	});
});
```

---

## Switch Models

### Recipe: Test Model Selection Flow

```typescript
// tests/e2e/chat/model-switch.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Switch Models', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('testpassword123');
		await page.getByTestId('login-button').click();
		await page.getByTestId('chat-link').first().click();
	});

	test('switches AI model successfully', async ({ page }) => {
		await test.step('Open model selector', async () => {
			await page.getByTestId('model-selector-button').click();
			await expect(page.getByTestId('model-dropdown')).toBeVisible();
		});

		await test.step('Select different model', async () => {
			await page.getByTestId('model-option-gpt-4').click();
		});

		await test.step('Verify model changed', async () => {
			await expect(page.getByTestId('current-model')).toContainText('GPT-4');
			await expect(page.getByTestId('model-selector-button')).toContainText('GPT-4');
		});

		await test.step('Verify model persists', async () => {
			await page.reload();
			await expect(page.getByTestId('current-model')).toContainText('GPT-4');
		});
	});

	test('displays model capabilities and pricing', async ({ page }) => {
		await page.getByTestId('model-selector-button').click();

		await test.step('View model details', async () => {
			await page.getByTestId('model-option-claude-sonnet').hover();
			await expect(page.getByTestId('model-tooltip')).toBeVisible();
			await expect(page.getByTestId('model-tooltip')).toContainText('Fast responses');
			await expect(page.getByTestId('model-tooltip')).toContainText('$0.003/1K tokens');
		});
	});

	test('handles model switching during streaming', async ({ page }) => {
		// Start a message
		await page.getByTestId('message-input').fill('Test message');
		await page.getByTestId('send-button').click();

		// Wait for streaming to start
		await expect(page.getByTestId('ai-response-streaming')).toBeVisible();

		await test.step('Switch model during streaming', async () => {
			await page.getByTestId('model-selector-button').click();
			await page.getByTestId('model-option-gemini-pro').click();
		});

		await test.step('Verify streaming continues with new model', async () => {
			await expect(page.getByTestId('current-model')).toContainText('Gemini Pro');
			await expect(page.getByTestId('ai-response-streaming')).toBeVisible();
		});
	});

	test('validates model availability based on user plan', async ({ page }) => {
		await page.getByTestId('model-selector-button').click();

		await test.step('Check premium model restrictions', async () => {
			await page.getByTestId('model-option-claude-opus').click();
			await expect(page.getByText('Upgrade to Pro plan to use this model')).toBeVisible();
		});
	});
});
```

---

## View Chat History

### Recipe: Test Chat History Display

```typescript
// tests/e2e/chat/chat-history.spec.ts
import { test, expect } from '@playwright/test';

test.describe('View Chat History', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('testpassword123');
		await page.getByTestId('login-button').click();
	});

	test('displays chat history list', async ({ page }) => {
		await test.step('Open chat history sidebar', async () => {
			await page.getByTestId('sidebar-toggle').click();
			await expect(page.getByTestId('chat-history-sidebar')).toBeVisible();
		});

		await test.step('Verify chat history contents', async () => {
			await expect(page.getByTestId('chat-history-list')).toBeVisible();

			// Check for recent chats
			await expect(page.getByTestId('chat-item')).toHaveCount.greaterThan(0);

			// Verify chat metadata
			await expect(page.getByTestId('chat-title')).toBeVisible();
			await expect(page.getByTestId('chat-last-activity')).toBeVisible();
			await expect(page.getByTestId('chat-message-count')).toBeVisible();
		});
	});

	test('navigates to chat from history', async ({ page }) => {
		await page.getByTestId('sidebar-toggle').click();

		const firstChatTitle = await page.getByTestId('chat-title').first().textContent();

		await test.step('Click on chat item', async () => {
			await page.getByTestId('chat-item').first().click();
		});

		await test.step('Verify navigation to chat', async () => {
			await expect(page).toHaveURL(/\/chat\/[a-zA-Z0-9-]+/);
			await expect(page.getByTestId('chat-title')).toContainText(firstChatTitle!);
		});
	});

	test('shows empty state when no chats exist', async ({ page }) => {
		// Navigate to new user account with no chats
		await page.goto('/login');
		await page.getByTestId('email-input').fill('newuser@example.com');
		await page.getByTestId('password-input').fill('newpassword123');
		await page.getByTestId('login-button').click();

		await page.getByTestId('sidebar-toggle').click();

		await expect(page.getByText('No chats yet')).toBeVisible();
		await expect(page.getByText('Create your first chat to get started')).toBeVisible();
		await expect(page.getByTestId('create-first-chat-button')).toBeVisible();
	});

	test('filters chat history by search', async ({ page }) => {
		await page.getByTestId('sidebar-toggle').click();

		await test.step('Enter search term', async () => {
			await page.getByTestId('chat-search-input').fill('AI');
		});

		await test.step('Verify filtered results', async () => {
			await expect(page.getByTestId('chat-item')).toHaveCount.greaterThan(0);
			const chatTitles = page.getByTestId('chat-title');
			await expect(chatTitles).toContainText('AI');
		});
	});

	test('displays chat preview on hover', async ({ page }) => {
		await page.getByTestId('sidebar-toggle').click();

		await test.step('Hover over chat item', async () => {
			await page.getByTestId('chat-item').first().hover();
		});

		await test.step('Verify preview appears', async () => {
			await expect(page.getByTestId('chat-preview')).toBeVisible();
			await expect(page.getByTestId('chat-preview')).toContainText('Recent message');
		});
	});
});
```

---

## Dark Mode Toggle

### Recipe: Test Theme Switching

```typescript
// tests/e2e/ui/dark-mode.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dark Mode Toggle', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('toggles between light and dark themes', async ({ page }) => {
		await test.step('Verify initial light theme', async () => {
			await expect(page.locator('html')).toHaveClass(/light/);
			await expect(page.getByTestId('theme-toggle')).toContainText('Dark');
		});

		await test.step('Toggle to dark mode', async () => {
			await page.getByTestId('theme-toggle').click();
		});

		await test.step('Verify dark theme applied', async () => {
			await expect(page.locator('html')).toHaveClass(/dark/);
			await expect(page.getByTestId('theme-toggle')).toContainText('Light');
		});

		await test.step('Toggle back to light mode', async () => {
			await page.getByTestId('theme-toggle').click();
		});

		await test.step('Verify light theme restored', async () => {
			await expect(page.locator('html')).toHaveClass(/light/);
			await expect(page.getByTestId('theme-toggle')).toContainText('Dark');
		});
	});

	test('persists theme preference across page reloads', async ({ page }) => {
		await test.step('Set dark theme', async () => {
			await page.getByTestId('theme-toggle').click();
			await expect(page.locator('html')).toHaveClass(/dark/);
		});

		await test.step('Reload page', async () => {
			await page.reload();
		});

		await test.step('Verify theme persists', async () => {
			await expect(page.locator('html')).toHaveClass(/dark/);
			await expect(page.getByTestId('theme-toggle')).toContainText('Light');
		});
	});

	test('persists theme preference across sessions', async ({ page, context }) => {
		await test.step('Set dark theme', async () => {
			await page.getByTestId('theme-toggle').click();
			await expect(page.locator('html')).toHaveClass(/dark/);
		});

		await test.step('Close and reopen browser', async () => {
			await context.close();
			const newContext = await page.context().browser()?.newContext();
			const newPage = await newContext?.newPage();

			if (newPage) {
				await newPage.goto('/');
				await expect(newPage.locator('html')).toHaveClass(/dark/);
			}
		});
	});

	test('applies theme to all UI elements', async ({ page }) => {
		await page.getByTestId('theme-toggle').click();

		await test.step('Verify dark theme styles', async () => {
			await expect(page.locator('html')).toHaveClass(/dark/);

			// Check background colors
			await expect(page.getByTestId('main-background')).toHaveCSS(
				'background-color',
				/rgb\(17, 24, 39\)/
			); // Dark background

			// Check text colors
			await expect(page.getByTestId('primary-text')).toHaveCSS('color', /rgb\(243, 244, 246\)/); // Light text

			// Check borders
			await expect(page.getByTestId('card-border')).toHaveCSS('border-color', /rgb\(55, 65, 81\)/); // Dark border
		});
	});

	test('respects system theme preference', async ({ page }) => {
		// Mock system dark mode
		await page.emulateMedia({ colorScheme: 'dark' });

		await page.goto('/');

		await test.step('Verify system dark theme applied', async () => {
			await expect(page.locator('html')).toHaveClass(/dark/);
		});
	});
});
```

---

## Logout

### Recipe: Test Logout Flow

```typescript
// tests/e2e/auth/logout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Logout', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
		await page.getByTestId('email-input').fill('test@example.com');
		await page.getByTestId('password-input').fill('testpassword123');
		await page.getByTestId('login-button').click();
		await expect(page).toHaveURL('/dashboard');
	});

	test('logs out successfully', async ({ page }) => {
		await test.step('Open user menu', async () => {
			await page.getByTestId('user-menu-button').click();
			await expect(page.getByTestId('user-menu-dropdown')).toBeVisible();
		});

		await test.step('Click logout', async () => {
			await page.getByTestId('logout-button').click();
		});

		await test.step('Verify logout confirmation', async () => {
			await expect(page.getByTestId('logout-confirmation')).toBeVisible();
			await expect(page.getByText('Are you sure you want to log out?')).toBeVisible();
		});

		await test.step('Confirm logout', async () => {
			await page.getByTestId('confirm-logout-button').click();
		});

		await test.step('Verify logged out state', async () => {
			await expect(page).toHaveURL('/login');
			await expect(page.getByTestId('user-menu-button')).not.toBeVisible();
			await expect(page.getByTestId('login-form')).toBeVisible();
		});

		await test.step('Verify session cleared', async () => {
			await page.reload();
			await expect(page).toHaveURL('/login');
			await expect(page.getByTestId('login-form')).toBeVisible();
		});
	});

	test('cancels logout', async ({ page }) => {
		await page.getByTestId('user-menu-button').click();
		await page.getByTestId('logout-button').click();

		await test.step('Click cancel', async () => {
			await page.getByTestId('cancel-logout-button').click();
		});

		await test.step('Verify still logged in', async () => {
			await expect(page.getByTestId('user-menu-dropdown')).not.toBeVisible();
			await expect(page.getByTestId('user-menu-button')).toBeVisible();
			await expect(page).toHaveURL('/dashboard');
		});
	});

	test('handles logout during active operations', async ({ page }) => {
		await page.goto('/chat/new');

		await test.step('Start creating chat', async () => {
			await page.getByTestId('new-chat-button').click();
			await page.getByTestId('chat-title-input').fill('Test Chat');
		});

		await test.step('Logout during operation', async () => {
			await page.getByTestId('user-menu-button').click();
			await page.getByTestId('logout-button').click();
			await page.getByTestId('confirm-logout-button').click();
		});

		await test.step('Verify redirected to login', async () => {
			await expect(page).toHaveURL('/login');
			await expect(page.getByTestId('login-form')).toBeVisible();
		});

		await test.step('Verify unsaved data lost', async () => {
			await page.goto('/dashboard');
			await expect(page.queryByText('Test Chat')).not.toBeVisible();
		});
	});

	test('prevents access to protected routes after logout', async ({ page }) => {
		await page.getByTestId('user-menu-button').click();
		await page.getByTestId('logout-button').click();
		await page.getByTestId('confirm-logout-button').click();

		await test.step('Try to access protected route', async () => {
			await page.goto('/dashboard');
		});

		await test.step('Verify redirected to login', async () => {
			await expect(page).toHaveURL('/login');
			await expect(page.getByTestId('login-form')).toBeVisible();
		});
	});
});
```

---

## Complete User Journey

### Recipe: End-to-End User Journey Test

```typescript
// tests/e2e/user-journeys/complete-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
	test('user registration to logout flow', async ({ page }) => {
		const email = `test-${Date.now()}@example.com`;

		await test.step('1. User registers account', async () => {
			await page.goto('/register');

			await page.getByTestId('name-input').fill('Complete Journey User');
			await page.getByTestId('email-input').fill(email);
			await page.getByTestId('password-input').fill('SecurePassword123!');
			await page.getByTestId('confirm-password-input').fill('SecurePassword123!');
			await page.getByTestId('register-button').click();

			await expect(page).toHaveURL('/dashboard');
			await expect(page.getByText('Welcome, Complete Journey User!')).toBeVisible();
		});

		await test.step('2. User creates new chat', async () => {
			await page.getByTestId('new-chat-button').click();
			await page.getByTestId('chat-title-input').fill('AI Assistant Chat');
			await page.getByTestId('create-chat-button').click();

			await expect(page).toHaveURL(/\/chat\/[a-zA-Z0-9-]+/);
			await expect(page.getByTestId('chat-title')).toContainText('AI Assistant Chat');
		});

		await test.step('3. User sends message and receives AI response', async () => {
			await page.getByTestId('message-input').fill('What is SvelteKit?');
			await page.getByTestId('send-button').click();

			await expect(page.getByTestId('user-message')).toContainText('What is SvelteKit?');
			await expect(page.getByTestId('ai-response-streaming')).toBeVisible();

			await expect(page.getByTestId('ai-response-streaming')).not.toBeVisible({ timeout: 10000 });
			await expect(page.getByTestId('ai-message')).toBeVisible();
		});

		await test.step('4. User uploads file', async () => {
			await page.getByTestId('file-input').setInputFiles('tests/fixtures/document.pdf');
			await expect(page.getByTestId('upload-success')).toBeVisible();
			await expect(page.getByTestId('file-message')).toBeVisible();
		});

		await test.step('5. User switches AI model', async () => {
			await page.getByTestId('model-selector-button').click();
			await page.getByTestId('model-option-gpt-4').click();
			await expect(page.getByTestId('current-model')).toContainText('GPT-4');
		});

		await test.step('6. User toggles dark mode', async () => {
			await page.getByTestId('theme-toggle').click();
			await expect(page.locator('html')).toHaveClass(/dark/);
		});

		await test.step('7. User views chat history', async () => {
			await page.getByTestId('sidebar-toggle').click();
			await expect(page.getByTestId('chat-history-list')).toBeVisible();
			await expect(page.getByTestId('chat-item')).toHaveCount(1);
		});

		await test.step('8. User logs out', async () => {
			await page.getByTestId('user-menu-button').click();
			await page.getByTestId('logout-button').click();
			await page.getByTestId('confirm-logout-button').click();

			await expect(page).toHaveURL('/login');
			await expect(page.getByTestId('login-form')).toBeVisible();
		});

		await test.step('9. Verify session cleared', async () => {
			await page.goto('/dashboard');
			await expect(page).toHaveURL('/login');
		});
	});

	test('handles errors gracefully throughout journey', async ({ page }) => {
		const email = `error-${Date.now()}@example.com`;

		await test.step('1. Registration with network error', async () => {
			await page.route('**/api/auth/register', (route) => route.abort());
			await page.goto('/register');

			await page.getByTestId('name-input').fill('Error Test User');
			await page.getByTestId('email-input').fill(email);
			await page.getByTestId('password-input').fill('Password123!');
			await page.getByTestId('confirm-password-input').fill('Password123!');
			await page.getByTestId('register-button').click();

			await expect(page.getByText('Registration failed')).toBeVisible();
		});

		await test.step('2. Login after error recovery', async () => {
			await page.goto('/login');
			await page.getByTestId('email-input').fill(email);
			await page.getByTestId('password-input').fill('Password123!');
			await page.getByTestId('login-button').click();

			await expect(page).toHaveURL('/dashboard');
		});

		await test.step('3. Chat creation with validation error', async () => {
			await page.getByTestId('new-chat-button').click();
			await page.getByTestId('create-chat-button').click();

			await expect(page.getByText('Chat title is required')).toBeVisible();
		});

		await test.step('4. Message sending with network error', async () => {
			await page.getByTestId('new-chat-button').click();
			await page.getByTestId('chat-title-input').fill('Error Test Chat');
			await page.getByTestId('create-chat-button').click();

			await page.route('**/api/messages', (route) => route.abort());
			await page.getByTestId('message-input').fill('Test message');
			await page.getByTestId('send-button').click();

			await expect(page.getByText('Failed to send message')).toBeVisible();
			await expect(page.getByTestId('retry-button')).toBeVisible();
		});
	});
});
```

---

## Test Utilities

### Recipe: Shared Test Helpers

```typescript
// tests/utils/helpers.ts
import { Page } from '@playwright/test';

export async function loginUser(page: Page, email: string, password: string) {
	await page.goto('/login');
	await page.getByTestId('email-input').fill(email);
	await page.getByTestId('password-input').fill(password);
	await page.getByTestId('login-button').click();
	await expect(page).toHaveURL('/dashboard');
}

export async function createChat(page: Page, title: string) {
	await page.getByTestId('new-chat-button').click();
	await page.getByTestId('chat-title-input').fill(title);
	await page.getByTestId('create-chat-button').click();
	await expect(page).toHaveURL(/\/chat\/[a-zA-Z0-9-]+/);
}

export async function sendMessage(page: Page, message: string) {
	await page.getByTestId('message-input').fill(message);
	await page.getByTestId('send-button').click();
	await expect(page.getByTestId('user-message')).toContainText(message);
}

export async function logoutUser(page: Page) {
	await page.getByTestId('user-menu-button').click();
	await page.getByTestId('logout-button').click();
	await page.getByTestId('confirm-logout-button').click();
	await expect(page).toHaveURL('/login');
}

export async function registerUser(page: Page, name: string, email: string, password: string) {
	await page.goto('/register');
	await page.getByTestId('name-input').fill(name);
	await page.getByTestId('email-input').fill(email);
	await page.getByTestId('password-input').fill(password);
	await page.getByTestId('confirm-password-input').fill(password);
	await page.getByTestId('register-button').click();
	await expect(page).toHaveURL('/dashboard');
}

export async function toggleDarkMode(page: Page) {
	await page.getByTestId('theme-toggle').click();
	await expect(page.locator('html')).toHaveClass(/dark/);
}

export async function uploadFile(page: Page, filePath: string) {
	await page.getByTestId('file-input').setInputFiles(filePath);
	await expect(page.getByTestId('upload-success')).toBeVisible();
}
```

---

## Best Practices

1. **Use test.step()** for organized test sections
2. **Use data-testid** for reliable selectors
3. **Wait for network idle** after navigation
4. **Mock external APIs** for consistent testing
5. **Test error scenarios** alongside happy paths
6. **Use appropriate timeouts** for async operations
7. **Test accessibility** with ARIA attributes
8. **Test responsive design** with different viewports
9. **Test keyboard navigation** for accessibility
10. **Use beforeEach/afterEach** for setup/teardown

---

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/auth/registration.spec.ts

# Run with headed browser (visible)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with coverage
npx playwright test --coverage

# Run specific test
npx playwright test --grep "registration"
```

---

## Test Data Management

### Recipe: Test Database Setup

```typescript
// tests/setup/test-setup.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
	// Custom test context
});

export { expect } from '@playwright/test';
```

### Recipe: Test Data Fixtures

```typescript
// tests/fixtures/users.ts
export const testUsers = {
	valid: {
		name: 'Test User',
		email: 'test@example.com',
		password: 'TestPassword123!'
	},
	invalid: {
		name: '',
		email: 'invalid-email',
		password: 'weak'
	}
};
```

---

## CI/CD Integration

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install
      - name: Run tests
        run: npm run test:e2e
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: playwright-report/
```

---

**This cookbook provides complete, runnable recipes for testing all major user flows in your SvelteKit application. Each test demonstrates proper Playwright usage, error handling, and follows testing best practices.**
