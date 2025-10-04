# Vitest Mocking Strategies

## Introduction

Mocking is essential for unit testing when your code depends on external systems, APIs, or complex dependencies. Vitest provides powerful mocking capabilities that help isolate code under test and make tests predictable and fast.

### When and Why to Use Mocks

**When to mock:**

- External API calls
- Database operations
- File system operations
- Third-party libraries
- Complex object instantiations
- Time-dependent functions

**Why mocking matters:**

- Tests run faster without network/database calls
- Tests are more reliable and predictable
- Tests focus on the code logic, not external dependencies
- Tests can run in isolation

### Mock Philosophy

- Mock what you don't own (external APIs, databases)
- Test what you do own (your business logic)
- Prefer spies over full mocks when possible
- Clean up mocks properly to avoid test interference

## Example 1: Mocking Functions with vi.fn()

`vi.fn()` creates a mock function that tracks calls, arguments, and return values.

```typescript
// src/lib/utils/api-helpers.ts
export async function fetchUserData(userId: string) {
	const response = await fetch(`/api/users/${userId}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch user: ${response.status}`);
	}
	return response.json();
}

export function processUserData(rawData: any) {
	return {
		id: rawData.id,
		name: rawData.name,
		email: rawData.email,
		isActive: rawData.status === 'active'
	};
}

export async function getProcessedUser(userId: string) {
	const rawData = await fetchUserData(userId);
	return processUserData(rawData);
}
```

```typescript
// src/lib/utils/api-helpers.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUserData, processUserData, getProcessedUser } from './api-helpers';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('API Helpers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('fetchUserData', () => {
		it('should return user data for successful response', async () => {
			const mockUserData = { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' };
			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockUserData)
			});

			const result = await fetchUserData('1');

			expect(fetchMock).toHaveBeenCalledWith('/api/users/1');
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockUserData);
		});

		it('should throw error for failed response', async () => {
			fetchMock.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found'
			});

			await expect(fetchUserData('999')).rejects.toThrow('Failed to fetch user: 404');
			expect(fetchMock).toHaveBeenCalledWith('/api/users/999');
		});
	});

	describe('processUserData', () => {
		it('should transform raw data correctly', () => {
			const rawData = { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' };
			const expected = { id: 1, name: 'John Doe', email: 'john@example.com', isActive: true };

			const result = processUserData(rawData);

			expect(result).toEqual(expected);
		});

		it('should handle inactive users', () => {
			const rawData = { id: 2, name: 'Jane Doe', email: 'jane@example.com', status: 'inactive' };
			const expected = { id: 2, name: 'Jane Doe', email: 'jane@example.com', isActive: false };

			const result = processUserData(rawData);

			expect(result).toEqual(expected);
		});
	});

	describe('getProcessedUser', () => {
		it('should fetch and process user data', async () => {
			const mockRawData = { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' };
			const expectedProcessedData = {
				id: 1,
				name: 'John Doe',
				email: 'john@example.com',
				isActive: true
			};

			// Mock the fetchUserData function
			const fetchUserDataMock = vi.fn().mockResolvedValue(mockRawData);
			vi.doMock('./api-helpers', () => ({
				fetchUserData: fetchUserDataMock,
				processUserData,
				getProcessedUser
			}));

			// Re-import to use the mocked version
			const { getProcessedUser: getProcessedUserMocked } = await import('./api-helpers');

			const result = await getProcessedUserMocked('1');

			expect(fetchUserDataMock).toHaveBeenCalledWith('1');
			expect(result).toEqual(expectedProcessedData);
		});
	});
});
```

## Example 2: Mocking Modules with vi.mock()

Use `vi.mock()` to mock entire modules at the module level.

```typescript
// src/lib/services/email-service.ts
export interface EmailOptions {
	to: string;
	subject: string;
	body: string;
}

export class EmailService {
	async sendEmail(options: EmailOptions): Promise<boolean> {
		// In real implementation, this would send an actual email
		console.log(`Sending email to ${options.to}: ${options.subject}`);
		return true;
	}

	async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
		return this.sendEmail({
			to: email,
			subject: 'Welcome!',
			body: `Welcome ${name}!`
		});
	}
}
```

