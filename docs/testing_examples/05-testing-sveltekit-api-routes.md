# Testing SvelteKit API Routes

## Introduction

SvelteKit API routes (+server.ts files) handle HTTP requests and responses. Testing these routes ensures your API endpoints work correctly, handle errors properly, and integrate well with your application logic.

### API Route Testing Challenges

- **Request/Response Objects**: SvelteKit's RequestEvent is complex to mock
- **Middleware Integration**: Authentication, validation, and other middleware
- **HTTP Semantics**: Status codes, headers, content types
- **Integration Testing**: End-to-end request flows

### Testing Strategies

- **Unit Testing**: Test route logic in isolation with mocked dependencies
- **Integration Testing**: Test complete request/response cycles
- **Contract Testing**: Verify API contracts and data formats

## Example 1: Testing GET Endpoints

Test basic read operations with proper mocking.

```typescript
// src/routes/api/users/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as users from '$lib/db/queries/users';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const offset = parseInt(url.searchParams.get('offset') || '0');

		if (limit > 100) {
			throw error(400, 'Limit cannot exceed 100');
		}

		const userList = await users.getUsersPaginated(limit, offset);
		const totalCount = await users.getTotalUserCount();

		return json({
			users: userList,
			pagination: {
				limit,
				offset,
				total: totalCount,
				hasMore: offset + limit < totalCount
			}
		});
	} catch (err) {
		console.error('Error fetching users:', err);
		throw error(500, 'Internal server error');
	}
};
```

```typescript
// src/routes/api/users/+server.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest';
import { GET } from './+server';
import * as users from '$lib/db/queries/users';

// Mock the users module
vi.mock('$lib/db/queries/users');

const mockGetUsersPaginated = users.getUsersPaginated as MockedFunction<
	typeof users.getUsersPaginated
>;
const mockGetTotalUserCount = users.getTotalUserCount as MockedFunction<
	typeof users.getTotalUserCount
>;

describe('GET /api/users', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return paginated users with default parameters', async () => {
		const mockUsers = [
			{ id: '1', username: 'user1', email: 'user1@example.com' },
			{ id: '2', username: 'user2', email: 'user2@example.com' }
		];

		mockGetUsersPaginated.mockResolvedValue(mockUsers);
		mockGetTotalUserCount.mockResolvedValue(25);

		const request = new Request('http://localhost/api/users');
		const response = await GET({ request, url: new URL(request.url) } as any);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toEqual({
			users: mockUsers,
			pagination: {
				limit: 10,
				offset: 0,
				total: 25,
				hasMore: true
			}
		});

		expect(mockGetUsersPaginated).toHaveBeenCalledWith(10, 0);
		expect(mockGetTotalUserCount).toHaveBeenCalledTimes(1);
	});

	it('should handle custom pagination parameters', async () => {
		const mockUsers = [{ id: '11', username: 'user11', email: 'user11@example.com' }];

		mockGetUsersPaginated.mockResolvedValue(mockUsers);
		mockGetTotalUserCount.mockResolvedValue(50);

		const request = new Request('http://localhost/api/users?limit=1&offset=10');
		const response = await GET({ request, url: new URL(request.url) } as any);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data.users).toEqual(mockUsers);
		expect(data.pagination).toEqual({
			limit: 1,
			offset: 10,
			total: 50,
			hasMore: true
		});

		expect(mockGetUsersPaginated).toHaveBeenCalledWith(1, 10);
	});

	it('should reject limit exceeding maximum', async () => {
		const request = new Request('http://localhost/api/users?limit=150');

		await expect(GET({ request, url: new URL(request.url) } as any)).rejects.toThrow(
			'Limit cannot exceed 100'
		);
	});

	it('should handle database errors gracefully', async () => {
		mockGetUsersPaginated.mockRejectedValue(new Error('Database connection failed'));

		const request = new Request('http://localhost/api/users');

		await expect(GET({ request, url: new URL(request.url) } as any)).rejects.toThrow(
			'Internal server error'
		);
	});

	it('should calculate hasMore correctly', async () => {
		mockGetUsersPaginated.mockResolvedValue([]);
		mockGetTotalUserCount.mockResolvedValue(5);

		const request = new Request('http://localhost/api/users?limit=10&offset=0');
		const response = await GET({ request, url: new URL(request.url) } as any);

		const data = await response.json();
		expect(data.pagination.hasMore).toBe(false); // 0 + 10 = 10, which is not < 5
	});
});
```

## Example 2: Testing POST Endpoints

Test create operations with request body validation.

