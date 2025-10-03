# Vitest Unit Testing Basics

## Introduction

Unit testing is a fundamental practice in software development that involves testing individual units or components of your code in isolation. In SvelteKit applications, this typically means testing utility functions, business logic, and other pure functions that don't depend on external systems.

Vitest is the modern testing framework designed specifically for Vite-based projects like SvelteKit. It offers:

- Fast startup times
- Native ES modules support
- Built-in TypeScript support
- Jest-compatible API
- Excellent developer experience

## Setup and Configuration

Based on your project's `vitest.config.ts`, you have separate test projects for different testing scenarios:

```typescript
// vitest.config.ts (from your codebase)
export default defineConfig({
	test: {
		globals: true,
		passWithNoTests: true,
		projects: [
			{
				name: 'unit',
				environment: 'node',
				include: ['src/**/*.unit.{test,spec}.{js,ts}', 'src/lib/utils/**/*.{test,spec}.{js,ts}'],
				exclude: [
					'**/node_modules/**',
					'**/dist/**',
					'**/.svelte-kit/**',
					'**/build/**',
					'**/*.svelte.{test,spec}.{js,ts}',
					'**/*.integration.{test,spec}.{js,ts}'
				]
			}
			// ... other projects for integration, component, and storybook tests
		]
	}
});
```

## Example 1: Testing a Simple Pure Function

Let's create a test for a utility function. First, let's create a simple utility function to test:

```typescript
// src/lib/utils/string-helpers.ts
export function capitalize(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str;
	return str.slice(0, maxLength) + '...';
}

export function slugify(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
```

Now let's create comprehensive tests for these functions:

```typescript
// src/lib/utils/string-helpers.unit.test.ts
import { describe, it, expect } from 'vitest';
import { capitalize, truncate, slugify } from './string-helpers';

describe('capitalize', () => {
	it('should capitalize the first letter of a lowercase string', () => {
		expect(capitalize('hello')).toBe('Hello');
	});

	it('should lowercase the rest of the string', () => {
		expect(capitalize('HELLO')).toBe('Hello');
	});

	it('should handle single character strings', () => {
		expect(capitalize('a')).toBe('A');
	});

	it('should return empty string unchanged', () => {
		expect(capitalize('')).toBe('');
	});

	it('should handle strings with only spaces', () => {
		expect(capitalize('   ')).toBe('   ');
	});
});

describe('truncate', () => {
	it('should return the string unchanged if it is shorter than maxLength', () => {
		expect(truncate('hello', 10)).toBe('hello');
	});

	it('should truncate the string and add ellipsis if it exceeds maxLength', () => {
		expect(truncate('hello world', 8)).toBe('hello...');
	});

	it('should handle exact maxLength correctly', () => {
		expect(truncate('hello', 5)).toBe('hello');
		expect(truncate('hello!', 5)).toBe('hel...');
	});

	it('should handle edge cases', () => {
		expect(truncate('', 5)).toBe('');
		expect(truncate('a', 0)).toBe('...');
	});
});

describe('slugify', () => {
	it('should convert spaces to hyphens', () => {
		expect(slugify('hello world')).toBe('hello-world');
	});

	it('should convert to lowercase', () => {
		expect(slugify('Hello World')).toBe('hello-world');
	});

	it('should remove special characters', () => {
		expect(slugify('Hello, World!')).toBe('hello-world');
	});

	it('should handle multiple spaces and special characters', () => {
		expect(slugify('Hello   World!!!')).toBe('hello-world');
	});

	it('should remove leading and trailing hyphens', () => {
		expect(slugify(' hello world ')).toBe('hello-world');
	});

	it('should handle empty strings', () => {
		expect(slugify('')).toBe('');
	});

	it('should handle strings with only special characters', () => {
		expect(slugify('!!!')).toBe('');
	});
});
```

## Example 2: Testing with describe blocks

You can organize tests using nested `describe` blocks for better structure:

```typescript
// src/lib/utils/date-helpers.unit.test.ts
import { describe, it, expect } from 'vitest';

describe('Date Helpers', () => {
	describe('formatDate', () => {
		it('should format date in YYYY-MM-DD format', () => {
			// Test implementation
		});

		it('should handle invalid dates', () => {
			// Test implementation
		});
	});

	describe('isValidDate', () => {
		it('should return true for valid dates', () => {
			// Test implementation
		});

		it('should return false for invalid dates', () => {
			// Test implementation
		});
	});
});
```

## Example 3: Using test.each for Parameterized Tests

When you have similar tests with different inputs, use `test.each` to avoid duplication:

```typescript
// src/lib/utils/math-helpers.unit.test.ts
import { describe, it, expect, test } from 'vitest';

function add(a: number, b: number): number {
	return a + b;
}

function multiply(a: number, b: number): number {
	return a * b;
}

describe('Math Helpers', () => {
	describe('add', () => {
		test.each([
			[1, 1, 2],
			[1, 2, 3],
			[2, 2, 4],
			[0, 0, 0],
			[-1, 1, 0],
			[-1, -1, -2]
		])('add(%i, %i) should return %i', (a, b, expected) => {
			expect(add(a, b)).toBe(expected);
		});
	});

	describe('multiply', () => {
		test.each([
			[1, 1, 1],
			[1, 2, 2],
			[2, 3, 6],
			[0, 5, 0],
			[-1, 1, -1],
			[-2, -3, 6]
		])('multiply(%i, %i) should return %i', (a, b, expected) => {
			expect(multiply(a, b)).toBe(expected);
		});
	});
});
```