```typescript
// src/lib/services/user-service.ts
import { EmailService } from './email-service';

export interface User {
	id: string;
	name: string;
	email: string;
}

export class UserService {
	constructor(private emailService: EmailService = new EmailService()) {}

	async createUser(name: string, email: string): Promise<User> {
		const user = {
			id: Math.random().toString(36).substr(2, 9),
			name,
			email
		};

		// Send welcome email
		await this.emailService.sendWelcomeEmail(email, name);

		return user;
	}

	async updateUserEmail(userId: string, newEmail: string): Promise<User> {
		// In real implementation, this would update the database
		const user = {
			id: userId,
			name: 'Updated User',
			email: newEmail
		};

		// Send notification email
		await this.emailService.sendEmail({
			to: newEmail,
			subject: 'Email Updated',
			body: 'Your email has been updated successfully.'
		});

		return user;
	}
}
```

```typescript
// src/lib/services/user-service.unit.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the email service module
vi.mock('./email-service');

import { UserService } from './user-service';
import { EmailService } from './email-service';

describe('UserService', () => {
	let emailServiceMock: any;
	let userService: UserService;

	beforeEach(() => {
		// Clear all mocks
		vi.clearAllMocks();

		// Get the mocked EmailService
		emailServiceMock = vi.mocked(EmailService.prototype);

		// Create UserService instance
		userService = new UserService(emailServiceMock);
	});

	describe('createUser', () => {
		it('should create a user and send welcome email', async () => {
			// Mock the sendWelcomeEmail method
			emailServiceMock.sendWelcomeEmail.mockResolvedValue(true);

			const result = await userService.createUser('John Doe', 'john@example.com');

			expect(result).toHaveProperty('id');
			expect(result.name).toBe('John Doe');
			expect(result.email).toBe('john@example.com');

			expect(emailServiceMock.sendWelcomeEmail).toHaveBeenCalledWith(
				'john@example.com',
				'John Doe'
			);
			expect(emailServiceMock.sendWelcomeEmail).toHaveBeenCalledTimes(1);
		});

		it('should handle email service errors', async () => {
			emailServiceMock.sendWelcomeEmail.mockRejectedValue(new Error('Email service failed'));

			await expect(userService.createUser('John Doe', 'john@example.com')).rejects.toThrow(
				'Email service failed'
			);
		});
	});

	describe('updateUserEmail', () => {
		it('should update user email and send notification', async () => {
			emailServiceMock.sendEmail.mockResolvedValue(true);

			const result = await userService.updateUserEmail('user123', 'newemail@example.com');

			expect(result.id).toBe('user123');
			expect(result.email).toBe('newemail@example.com');

			expect(emailServiceMock.sendEmail).toHaveBeenCalledWith({
				to: 'newemail@example.com',
				subject: 'Email Updated',
				body: 'Your email has been updated successfully.'
			});
		});
	});
});
```

## Example 3: Mocking Specific Functions with vi.spyOn()

`vi.spyOn()` allows you to spy on existing methods without completely replacing them.

```typescript
// src/lib/utils/logger.ts
export class Logger {
	private logs: string[] = [];

	info(message: string): void {
		const logEntry = `[INFO] ${new Date().toISOString()}: ${message}`;
		console.log(logEntry);
		this.logs.push(logEntry);
	}

	error(message: string): void {
		const logEntry = `[ERROR] ${new Date().toISOString()}: ${message}`;
		console.error(logEntry);
		this.logs.push(logEntry);
	}

	getLogs(): string[] {
		return [...this.logs];
	}
}

export const logger = new Logger();
```

```typescript
// src/lib/services/data-processor.ts
import { logger } from '../utils/logger';

export interface DataItem {
	id: string;
	value: number;
	status: 'valid' | 'invalid';
}

export class DataProcessor {
	processItem(item: DataItem): DataItem {
		try {
			if (!item.id || typeof item.value !== 'number') {
				logger.error(`Invalid item: ${JSON.stringify(item)}`);
				return { ...item, status: 'invalid' };
			}

			const processedValue = item.value * 2;
			logger.info(`Processed item ${item.id}: ${item.value} -> ${processedValue}`);

			return {
				...item,
				value: processedValue,
				status: 'valid'
			};
		} catch (error) {
			logger.error(`Processing failed for item ${item.id}: ${error}`);
			return { ...item, status: 'invalid' };
		}
	}

	processBatch(items: DataItem[]): DataItem[] {
		logger.info(`Processing batch of ${items.length} items`);
		return items.map((item) => this.processItem(item));
	}
}
```