```typescript
// src/routes/api/users/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createUserSchema } from '$lib/schemas/user';
import * as users from '$lib/db/queries/users';
import type { CreateUserInput } from '$lib/schemas/user';

// ... existing GET handler ...

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: CreateUserInput = await request.json();

		// Validate input
		const validatedData = createUserSchema.parse(body);

		// Check if user already exists
		const existingUser = await users.getUserByUsername(validatedData.username);
		if (existingUser) {
			throw error(409, 'Username already exists');
		}

		// Create user
		const newUser = await users.createUser({
			username: validatedData.username,
			passwordHash: await hashPassword(validatedData.password),
			age: validatedData.age
		});

		// Don't return password hash in response
		const { passwordHash, ...userResponse } = newUser;

		return json(userResponse, { status: 201 });
	} catch (err) {
		if (err instanceof Error && 'issues' in err) {
			// Validation error from schema
			throw error(400, {
				message: 'Validation failed',
				details: err.issues
			});
		}

		if (err.status) {
			// SvelteKit error, re-throw
			throw err;
		}

		console.error('Error creating user:', err);
		throw error(500, 'Internal server error');
	}
};

// Helper function (would be in a separate module)
async function hashPassword(password: string): Promise<string> {
	// In real implementation, use proper hashing
	return `hashed_${password}`;
}
```

```typescript
// src/routes/api/users/+server.unit.test.ts
// ... existing imports and GET tests ...

import { createUserSchema } from '$lib/schemas/user';
import type { CreateUserInput } from '$lib/schemas/user';

// Additional mocks
const mockCreateUser = users.createUser as MockedFunction<typeof users.createUser>;
const mockGetUserByUsername = users.getUserByUsername as MockedFunction<
	typeof users.getUserByUsername
>;

describe('POST /api/users', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create a new user successfully', async () => {
		const userData: CreateUserInput = {
			username: 'newuser',
			password: 'SecurePass123!',
			name: 'New User',
			age: 25
		};

		const createdUser = {
			id: 'user-123',
			username: 'newuser',
			passwordHash: 'hashed_SecurePass123!',
			age: 25
		};

		mockGetUserByUsername.mockResolvedValue(null); // User doesn't exist
		mockCreateUser.mockResolvedValue(createdUser);

		const request = new Request('http://localhost/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData)
		});

		const response = await POST({ request } as any);

		expect(response.status).toBe(201);

		const responseData = await response.json();
		expect(responseData).toEqual({
			id: 'user-123',
			username: 'newuser',
			age: 25
			// passwordHash should not be included
		});
		expect(responseData).not.toHaveProperty('passwordHash');

		expect(mockGetUserByUsername).toHaveBeenCalledWith('newuser');
		expect(mockCreateUser).toHaveBeenCalledWith({
			username: 'newuser',
			passwordHash: 'hashed_SecurePass123!',
			age: 25
		});
	});

	it('should reject duplicate usernames', async () => {
		const userData: CreateUserInput = {
			username: 'existinguser',
			password: 'SecurePass123!',
			name: 'Existing User',
			age: 30
		};

		mockGetUserByUsername.mockResolvedValue({
			id: 'existing-id',
			username: 'existinguser'
		});

		const request = new Request('http://localhost/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData)
		});

		await expect(POST({ request } as any)).rejects.toThrow('Username already exists');

		expect(mockCreateUser).not.toHaveBeenCalled();
	});

	it('should validate input data', async () => {
		const invalidData = {
			username: '', // empty username
			password: 'weak', // weak password
			name: 'Test User',
			age: 25
		};

		mockGetUserByUsername.mockResolvedValue(null);

		const request = new Request('http://localhost/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(invalidData)
		});

		await expect(POST({ request } as any)).rejects.toMatchObject({
			status: 400,
			body: expect.objectContaining({
				message: 'Validation failed'
			})
		});

		expect(mockCreateUser).not.toHaveBeenCalled();
	});

	it('should handle invalid JSON', async () => {
		const request = new Request('http://localhost/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: 'invalid json'
		});

		await expect(POST({ request } as any)).rejects.toThrow('Internal server error');
	});

	it('should handle missing required fields', async () => {
		const incompleteData = {
			username: 'testuser'
			// missing password and other required fields
		};

		const request = new Request('http://localhost/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(incompleteData)
		});

		await expect(POST({ request } as any)).rejects.toMatchObject({
			status: 400,
			body: expect.objectContaining({
				message: 'Validation failed'
			})
		});
	});
});
```

## Example 3: Testing with Path Parameters

Test dynamic routes with URL parameters.