## Example 4: Testing Error Cases

Test functions that throw errors using `expect().toThrow()`:

```typescript
// src/lib/utils/validation-helpers.ts
export function validateEmail(email: string): void {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		throw new Error('Invalid email format');
	}
}

export function validatePassword(password: string): void {
	if (password.length < 8) {
		throw new Error('Password must be at least 8 characters long');
	}
	if (!/[A-Z]/.test(password)) {
		throw new Error('Password must contain at least one uppercase letter');
	}
	if (!/[a-z]/.test(password)) {
		throw new Error('Password must contain at least one lowercase letter');
	}
	if (!/\d/.test(password)) {
		throw new Error('Password must contain at least one number');
	}
}
```

```typescript
// src/lib/utils/validation-helpers.unit.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from './validation-helpers';

describe('validateEmail', () => {
	it('should not throw for valid email addresses', () => {
		expect(() => validateEmail('user@example.com')).not.toThrow();
		expect(() => validateEmail('test.email+tag@domain.co.uk')).not.toThrow();
	});

	it('should throw for invalid email addresses', () => {
		expect(() => validateEmail('invalid-email')).toThrow('Invalid email format');
		expect(() => validateEmail('')).toThrow('Invalid email format');
		expect(() => validateEmail('@example.com')).toThrow('Invalid email format');
		expect(() => validateEmail('user@')).toThrow('Invalid email format');
	});
});

describe('validatePassword', () => {
	it('should not throw for valid passwords', () => {
		expect(() => validatePassword('ValidPass123')).not.toThrow();
		expect(() => validatePassword('AnotherValid1')).not.toThrow();
	});

	it('should throw for passwords that are too short', () => {
		expect(() => validatePassword('Short1')).toThrow('Password must be at least 8 characters long');
	});

	it('should throw for passwords without uppercase letters', () => {
		expect(() => validatePassword('lowercase123')).toThrow(
			'Password must contain at least one uppercase letter'
		);
	});

	it('should throw for passwords without lowercase letters', () => {
		expect(() => validatePassword('UPPERCASE123')).toThrow(
			'Password must contain at least one lowercase letter'
		);
	});

	it('should throw for passwords without numbers', () => {
		expect(() => validatePassword('PasswordOnly')).toThrow(
			'Password must contain at least one number'
		);
	});
});
```

## Example 5: Async Function Testing

Test asynchronous functions using `async/await` in your tests:

```typescript
// src/lib/utils/async-helpers.ts
export async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry<T>(
	url: string,
	options: RequestInit = {},
	maxRetries: number = 3
): Promise<T> {
	let lastError: Error;

	for (let i = 0; i < maxRetries; i++) {
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			return await response.json();
		} catch (error) {
			lastError = error as Error;
			if (i < maxRetries - 1) {
				await delay(1000 * (i + 1)); // Exponential backoff
			}
		}
	}

	throw lastError!;
}
```

```typescript
// src/lib/utils/async-helpers.unit.test.ts
import { describe, it, expect, vi } from 'vitest';
import { delay, fetchWithRetry } from './async-helpers';

// Mock fetch globally
global.fetch = vi.fn();

describe('delay', () => {
	it('should resolve after the specified delay', async () => {
		const start = Date.now();
		await delay(100);
		const end = Date.now();
		expect(end - start).toBeGreaterThanOrEqual(95);
		expect(end - start).toBeLessThan(120);
	});
});

describe('fetchWithRetry', () => {
	const mockFetch = vi.mocked(fetch);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return data on successful first attempt', async () => {
		const mockData = { id: 1, name: 'Test' };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(mockData)
		} as Response);

		const result = await fetchWithRetry('https://api.example.com/data');
		expect(result).toEqual(mockData);
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it('should retry on failure and succeed on second attempt', async () => {
		const mockData = { id: 1, name: 'Test' };

		mockFetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(mockData)
		} as Response);

		const result = await fetchWithRetry('https://api.example.com/data', {}, 2);
		expect(result).toEqual(mockData);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it('should throw error after max retries', async () => {
		mockFetch.mockRejectedValue(new Error('Network error'));

		await expect(fetchWithRetry('https://api.example.com/data', {}, 2)).rejects.toThrow(
			'Network error'
		);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it('should throw error for non-ok HTTP responses', async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 404,
			statusText: 'Not Found'
		} as Response);

		await expect(fetchWithRetry('https://api.example.com/data')).rejects.toThrow(
			'HTTP 404: Not Found'
		);
	});
});
```

### Example 6: Advanced Async Testing with Fake Timers

Test time-dependent code using Vitest's timer mocks:

```typescript
// src/lib/utils/throttle.ts
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	let lastFunc: NodeJS.Timeout;
	let lastRan: number;

	return function (this: any, ...args: Parameters<T>) {
		const context = this;

		if (!inThrottle) {
			func.apply(context, args);
			lastRan = Date.now();
			inThrottle = true;

			setTimeout(() => {
				inThrottle = false;
			}, limit);
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(
				() => {
					if (Date.now() - lastRan >= limit) {
						func.apply(context, args);
						lastRan = Date.now();
					}
				},
				limit - (Date.now() - lastRan)
			);
		}
	};
}

export function createTimeoutPromise<T>(value: T, delay: number): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(value), delay);
	});
}
```

```typescript
// src/lib/utils/throttle.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle, createTimeoutPromise } from './throttle';

describe('Throttle', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('throttle', () => {
		it('should execute function immediately on first call', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 1000);

			throttledFn('arg1', 'arg2');

			expect(mockFn).toHaveBeenCalledTimes(1);
			expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
		});

		it('should prevent execution during throttle period', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 1000);

			throttledFn();
			throttledFn();
			throttledFn();

			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should execute function again after throttle period', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 1000);

			throttledFn();
			expect(mockFn).toHaveBeenCalledTimes(1);

			vi.advanceTimersByTime(1000);

			throttledFn();
			expect(mockFn).toHaveBeenCalledTimes(2);
		});

		it('should queue the last call during throttle period', () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 1000);

			throttledFn('first');
			vi.advanceTimersByTime(500);
			throttledFn('second');
			vi.advanceTimersByTime(600); // Total: 1100ms

			expect(mockFn).toHaveBeenCalledTimes(2);
			expect(mockFn).toHaveBeenNthCalledWith(1, 'first');
			expect(mockFn).toHaveBeenNthCalledWith(2, 'second');
		});

		it('should maintain correct context', () => {
			const context = { value: 42 };
			const mockFn = vi.fn(function (this: typeof context) {
				return this.value;
			});

			const throttledFn = throttle(mockFn, 1000);

			throttledFn.call(context);
			expect(mockFn).toHaveReturnedWith(42);
		});
	});

	describe('createTimeoutPromise', () => {
		it('should resolve with value after specified delay', async () => {
			const promise = createTimeoutPromise('success', 1000);

			vi.advanceTimersByTime(999);
			// Promise should not be resolved yet

			vi.advanceTimersByTime(1);
			// Now promise should be resolved

			await expect(promise).resolves.toBe('success');
		});

		it('should handle zero delay', async () => {
			const promise = createTimeoutPromise(42, 0);

			await expect(promise).resolves.toBe(42);
		});

		it('should handle complex values', async () => {
			const complexValue = { data: [1, 2, 3], metadata: { timestamp: Date.now() } };
			const promise = createTimeoutPromise(complexValue, 500);

			vi.advanceTimersByTime(500);

			await expect(promise).resolves.toEqual(complexValue);
		});
	});
});
```

## Best Practices

### Test Naming Conventions

- Use descriptive names that explain what the test verifies
- Follow the pattern: `should [expected behavior] when [condition]`
- Example: `should return user data when valid ID is provided`

### Test Organization

- Group related tests in `describe` blocks
- Keep test files co-located with the code they test
- Use the `.unit.test.ts` extension for unit tests

### What Makes a Good Unit Test

- **Isolated**: Tests should not depend on external systems
- **Fast**: Unit tests should run quickly
- **Reliable**: Tests should pass consistently
- **Readable**: Clear intent and assertions
- **Maintainable**: Easy to update when code changes

### Coverage Expectations

Your `vitest.config.ts` sets coverage thresholds at 80% for lines, functions, branches, and statements. Aim for:

- High statement coverage (80%+)
- Good branch coverage (focus on edge cases)
- Meaningful function coverage (test public APIs)

## Troubleshooting

### Common Issues and Solutions

**Test timeouts:**

- Increase timeout in `vitest.config.ts`: `testTimeout: 10000`
- Or per test: `it('slow test', async () => { ... }, 10000)`

**Mocking issues:**

- Clear mocks between tests: `beforeEach(() => vi.clearAllMocks())`
- Reset mock implementations: `vi.mockReset()`

**TypeScript issues:**

- Ensure test files have `.test.ts` extension for TypeScript support
- Import types properly for mocked functions

**Async test issues:**

- Always use `async/await` or return promises
- Use `expect.poll()` for polling assertions

**Import resolution:**

- Ensure path aliases in `vitest.config.ts` match your `tsconfig.json`
- Use relative imports if aliases don't work in tests

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npx vitest

# Run specific test file
npx vitest src/lib/utils/string-helpers.unit.test.ts

# Run tests with coverage
npx vitest --coverage

# Run tests in specific project
npx vitest --project=unit
```

### Debugging Tests

- Use `console.log` in tests (they will appear in test output)
- Use `--reporter=verbose` for detailed output
- Use `vi.spyOn(console, 'log')` to test console output
- Set breakpoints in your IDE and run tests with `--inspect-brk`

This foundation will help you write comprehensive, maintainable unit tests for your SvelteKit application. The next guide covers mocking strategies for more complex testing scenarios.