```typescript
// src/lib/services/data-processor.unit.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataProcessor } from './data-processor';
import { logger } from '../utils/logger';

describe('DataProcessor', () => {
	let processor: DataProcessor;
	let loggerSpy: any;

	beforeEach(() => {
		processor = new DataProcessor();
		// Spy on logger methods
		loggerSpy = {
			info: vi.spyOn(logger, 'info'),
			error: vi.spyOn(logger, 'error')
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('processItem', () => {
		it('should process valid items correctly', () => {
			const item = { id: '1', value: 5, status: 'valid' as const };
			const result = processor.processItem(item);

			expect(result).toEqual({
				id: '1',
				value: 10, // doubled
				status: 'valid'
			});

			expect(loggerSpy.info).toHaveBeenCalledWith('Processed item 1: 5 -> 10');
			expect(loggerSpy.error).not.toHaveBeenCalled();
		});

		it('should mark invalid items and log errors', () => {
			const item = { id: '2', value: 'invalid' as any, status: 'valid' as const };
			const result = processor.processItem(item);

			expect(result.status).toBe('invalid');
			expect(loggerSpy.error).toHaveBeenCalledWith(
				'Invalid item: {"id":"2","value":"invalid","status":"valid"}'
			);
			expect(loggerSpy.info).not.toHaveBeenCalled();
		});

		it('should handle processing errors gracefully', () => {
			const item = { id: '3', value: NaN, status: 'valid' as const };
			const result = processor.processItem(item);

			expect(result.status).toBe('invalid');
			expect(loggerSpy.error).toHaveBeenCalledTimes(1);
			expect(loggerSpy.error).toHaveBeenCalledWith(
				expect.stringMatching(/^Processing failed for item 3: .+$/)
			);
		});
	});

	describe('processBatch', () => {
		it('should process all items in batch', () => {
			const items = [
				{ id: '1', value: 2, status: 'valid' as const },
				{ id: '2', value: 3, status: 'valid' as const },
				{ id: '3', value: 'invalid' as any, status: 'valid' as const }
			];

			const result = processor.processBatch(items);

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({ id: '1', value: 4, status: 'valid' });
			expect(result[1]).toEqual({ id: '2', value: 6, status: 'valid' });
			expect(result[2]).toEqual({ id: '3', value: 'invalid', status: 'invalid' });

			expect(loggerSpy.info).toHaveBeenCalledWith('Processing batch of 3 items');
			expect(loggerSpy.error).toHaveBeenCalledTimes(1);
		});
	});
});
```

## Example 4: Mocking Fetch API

Mocking browser APIs like `fetch` is crucial for testing code that makes HTTP requests.

```typescript
// src/lib/api/client.ts
export interface ApiResponse<T> {
	data: T;
	success: boolean;
	message?: string;
}

export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = '/api') {
		this.baseUrl = baseUrl;
	}

	async get<T>(endpoint: string): Promise<ApiResponse<T>> {
		const response = await fetch(`${this.baseUrl}${endpoint}`);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || `HTTP ${response.status}`);
		}

		return data;
	}

	async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || `HTTP ${response.status}`);
		}

		return data;
	}
}

export const apiClient = new ApiClient();
```

```typescript
// src/lib/api/client.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from './client';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('ApiClient', () => {
	let client: ApiClient;

	beforeEach(() => {
		vi.clearAllMocks();
		client = new ApiClient();
	});

	describe('get', () => {
		it('should return data for successful GET request', async () => {
			const mockResponse = {
				data: { id: 1, name: 'Test Item' },
				success: true
			};

			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			});

			const result = await client.get('/items/1');

			expect(fetchMock).toHaveBeenCalledWith('/api/items/1', undefined);
			expect(result).toEqual(mockResponse);
		});

		it('should throw error for failed GET request', async () => {
			const errorResponse = { message: 'Item not found', success: false };

			fetchMock.mockResolvedValueOnce({
				ok: false,
				status: 404,
				json: () => Promise.resolve(errorResponse)
			});

			await expect(client.get('/items/999')).rejects.toThrow('Item not found');
		});

		it('should use custom base URL', async () => {
			const customClient = new ApiClient('https://api.example.com');
			const mockResponse = { data: {}, success: true };

			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			});

			await customClient.get('/test');

			expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/test', undefined);
		});
	});

	describe('post', () => {
		it('should send POST request with correct headers and body', async () => {
			const requestBody = { name: 'New Item', value: 42 };
			const mockResponse = {
				data: { id: 2, ...requestBody },
				success: true
			};

			fetchMock.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			});

			const result = await client.post('/items', requestBody);

			expect(fetchMock).toHaveBeenCalledWith('/api/items', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestBody)
			});
			expect(result).toEqual(mockResponse);
		});

		it('should handle network errors', async () => {
			fetchMock.mockRejectedValueOnce(new Error('Network failure'));

			await expect(client.post('/items', {})).rejects.toThrow('Network failure');
		});
	});
});
```