```typescript
// src/routes/api/users/[id]/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userIdSchema } from '$lib/schemas/user';
import * as users from '$lib/db/queries/users';

export const GET: RequestHandler = async ({ params }) => {
	try {
		// Validate user ID parameter
		const userId = userIdSchema.parse(params.id);

		const user = await users.getUserById(userId);

		if (!user) {
			throw error(404, 'User not found');
		}

		return json(user);
	} catch (err) {
		if (err instanceof Error && 'issues' in err) {
			throw error(400, 'Invalid user ID format');
		}

		if (err.status) {
			throw err;
		}

		console.error('Error fetching user:', err);
		throw error(500, 'Internal server error');
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const userId = userIdSchema.parse(params.id);
		const updateData = await request.json();

		// Check if user exists
		const existingUser = await users.getUserById(userId);
		if (!existingUser) {
			throw error(404, 'User not found');
		}

		// Update user (simplified - in real app, validate updateData)
		const updatedUser = await users.updateUser(userId, updateData);

		return json(updatedUser);
	} catch (err) {
		if (err instanceof Error && 'issues' in err) {
			throw error(400, 'Invalid user ID format');
		}

		if (err.status) {
			throw err;
		}

		console.error('Error updating user:', err);
		throw error(500, 'Internal server error');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const userId = userIdSchema.parse(params.id);

		const deletedUser = await users.deleteUser(userId);

		if (!deletedUser) {
			throw error(404, 'User not found');
		}

		return json({ message: 'User deleted successfully' });
	} catch (err) {
		if (err instanceof Error && 'issues' in err) {
			throw error(400, 'Invalid user ID format');
		}

		if (err.status) {
			throw err;
		}

		console.error('Error deleting user:', err);
		throw error(500, 'Internal server error');
	}
};
```

```typescript
// src/routes/api/users/[id]/+server.unit.test.ts
import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { GET, PUT, DELETE } from './+server';
import * as users from '$lib/db/queries/users';

const mockGetUserById = users.getUserById as MockedFunction<typeof users.getUserById>;
const mockUpdateUser = users.updateUser as MockedFunction<typeof users.updateUser>;
const mockDeleteUser = users.deleteUser as MockedFunction<typeof users.deleteUser>;

describe('User API Routes with ID', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET /api/users/[id]', () => {
		it('should return user data for valid ID', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174000';
			const userData = {
				id: userId,
				username: 'testuser',
				age: 25
			};

			mockGetUserById.mockResolvedValue(userData);

			const request = new Request(`http://localhost/api/users/${userId}`);
			const response = await GET({
				params: { id: userId },
				request,
				url: new URL(request.url)
			} as any);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data).toEqual(userData);
			expect(mockGetUserById).toHaveBeenCalledWith(userId);
		});

		it('should return 404 for non-existent user', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174000';
			mockGetUserById.mockResolvedValue(null);

			const request = new Request(`http://localhost/api/users/${userId}`);

			await expect(
				GET({
					params: { id: userId },
					request,
					url: new URL(request.url)
				} as any)
			).rejects.toThrow('User not found');
		});

		it('should validate UUID format', async () => {
			const invalidId = 'not-a-uuid';

			const request = new Request(`http://localhost/api/users/${invalidId}`);

			await expect(
				GET({
					params: { id: invalidId },
					request,
					url: new URL(request.url)
				} as any)
			).rejects.toThrow('Invalid user ID format');
		});
	});

	describe('PUT /api/users/[id]', () => {
		it('should update user successfully', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174000';
			const updateData = { age: 30 };
			const existingUser = { id: userId, username: 'testuser', age: 25 };
			const updatedUser = { ...existingUser, age: 30 };

			mockGetUserById.mockResolvedValue(existingUser);
			mockUpdateUser.mockResolvedValue(updatedUser);

			const request = new Request(`http://localhost/api/users/${userId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			});

			const response = await PUT({
				params: { id: userId },
				request
			} as any);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data).toEqual(updatedUser);
			expect(mockUpdateUser).toHaveBeenCalledWith(userId, updateData);
		});

		it('should return 404 when updating non-existent user', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174000';
			const updateData = { age: 30 };

			mockGetUserById.mockResolvedValue(null);

			const request = new Request(`http://localhost/api/users/${userId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			});

			await expect(
				PUT({
					params: { id: userId },
					request
				} as any)
			).rejects.toThrow('User not found');

			expect(mockUpdateUser).not.toHaveBeenCalled();
		});
	});

	describe('DELETE /api/users/[id]', () => {
		it('should delete user successfully', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174000';
			const deletedUser = { id: userId, username: 'testuser', age: 25 };

			mockDeleteUser.mockResolvedValue(deletedUser);

			const request = new Request(`http://localhost/api/users/${userId}`, {
				method: 'DELETE'
			});

			const response = await DELETE({
				params: { id: userId },
				request
			} as any);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data).toEqual({ message: 'User deleted successfully' });
			expect(mockDeleteUser).toHaveBeenCalledWith(userId);
		});

		it('should return 404 when deleting non-existent user', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174000';

			mockDeleteUser.mockResolvedValue(null);

			const request = new Request(`http://localhost/api/users/${userId}`, {
				method: 'DELETE'
			});

			await expect(
				DELETE({
					params: { id: userId },
					request
				} as any)
			).rejects.toThrow('User not found');
		});
	});
});
```

## Example 4: Testing with Authentication

Test routes that require authentication and authorization.

```typescript
// src/routes/api/users/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as auth from '$lib/server/auth';

// ... existing handlers ...

export const GET: RequestHandler = async ({ request, url, locals }) => {
	// Check authentication
	if (!locals.user) {
		throw error(401, 'Authentication required');
	}

	try {
		const limit = parseInt(url.searchParams.get('limit') || '10');

		if (limit > 100) {
			throw error(400, 'Limit cannot exceed 100');
		}

		// Only return users from the same organization (simplified)
		const userList = await users.getUsersByOrganization(locals.user.organizationId, limit);

		return json({
			users: userList,
			currentUser: locals.user
		});
	} catch (err) {
		console.error('Error fetching users:', err);
		throw error(500, 'Internal server error');
	}
};
```

```typescript
// src/routes/api/users/+server.auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './+server';
import * as users from '$lib/db/queries/users';

const mockGetUsersByOrganization = users.getUsersByOrganization as MockedFunction<
	typeof users.getUsersByOrganization
>;

describe('GET /api/users (Authenticated)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return users for authenticated user', async () => {
		const mockUser = {
			id: 'user-123',
			username: 'testuser',
			organizationId: 'org-456'
		};

		const mockUsers = [
			{ id: '1', username: 'user1', organizationId: 'org-456' },
			{ id: '2', username: 'user2', organizationId: 'org-456' }
		];

		mockGetUsersByOrganization.mockResolvedValue(mockUsers);

		const request = new Request('http://localhost/api/users');
		const response = await GET({
			request,
			url: new URL(request.url),
			locals: { user: mockUser }
		} as any);

		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data.users).toEqual(mockUsers);
		expect(data.currentUser).toEqual(mockUser);

		expect(mockGetUsersByOrganization).toHaveBeenCalledWith('org-456', 10);
	});

	it('should return 401 for unauthenticated requests', async () => {
		const request = new Request('http://localhost/api/users');

		await expect(
			GET({
				request,
				url: new URL(request.url),
				locals: {} // No user
			} as any)
		).rejects.toThrow('Authentication required');
	});

	it('should respect user organization isolation', async () => {
		const mockUser = {
			id: 'user-123',
			username: 'testuser',
			organizationId: 'org-456'
		};

		const mockUsers = [{ id: '1', username: 'user1', organizationId: 'org-456' }];

		mockGetUsersByOrganization.mockResolvedValue(mockUsers);

		const request = new Request('http://localhost/api/users');
		await GET({
			request,
			url: new URL(request.url),
			locals: { user: mockUser }
		} as any);

		// Verify the query was scoped to the user's organization
		expect(mockGetUsersByOrganization).toHaveBeenCalledWith('org-456', 10);
	});
});
```

## Example 5: Testing Error Handling

Test comprehensive error scenarios and edge cases.

```typescript
// src/lib/middleware/validation.ts
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function validateJsonRequest<T>(request: Request, schema: any): Promise<T> {
	try {
		const body = await request.json();
		return schema.parse(body);
	} catch (err) {
		if (err instanceof Error && 'issues' in err) {
			throw error(400, {
				message: 'Validation failed',
				details: err.issues
			});
		}
		throw error(400, 'Invalid JSON body');
	}
}

export function requireAuth(locals: RequestEvent['locals']) {
	if (!locals.user) {
		throw error(401, 'Authentication required');
	}
	return locals.user;
}

export function requireRole(user: any, requiredRole: string) {
	if (user.role !== requiredRole && user.role !== 'admin') {
		throw error(403, `Role '${requiredRole}' required`);
	}
	return user;
}
```

```typescript
// src/lib/middleware/validation.unit.test.ts
import { describe, it, expect, vi } from 'vitest';
import { validateJsonRequest, requireAuth, requireRole } from './validation';