## Example 5: Partial Module Mocking

Sometimes you want to mock only part of a module while keeping other parts real.

```typescript
// src/lib/config/index.ts
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_TIMEOUT = parseInt(process.env.VITE_API_TIMEOUT || '5000');
export const ENABLE_LOGGING = process.env.VITE_ENABLE_LOGGING === 'true';

export function getConfig() {
	return {
		apiBaseUrl: API_BASE_URL,
		apiTimeout: API_TIMEOUT,
		enableLogging: ENABLE_LOGGING
	};
}

export function validateConfig() {
	if (!API_BASE_URL) {
		throw new Error('API_BASE_URL is required');
	}
	if (API_TIMEOUT < 1000) {
		throw new Error('API_TIMEOUT must be at least 1000ms');
	}
	return true;
}
```

```typescript
// src/lib/services/config-service.ts
import { getConfig, validateConfig, API_BASE_URL, ENABLE_LOGGING } from '../config';

export class ConfigService {
	getApiUrl(endpoint: string): string {
		return `${API_BASE_URL}${endpoint}`;
	}

	isLoggingEnabled(): boolean {
		return ENABLE_LOGGING;
	}

	getValidatedConfig() {
		validateConfig();
		return getConfig();
	}
}
```

```typescript
// src/lib/services/config-service.unit.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
vi.stubEnv('VITE_API_BASE_URL', 'https://api.test.com');
vi.stubEnv('VITE_API_TIMEOUT', '3000');
vi.stubEnv('VITE_ENABLE_LOGGING', 'true');

describe('ConfigService', () => {
	it('should use mocked environment variables', () => {
		// Import after mocking environment
		const { ConfigService } = require('./config-service');

		const service = new ConfigService();

		expect(service.getApiUrl('/users')).toBe('https://api.test.com/users');
		expect(service.isLoggingEnabled()).toBe(true);
	});

	it('should call validateConfig and getConfig', () => {
		// Mock only specific functions while keeping others real
		vi.doMock('../config', async () => {
			const actual = await vi.importActual('../config');
			return {
				...actual,
				validateConfig: vi.fn(() => true),
				getConfig: vi.fn(() => ({
					apiBaseUrl: 'https://api.test.com',
					apiTimeout: 3000,
					enableLogging: true
				}))
			};
		});

		// Need to re-import after mocking
		const { ConfigService: MockedConfigService } = require('./config-service');

		const service = new MockedConfigService();
		const result = service.getValidatedConfig();

		expect(result).toEqual({
			apiBaseUrl: 'https://api.test.com',
			apiTimeout: 3000,
			enableLogging: true
		});
	});
});
```

## Example 6: Mocking Timers

Mock time-dependent code using Vitest's timer mocks.

```typescript
// src/lib/utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;

	return (...args: Parameters<T>) => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};
}
```

```typescript
// src/lib/utils/debounce.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('should delay function execution', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 1000);

		debouncedFn('arg1', 'arg2');

		// Function should not be called immediately
		expect(mockFn).not.toHaveBeenCalled();

		// Fast-forward time
		vi.advanceTimersByTime(1000);

		// Now function should be called
		expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	it('should reset timer on subsequent calls', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 1000);

		debouncedFn('first');
		vi.advanceTimersByTime(500);

		debouncedFn('second');
		vi.advanceTimersByTime(500);

		// Should not be called yet (timer was reset)
		expect(mockFn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(500);

		// Now should be called with the last arguments
		expect(mockFn).toHaveBeenCalledWith('second');
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	it('should handle multiple rapid calls', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 1000);

		// Call multiple times rapidly
		debouncedFn('call1');
		vi.advanceTimersByTime(200);
		debouncedFn('call2');
		vi.advanceTimersByTime(200);
		debouncedFn('call3');

		// Should not be called yet
		expect(mockFn).not.toHaveBeenCalled();

		// Wait for full delay
		vi.advanceTimersByTime(800);

		// Should be called once with the last arguments
		expect(mockFn).toHaveBeenCalledWith('call3');
		expect(mockFn).toHaveBeenCalledTimes(1);
	});
});
```

## Example 7: Mocking Environment Variables

Test code that depends on environment variables.

```typescript
// src/lib/config/env-config.ts
export function getDatabaseUrl(): string {
	const url = process.env.DATABASE_URL;
	if (!url) {
		throw new Error('DATABASE_URL environment variable is required');
	}
	return url;
}

export function getPort(): number {
	const port = process.env.PORT;
	return port ? parseInt(port, 10) : 3000;
}

export function isProduction(): boolean {
	return process.env.NODE_ENV === 'production';
}

export function getApiKeys(): { googleMaps: string; stripe: string } {
	const googleMaps = process.env.GOOGLE_MAPS_API_KEY;
	const stripe = process.env.STRIPE_API_KEY;

	if (!googleMaps || !stripe) {
		throw new Error('API keys are required');
	}

	return { googleMaps, stripe };
}
```

```typescript
// src/lib/config/env-config.unit.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDatabaseUrl, getPort, isProduction, getApiKeys } from './env-config';

describe('Environment Configuration', () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
	});

	describe('getDatabaseUrl', () => {
		it('should return DATABASE_URL when set', () => {
			vi.stubEnv('DATABASE_URL', 'postgresql://localhost:5432/mydb');

			expect(getDatabaseUrl()).toBe('postgresql://localhost:5432/mydb');
		});

		it('should throw error when DATABASE_URL is not set', () => {
			expect(() => getDatabaseUrl()).toThrow('DATABASE_URL environment variable is required');
		});
	});

	describe('getPort', () => {
		it('should return parsed PORT when set', () => {
			vi.stubEnv('PORT', '8080');

			expect(getPort()).toBe(8080);
		});

		it('should return default port 3000 when PORT is not set', () => {
			expect(getPort()).toBe(3000);
		});

		it('should handle invalid PORT values', () => {
			vi.stubEnv('PORT', 'invalid');

			expect(getPort()).toBeNaN();
		});
	});

	describe('isProduction', () => {
		it('should return true when NODE_ENV is production', () => {
			vi.stubEnv('NODE_ENV', 'production');

			expect(isProduction()).toBe(true);
		});

		it('should return false for other NODE_ENV values', () => {
			vi.stubEnv('NODE_ENV', 'development');
			expect(isProduction()).toBe(false);

			vi.stubEnv('NODE_ENV', 'test');
			expect(isProduction()).toBe(false);

			// No NODE_ENV set
			vi.unstubAllEnvs();
			expect(isProduction()).toBe(false);
		});
	});

	describe('getApiKeys', () => {
		it('should return API keys when both are set', () => {
			vi.stubEnv('GOOGLE_MAPS_API_KEY', 'google-key-123');
			vi.stubEnv('STRIPE_API_KEY', 'stripe-key-456');

			expect(getApiKeys()).toEqual({
				googleMaps: 'google-key-123',
				stripe: 'stripe-key-456'
			});
		});

		it('should throw error when GOOGLE_MAPS_API_KEY is missing', () => {
			vi.stubEnv('STRIPE_API_KEY', 'stripe-key-456');

			expect(() => getApiKeys()).toThrow('API keys are required');
		});

		it('should throw error when STRIPE_API_KEY is missing', () => {
			vi.stubEnv('GOOGLE_MAPS_API_KEY', 'google-key-123');

			expect(() => getApiKeys()).toThrow('API keys are required');
		});
	});
});
```

### Example 8: Mocking File System Operations

Test code that interacts with the file system using `memfs`:

```typescript
// src/lib/utils/file-processor.ts
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface FileMetadata {
	name: string;
	size: number;
	lastModified: Date;
	content: string;
}

export class FileProcessor {
	constructor(private baseDir: string = './') {}

	readAndProcessFile(filename: string): FileMetadata | null {
		const filePath = join(this.baseDir, filename);

		if (!existsSync(filePath)) {
			return null;
		}

		const content = readFileSync(filePath, 'utf-8');
		const stats = require('fs').statSync(filePath);

		return {
			name: filename,
			size: stats.size,
			lastModified: stats.mtime,
			content: content.toUpperCase() // Process content
		};
	}

	writeProcessedFile(filename: string, content: string): boolean {
		try {
			const processedContent = content.trim().toLowerCase();
			const filePath = join(this.baseDir, `processed_${filename}`);
			writeFileSync(filePath, processedContent, 'utf-8');
			return true;
		} catch (error) {
			console.error('Failed to write file:', error);
			return false;
		}
	}

	getFileList(): string[] {
		const fs = require('fs');
		try {
			return fs
				.readdirSync(this.baseDir)
				.filter((file: string) => fs.statSync(join(this.baseDir, file)).isFile());
		} catch (error) {
			return [];
		}
	}
}
```