describe('Validation Middleware', () => {
	describe('validateJsonRequest', () => {
		it('should parse and validate valid JSON', async () => {
			const mockSchema = { parse: vi.fn().mockReturnValue({ name: 'test' }) };
			const request = new Request('http://localhost', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: 'test' })
			});

			const result = await validateJsonRequest(request, mockSchema);

			expect(result).toEqual({ name: 'test' });
			expect(mockSchema.parse).toHaveBeenCalledWith({ name: 'test' });
		});

		it('should handle schema validation errors', async () => {
			const mockSchema = {
				parse: vi.fn().mockImplementation(() => {
					throw { issues: [{ message: 'Invalid name' }] };
				})
			};
			const request = new Request('http://localhost', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: '' })
			});

			await expect(validateJsonRequest(request, mockSchema)).rejects.toMatchObject({
				status: 400,
				body: {
					message: 'Validation failed',
					details: [{ message: 'Invalid name' }]
				}
			});
		});

		it('should handle malformed JSON', async () => {
			const mockSchema = { parse: vi.fn() };
			const request = new Request('http://localhost', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: 'invalid json'
			});

			await expect(validateJsonRequest(request, mockSchema)).rejects.toThrow('Invalid JSON body');
		});
	});

	describe('requireAuth', () => {
		it('should return user when authenticated', () => {
			const mockUser = { id: '123', username: 'testuser' };
			const locals = { user: mockUser };

			const result = requireAuth(locals);
			expect(result).toBe(mockUser);
		});

		it('should throw 401 when not authenticated', () => {
			const locals = {};

			expect(() => requireAuth(locals)).toThrow('Authentication required');
		});
	});

	describe('requireRole', () => {
		it('should allow user with required role', () => {
			const user = { id: '123', role: 'editor' };

			const result = requireRole(user, 'editor');
			expect(result).toBe(user);
		});

		it('should allow admin user any role', () => {
			const user = { id: '123', role: 'admin' };

			const result = requireRole(user, 'editor');
			expect(result).toBe(user);
		});

		it('should deny user without required role', () => {
			const user = { id: '123', role: 'viewer' };

			expect(() => requireRole(user, 'editor')).toThrow("Role 'editor' required");
		});
	});
});
```

## Example 6: Integration Testing with Database

Test complete request flows with real database operations.

```typescript
// tests/integration/routes/api/users.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createTestDb, clearTables, dropTables } from '../../test-db/setup';
import { user } from '$lib/server/db/schema';
import { GET, POST } from '$routes/api/users/+server';

describe('Users API Integration', () => {
	beforeAll(async () => {
		await createTestDb();
	});

	afterAll(async () => {
		await dropTables();
	});

	beforeEach(async () => {
		await clearTables();
	});

	describe('GET /api/users', () => {
		it('should return empty array when no users exist', async () => {
			const request = new Request('http://localhost/api/users');
			const response = await GET({
				request,
				url: new URL(request.url),
				locals: { user: { organizationId: 'test-org' } }
			} as any);

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.users).toEqual([]);
			expect(data.pagination.total).toBe(0);
		});

		it('should return users with pagination', async () => {
			// Insert test users
			await testDb.insert(user).values([
				{ id: 'user-1', username: 'alice', age: 25, passwordHash: 'hash1' },
				{ id: 'user-2', username: 'bob', age: 30, passwordHash: 'hash2' },
				{ id: 'user-3', username: 'charlie', age: 35, passwordHash: 'hash3' }
			]);

			const request = new Request('http://localhost/api/users?limit=2');
			const response = await GET({
				request,
				url: new URL(request.url),
				locals: { user: { organizationId: 'test-org' } }
			} as any);

			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.users).toHaveLength(2);
			expect(data.pagination.total).toBe(3);
			expect(data.pagination.hasMore).toBe(true);
		});
	});

	describe('POST /api/users', () => {
		it('should create user and persist to database', async () => {
			const userData = {
				username: 'newuser',
				password: 'SecurePass123!',
				name: 'New User',
				age: 28
			};

			const request = new Request('http://localhost/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData)
			});

			const response = await POST({ request } as any);

			expect(response.status).toBe(201);

			const createdUser = await response.json();
			expect(createdUser.username).toBe('newuser');
			expect(createdUser.age).toBe(28);
			expect(createdUser).not.toHaveProperty('passwordHash');

			// Verify in database
			const dbUser = await testDb.select().from(user).where(eq(user.username, 'newuser'));

			expect(dbUser).toHaveLength(1);
			expect(dbUser[0].username).toBe('newuser');
			expect(dbUser[0].passwordHash).toBe('hashed_SecurePass123!');
		});

		it('should reject duplicate usernames', async () => {
			// Create first user
			await testDb.insert(user).values({
				id: 'existing-id',
				username: 'existinguser',
				age: 25,
				passwordHash: 'hash'
			});

			const userData = {
				username: 'existinguser', // Same username
				password: 'SecurePass123!',
				name: 'Another User',
				age: 30
			};

			const request = new Request('http://localhost/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData)
			});

			await expect(POST({ request } as any)).rejects.toThrow('Username already exists');

			// Verify no additional user was created
			const allUsers = await testDb.select().from(user);
			expect(allUsers).toHaveLength(1);
		});
	});
});
```

## Example 7: Testing Authentication and Authorization

Test protected routes with authentication middleware:

```typescript
// src/routes/api/auth/user/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

// In a real app, this would be middleware or a utility function
async function getAuthenticatedUser(request: Request) {
	const authHeader = request.headers.get('authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw error(401, 'Missing or invalid authorization header');
	}

	const token = authHeader.slice(7); // Remove 'Bearer '

	// In a real app, you'd validate the JWT token here
	// For testing, we'll just decode it as JSON
	try {
		const payload = JSON.parse(atob(token));

		if (!payload.userId) {
			throw error(401, 'Invalid token payload');
		}

		const [userRecord] = await db.select().from(user).where(eq(user.id, payload.userId));

		if (!userRecord) {
			throw error(401, 'User not found');
		}

		return userRecord;
	} catch (err) {
		throw error(401, 'Invalid token');
	}
}

export const GET: RequestHandler = async ({ request }) => {
	try {
		const authenticatedUser = await getAuthenticatedUser(request);

		// Return user profile (exclude sensitive data)
		return json({
			id: authenticatedUser.id,
			username: authenticatedUser.username,
			age: authenticatedUser.age,
			createdAt: authenticatedUser.createdAt
		});
	} catch (err) {
		// Error is already thrown by getAuthenticatedUser
		throw err;
	}
};

export const PATCH: RequestHandler = async ({ request }) => {
	try {
		const authenticatedUser = await getAuthenticatedUser(request);
		const updates = await request.json();

		// Validate updates (simplified)
		if (updates.username && updates.username.length < 3) {
			throw error(400, 'Username must be at least 3 characters');
		}

		if (updates.age && (updates.age < 13 || updates.age > 120)) {
			throw error(400, 'Age must be between 13 and 120');
		}

		// Update user
		const [updatedUser] = await db
			.update(user)
			.set(updates)
			.where(eq(user.id, authenticatedUser.id))
			.returning();

		return json({
			id: updatedUser.id,
			username: updatedUser.username,
			age: updatedUser.age,
			updatedAt: updatedUser.updatedAt
		});
	} catch (err) {
		// Error is already thrown by validation or getAuthenticatedUser
		throw err;
	}
};
```

```typescript
// src/routes/api/auth/user/+server.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GET, PATCH } from './+server';
import { createTestDb, clearTables } from '../../../../../tests/test-db/setup';
import { user } from '$lib/db/schema';

// Mock the database module
vi.mock('$lib/db', () => ({
	db: {
		select: vi.fn(),
		update: vi.fn(),
		where: vi.fn(),
		from: vi.fn(),
		set: vi.fn(),
		returning: vi.fn()
	}
}));

describe('/api/auth/user', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();

		// Seed test user
		await testDb.insert(user).values({
			id: 'user-123',
			username: 'testuser',
			age: 25,
			passwordHash: 'hashedpassword'
		});
	});

	afterEach(async () => {
		await clearTables();
		vi.clearAllMocks();
	});

	describe('GET /api/auth/user', () => {
		it('should return user profile with valid token', async () => {
			// Create a simple token (in real app, this would be a proper JWT)
			const token = btoa(JSON.stringify({ userId: 'user-123' }));
			const request = new Request('http://localhost/api/auth/user', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			const response = await GET({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data).toEqual({
				id: 'user-123',
				username: 'testuser',
				age: 25,
				createdAt: expect.any(String) // Date serialized as string
			});
		});

		it('should return 401 without authorization header', async () => {
			const request = new Request('http://localhost/api/auth/user');

			await expect(GET({ request } as any)).rejects.toThrow(
				'Missing or invalid authorization header'
			);
		});

		it('should return 401 with invalid token format', async () => {
			const request = new Request('http://localhost/api/auth/user', {
				headers: {
					Authorization: 'InvalidFormat'
				}
			});

			await expect(GET({ request } as any)).rejects.toThrow(
				'Missing or invalid authorization header'
			);
		});

		it('should return 401 with malformed token', async () => {
			const request = new Request('http://localhost/api/auth/user', {
				headers: {
					Authorization: 'Bearer invalid-base64'
				}
			});

			await expect(GET({ request } as any)).rejects.toThrow('Invalid token');
		});

		it('should return 401 for non-existent user', async () => {
			const token = btoa(JSON.stringify({ userId: 'non-existent' }));
			const request = new Request('http://localhost/api/auth/user', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			await expect(GET({ request } as any)).rejects.toThrow('User not found');
		});
	});

	describe('PATCH /api/auth/user', () => {
		it('should update user profile with valid data', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));
			const request = new Request('http://localhost/api/auth/user', {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: 'updateduser',
					age: 30
				})
			});

			const response = await PATCH({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.username).toBe('updateduser');
			expect(data.age).toBe(30);
		});

		it('should reject invalid username', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));
			const request = new Request('http://localhost/api/auth/user', {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: 'ab' // Too short
				})
			});

			await expect(PATCH({ request } as any)).rejects.toThrow(
				'Username must be at least 3 characters'
			);
		});

		it('should reject invalid age', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));
			const request = new Request('http://localhost/api/auth/user', {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					age: 10 // Too young
				})
			});

			await expect(PATCH({ request } as any)).rejects.toThrow('Age must be between 13 and 120');
		});

		it('should handle partial updates', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));
			const request = new Request('http://localhost/api/auth/user', {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					age: 35 // Only updating age
				})
			});

			const response = await PATCH({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.age).toBe(35);
			// Username should remain unchanged (test would verify this)
		});
	});
});
```

## Example 8: Testing File Uploads

Test file upload endpoints with multipart form data:

```typescript
// src/routes/api/upload/avatar/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