```typescript
// src/lib/utils/file-processor.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fs, vol } from 'memfs';
import { FileProcessor } from './file-processor';

// Mock Node.js fs modules
vi.mock('fs');
vi.mock('path', () => ({
	join: (...parts: string[]) => parts.join('/').replace(/\/+/g, '/')
}));

describe('FileProcessor', () => {
	let processor: FileProcessor;

	beforeEach(() => {
		processor = new FileProcessor('/test');
		vol.reset();

		// Set up in-memory file system
		vol.fromJSON({
			'/test/data.txt': 'Hello World',
			'/test/config.json': '{"setting": "value"}',
			'/test/empty.txt': ''
		});
	});

	afterEach(() => {
		vol.reset();
	});

	describe('readAndProcessFile', () => {
		it('should read and process existing file', () => {
			const result = processor.readAndProcessFile('data.txt');

			expect(result).toEqual({
				name: 'data.txt',
				size: 11,
				lastModified: expect.any(Date),
				content: 'HELLO WORLD' // Content is uppercased
			});
		});

		it('should return null for non-existent file', () => {
			const result = processor.readAndProcessFile('nonexistent.txt');

			expect(result).toBeNull();
		});

		it('should handle empty files', () => {
			const result = processor.readAndProcessFile('empty.txt');

			expect(result).toEqual({
				name: 'empty.txt',
				size: 0,
				lastModified: expect.any(Date),
				content: '' // Empty string uppercased is still empty
			});
		});

		it('should handle different file types', () => {
			const result = processor.readAndProcessFile('config.json');

			expect(result?.content).toBe('{"SETTING": "VALUE"}'); // JSON uppercased
		});
	});

	describe('writeProcessedFile', () => {
		it('should write processed content to new file', () => {
			const success = processor.writeProcessedFile('output.txt', '  SOME CONTENT  ');

			expect(success).toBe(true);

			// Verify file was written with processed content
			const writtenContent = fs.readFileSync('/test/processed_output.txt', 'utf-8');
			expect(writtenContent).toBe('some content'); // Trimmed and lowercased
		});

		it('should return false on write error', () => {
			// Mock writeFileSync to throw an error
			const originalWriteFileSync = fs.writeFileSync;
			fs.writeFileSync = vi.fn().mockImplementation(() => {
				throw new Error('Disk full');
			});

			const success = processor.writeProcessedFile('test.txt', 'content');

			expect(success).toBe(false);

			// Restore original function
			fs.writeFileSync = originalWriteFileSync;
		});

		it('should handle empty content', () => {
			const success = processor.writeProcessedFile('empty.txt', '');

			expect(success).toBe(true);
			const writtenContent = fs.readFileSync('/test/processed_empty.txt', 'utf-8');
			expect(writtenContent).toBe('');
		});
	});

	describe('getFileList', () => {
		it('should return list of files in directory', () => {
			const files = processor.getFileList();

			expect(files).toHaveLength(3);
			expect(files.sort()).toEqual(['config.json', 'data.txt', 'empty.txt']);
		});

		it('should exclude directories', () => {
			// Add a directory to the volume
			vol.mkdirSync('/test/subdir');

			const files = processor.getFileList();

			expect(files).toHaveLength(3); // Should still be 3 files, no directories
			expect(files).not.toContain('subdir');
		});

		it('should handle directory read errors gracefully', () => {
			// Mock readdirSync to throw an error
			const originalReaddirSync = fs.readdirSync;
			fs.readdirSync = vi.fn().mockImplementation(() => {
				throw new Error('Permission denied');
			});

			const files = processor.getFileList();

			expect(files).toEqual([]);

			// Restore original function
			fs.readdirSync = originalReaddirSync;
		});
	});
});
```

### Example 9: Mocking Environment Variables

Test code that depends on environment variables using Vitest's environment mocking:

```typescript
// src/lib/config/feature-flags.ts
export interface FeatureFlags {
	enableNewUI: boolean;
	enableAnalytics: boolean;
	enableBetaFeatures: boolean;
	maxRetries: number;
	apiTimeout: number;
}

export class FeatureFlagManager {
	private flags: FeatureFlags;

	constructor() {
		this.flags = {
			enableNewUI: process.env.ENABLE_NEW_UI === 'true',
			enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false', // Default true
			enableBetaFeatures:
				process.env.NODE_ENV === 'development' || process.env.ENABLE_BETA === 'true',
			maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
			apiTimeout: parseInt(process.env.API_TIMEOUT || '5000')
		};
	}

	isEnabled(flag: keyof FeatureFlags): boolean {
		const value = this.flags[flag];
		return typeof value === 'boolean' ? value : false;
	}

	getNumberValue(flag: keyof FeatureFlags): number {
		const value = this.flags[flag];
		return typeof value === 'number' ? value : 0;
	}

	getAllFlags(): FeatureFlags {
		return { ...this.flags };
	}

	updateFlag(flag: keyof FeatureFlags, value: boolean | number): void {
		if (typeof this.flags[flag] === typeof value) {
			(this.flags as any)[flag] = value;
		}
	}
}

export const featureFlags = new FeatureFlagManager();
```

```typescript
// src/lib/config/feature-flags.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FeatureFlagManager } from './feature-flags';

describe('FeatureFlagManager', () => {
	let manager: FeatureFlagManager;

	afterEach(() => {
		// Clean up environment variables
		delete process.env.ENABLE_NEW_UI;
		delete process.env.ENABLE_ANALYTICS;
		delete process.env.ENABLE_BETA;
		delete process.env.NODE_ENV;
		delete process.env.MAX_RETRIES;
		delete process.env.API_TIMEOUT;
	});

	describe('constructor - environment variable parsing', () => {
		it('should parse boolean flags correctly', () => {
			process.env.ENABLE_NEW_UI = 'true';
			process.env.ENABLE_ANALYTICS = 'false';

			manager = new FeatureFlagManager();

			expect(manager.isEnabled('enableNewUI')).toBe(true);
			expect(manager.isEnabled('enableAnalytics')).toBe(false);
		});

		it('should handle missing boolean flags with defaults', () => {
			// ENABLE_ANALYTICS defaults to true when not set to 'false'
			manager = new FeatureFlagManager();

			expect(manager.isEnabled('enableAnalytics')).toBe(true);
		});

		it('should parse beta features based on NODE_ENV', () => {
			process.env.NODE_ENV = 'production';
			process.env.ENABLE_BETA = 'false';

			manager = new FeatureFlagManager();

			expect(manager.isEnabled('enableBetaFeatures')).toBe(false);

			// Change to development
			process.env.NODE_ENV = 'development';
			manager = new FeatureFlagManager();

			expect(manager.isEnabled('enableBetaFeatures')).toBe(true);

			// Override with ENABLE_BETA
			process.env.NODE_ENV = 'production';
			process.env.ENABLE_BETA = 'true';
			manager = new FeatureFlagManager();

			expect(manager.isEnabled('enableBetaFeatures')).toBe(true);
		});

		it('should parse numeric values with defaults', () => {
			process.env.MAX_RETRIES = '5';
			process.env.API_TIMEOUT = '10000';

			manager = new FeatureFlagManager();

			expect(manager.getNumberValue('maxRetries')).toBe(5);
			expect(manager.getNumberValue('apiTimeout')).toBe(10000);
		});

		it('should handle invalid numeric values', () => {
			process.env.MAX_RETRIES = 'invalid';

			manager = new FeatureFlagManager();

			expect(manager.getNumberValue('maxRetries')).toBe(3); // Default value
		});

		it('should use defaults when environment variables are not set', () => {
			manager = new FeatureFlagManager();

			expect(manager.getNumberValue('maxRetries')).toBe(3);
			expect(manager.getNumberValue('apiTimeout')).toBe(5000);
		});
	});

	describe('isEnabled', () => {
		beforeEach(() => {
			process.env.ENABLE_NEW_UI = 'true';
			manager = new FeatureFlagManager();
		});

		it('should return boolean value for boolean flags', () => {
			expect(manager.isEnabled('enableNewUI')).toBe(true);
			expect(manager.isEnabled('enableAnalytics')).toBe(true); // default
		});

		it('should return false for number flags', () => {
			expect(manager.isEnabled('maxRetries')).toBe(false);
		});

		it('should return false for unknown flags', () => {
			expect(manager.isEnabled('unknownFlag' as any)).toBe(false);
		});
	});

	describe('getNumberValue', () => {
		beforeEach(() => {
			process.env.MAX_RETRIES = '7';
			manager = new FeatureFlagManager();
		});

		it('should return number value for number flags', () => {
			expect(manager.getNumberValue('maxRetries')).toBe(7);
			expect(manager.getNumberValue('apiTimeout')).toBe(5000); // default
		});

		it('should return 0 for boolean flags', () => {
			expect(manager.getNumberValue('enableNewUI')).toBe(0);
		});
	});

	describe('getAllFlags', () => {
		it('should return a copy of all flags', () => {
			process.env.ENABLE_NEW_UI = 'true';
			process.env.MAX_RETRIES = '10';

			manager = new FeatureFlagManager();
			const flags = manager.getAllFlags();

			expect(flags).toEqual({
				enableNewUI: true,
				enableAnalytics: true,
				enableBetaFeatures: false,
				maxRetries: 10,
				apiTimeout: 5000
			});

			// Verify it's a copy, not a reference
			flags.enableNewUI = false;
			expect(manager.isEnabled('enableNewUI')).toBe(true);
		});
	});

	describe('updateFlag', () => {
		beforeEach(() => {
			process.env.ENABLE_NEW_UI = 'false';
			process.env.MAX_RETRIES = '5';
			manager = new FeatureFlagManager();
		});

		it('should update boolean flags', () => {
			manager.updateFlag('enableNewUI', true);

			expect(manager.isEnabled('enableNewUI')).toBe(true);
		});

		it('should update number flags', () => {
			manager.updateFlag('maxRetries', 10);

			expect(manager.getNumberValue('maxRetries')).toBe(10);
		});

		it('should ignore type mismatches', () => {
			const originalValue = manager.isEnabled('enableNewUI');

			manager.updateFlag('enableNewUI', 123 as any); // Wrong type

			expect(manager.isEnabled('enableNewUI')).toBe(originalValue);
		});
	});
});
```