async function getAuthenticatedUser(request: Request) {
	const authHeader = request.headers.get('authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw error(401, 'Unauthorized');
	}

	const token = authHeader.slice(7);
	const payload = JSON.parse(atob(token));

	const [userRecord] = await db.select().from(user).where(eq(user.id, payload.userId));

	if (!userRecord) {
		throw error(401, 'User not found');
	}

	return userRecord;
}

async function validateImageFile(file: File): Promise<void> {
	// Check file type
	if (!file.type.startsWith('image/')) {
		throw error(400, 'File must be an image');
	}

	// Check file size (max 5MB)
	if (file.size > 5 * 1024 * 1024) {
		throw error(400, 'File size must be less than 5MB');
	}

	// Check file extension
	const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
	const fileName = file.name.toLowerCase();
	const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

	if (!hasValidExtension) {
		throw error(400, 'Invalid file extension. Allowed: jpg, jpeg, png, gif, webp');
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const authenticatedUser = await getAuthenticatedUser(request);

		const formData = await request.formData();
		const file = formData.get('avatar') as File;

		if (!file) {
			throw error(400, 'No file uploaded');
		}

		await validateImageFile(file);

		// In a real app, you'd upload to cloud storage (S3, Cloudinary, etc.)
		// For this example, we'll just simulate the upload
		const avatarUrl = `https://example.com/avatars/${authenticatedUser.id}/${file.name}`;

		// Update user's avatar URL in database
		const [updatedUser] = await db
			.update(user)
			.set({ avatarUrl })
			.where(eq(user.id, authenticatedUser.id))
			.returning();

		return json({
			message: 'Avatar uploaded successfully',
			avatarUrl,
			userId: updatedUser.id
		});
	} catch (err) {
		throw err;
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const authenticatedUser = await getAuthenticatedUser(request);

		// Remove avatar URL from database
		const [updatedUser] = await db
			.update(user)
			.set({ avatarUrl: null })
			.where(eq(user.id, authenticatedUser.id))
			.returning();

		// In a real app, you'd also delete the file from cloud storage

		return json({
			message: 'Avatar removed successfully',
			userId: updatedUser.id
		});
	} catch (err) {
		throw err;
	}
};
```

```typescript
// src/routes/api/upload/avatar/+server.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { POST, DELETE } from './+server';
import { createTestDb, clearTables } from '../../../../../tests/test-db/setup';
import { user } from '$lib/db/schema';

// Mock cloud storage upload
vi.mock('$lib/storage', () => ({
	uploadFile: vi.fn(),
	deleteFile: vi.fn()
}));