## Best Practices

### When to Mock vs Use Real Implementation

**Mock when:**

- Testing external dependencies (APIs, databases, file system)
- Code runs slowly with real dependencies
- Dependencies are unreliable or expensive
- Testing error conditions that are hard to reproduce

**Use real implementation when:**

- Testing simple utility functions
- Dependencies are fast and reliable
- Integration testing (use real dependencies)
- Testing the interaction between components

### Avoiding Over-Mocking

- Mock at the boundary (API calls, database operations)
- Don't mock simple data transformations
- Keep tests focused on the code under test
- Consider integration tests for complex interactions

### Making Mocks Maintainable

- Use descriptive mock names: `vi.fn().mockName('fetchUser')`
- Group mock setup in `beforeEach` blocks
- Use `vi.clearAllMocks()` to reset between tests
- Document complex mock setups
- Avoid mocking implementation details

### Common Mock Patterns

```typescript
// Factory pattern for complex mocks
function createMockUser(overrides = {}) {
	return {
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		...overrides
	};
}

// Mock chain for fluent APIs
const mockQueryBuilder = {
	select: vi.fn().mockReturnThis(),
	from: vi.fn().mockReturnThis(),
	where: vi.fn().mockReturnThis(),
	execute: vi.fn()
};
```

### Troubleshooting Mock Issues

**Mock not being called:**

- Check import order (mocks must be before imports)
- Use `vi.doMock()` for conditional mocking
- Ensure correct function references

**Mock state leaking between tests:**

- Always call `vi.clearAllMocks()` in `beforeEach`
- Use `afterEach(() => vi.restoreAllMocks())`
- Avoid global state in mocks

**TypeScript issues with mocks:**

- Use `vi.mocked()` to get typed mocks
- Import types from original modules
- Use `as any` sparingly for complex mocks

**Async mock issues:**

- Use `mockResolvedValue()` for promises
- Use `mockRejectedValue()` for rejections
- Remember that mocks are synchronous by default

This comprehensive mocking guide should equip you to handle most testing scenarios in your SvelteKit application. The next guide focuses on testing Valibot schemas for robust data validation.