describe('/api/upload/avatar', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();

		// Seed test user
		await testDb.insert(user).values({
			id: 'user-123',
			username: 'testuser',
			age: 25,
			passwordHash: 'hashedpassword'
		});
	});

	afterEach(async () => {
		await clearTables();
		vi.clearAllMocks();
	});

	describe('POST /api/upload/avatar', () => {
		it('should upload avatar successfully', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));

			// Create a mock file
			const fileContent = 'fake-image-content';
			const mockFile = new File([fileContent], 'avatar.jpg', {
				type: 'image/jpeg'
			});

			const formData = new FormData();
			formData.append('avatar', mockFile);

			const request = new Request('http://localhost/api/upload/avatar', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			const response = await POST({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.message).toBe('Avatar uploaded successfully');
			expect(data.avatarUrl).toContain('user-123');
			expect(data.avatarUrl).toContain('avatar.jpg');
			expect(data.userId).toBe('user-123');
		});

		it('should reject non-image files', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));

			const mockFile = new File(['text content'], 'document.txt', {
				type: 'text/plain'
			});

			const formData = new FormData();
			formData.append('avatar', mockFile);

			const request = new Request('http://localhost/api/upload/avatar', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			await expect(POST({ request } as any)).rejects.toThrow('File must be an image');
		});

		it('should reject files that are too large', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));

			// Create a file larger than 5MB
			const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
			const mockFile = new File([largeContent], 'large.jpg', {
				type: 'image/jpeg'
			});

			const formData = new FormData();
			formData.append('avatar', mockFile);

			const request = new Request('http://localhost/api/upload/avatar', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			await expect(POST({ request } as any)).rejects.toThrow('File size must be less than 5MB');
		});

		it('should reject files with invalid extensions', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));

			const mockFile = new File(['content'], 'script.exe', {
				type: 'application/octet-stream'
			});

			const formData = new FormData();
			formData.append('avatar', mockFile);

			const request = new Request('http://localhost/api/upload/avatar', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			await expect(POST({ request } as any)).rejects.toThrow('Invalid file extension');
		});

		it('should require file upload', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));

			const formData = new FormData();
			// No file appended

			const request = new Request('http://localhost/api/upload/avatar', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			await expect(POST({ request } as any)).rejects.toThrow('No file uploaded');
		});

		it('should require authentication', async () => {
			const formData = new FormData();
			const mockFile = new File(['content'], 'avatar.jpg', {
				type: 'image/jpeg'
			});
			formData.append('avatar', mockFile);

			const request = new Request('http://localhost/api/upload/avatar', {
				method: 'POST',
				body: formData
			});

			await expect(POST({ request } as any)).rejects.toThrow('Unauthorized');
		});
	});

	describe('DELETE /api/upload/avatar', () => {
		beforeEach(async () => {
			// Set up user with avatar
			await testDb
				.update(user)
				.set({ avatarUrl: 'https://example.com/avatars/user-123/old-avatar.jpg' })
				.where(eq(user.id, 'user-123'));
		});

		it('should remove avatar successfully', async () => {
			const token = btoa(JSON.stringify({ userId: 'user-123' }));

			const request = new Request('http://localhost/api/upload/avatar', {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			const response = await DELETE({ request } as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.message).toBe('Avatar removed successfully');
			expect(data.userId).toBe('user-123');

			// Verify avatar URL was cleared in database
			const updatedUser = await testDb.select().from(user).where(eq(user.id, 'user-123'));
			expect(updatedUser[0].avatarUrl).toBeNull();
		});

		it('should require authentication', async () => {
			const request = new Request('http://localhost/api/upload/avatar', {
				method: 'DELETE'
			});

			await expect(DELETE({ request } as any)).rejects.toThrow('Unauthorized');
		});
	});
});
```

## Best Practices

### Request/Response Testing

**Status Codes:**

- Test all expected HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Verify appropriate status for each scenario

**Response Headers:**

- Test Content-Type headers
- Test custom headers (authentication, caching)
- Verify CORS headers when applicable

**Response Body:**

- Test exact JSON structure
- Verify data types and formats
- Check for sensitive data exposure

### Error Handling

**Validation Errors:**

- Test schema validation failures
- Verify error messages are user-friendly
- Test nested validation errors

**Authentication/Authorization:**

- Test unauthenticated requests
- Test insufficient permissions
- Test token/session expiration

**Database Errors:**

- Test constraint violations
- Test connection failures
- Test transaction rollbacks

### Mocking Strategies

**RequestEvent Mocking:**

```typescript
const mockRequestEvent = {
	request: new Request('http://localhost'),
	url: new URL('http://localhost'),
	params: { id: '123' },
	locals: { user: mockUser },
	cookies: { get: vi.fn(), set: vi.fn() }
};
```

**Database Mocking:**

- Mock at the query function level
- Use real database for integration tests
- Mock external API calls

### Test Organization

**File Structure:**

```
src/routes/api/
├── users/
│   ├── +server.ts
│   ├── +server.unit.test.ts      # Unit tests with mocks
│   └── +server.integration.test.ts # Integration tests
```

**Test Naming:**

- `should return users for authenticated request`
- `should create user with valid data`
- `should reject invalid user ID format`

### Performance Considerations

**Database Isolation:**

- Use transactions for test data management
- Clean up after each test
- Avoid shared state between tests

**Mock Cleanup:**

- Clear mocks between tests
- Use `vi.restoreAllMocks()` when needed
- Avoid memory leaks in mocked functions

This comprehensive testing approach ensures your SvelteKit API routes are robust, secure, and maintainable. The combination of unit tests with mocks and integration tests with real databases provides confidence in your API's reliability and correctness.
