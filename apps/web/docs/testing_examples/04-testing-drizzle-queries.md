# Testing Drizzle ORM Queries

## Introduction

Testing database operations is crucial for ensuring data integrity and preventing regressions in your application's data layer. Drizzle ORM provides powerful query building capabilities that need comprehensive testing to ensure they work correctly with your database schema.

### Database Testing Strategy

- **Isolated Tests**: Use in-memory databases or separate test databases
- **Test Data Management**: Clean setup and teardown for each test
- **Realistic Data**: Use representative test data that mirrors production
- **Transaction Testing**: Test complex operations within transactions
- **Performance**: Ensure queries are efficient and properly indexed

### Test Database Setup

Based on your existing `tests/test-db/index.ts`, here's how to set up comprehensive database testing:

```typescript
// tests/test-db/setup.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '$lib/server/db/schema';

let sql: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export async function createTestDb() {
	// Use PGLite for in-memory testing instead of a real Postgres instance
	// This is much faster and doesn't require external dependencies
	const { PGlite } = await import('@electric-sql/pglite');
	const client = new PGlite();

	sql = client as any; // PGlite has compatible interface
	db = drizzle(sql, { schema });

	// Create tables
	await createTables();

	return db;
}

export async function createTables() {
	if (!sql) throw new Error('Database not initialized');

	// Create tables based on your actual schema
	await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" text PRIMARY KEY NOT NULL,
      "age" integer,
      "username" text NOT NULL UNIQUE,
      "password_hash" text NOT NULL
    );
  `;

	await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "id" text PRIMARY KEY NOT NULL,
      "user_id" text NOT NULL REFERENCES "user"("id"),
      "expires_at" timestamp with time zone NOT NULL
    );
  `;

	// Add more tables as needed based on your schema
	await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      author_id TEXT NOT NULL REFERENCES "user"(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function clearTables() {
	if (!sql) return;

	// Clear data but keep table structure
	await sql`TRUNCATE TABLE posts, session, "user" CASCADE`;
}

export async function dropTables() {
	if (!sql) return;

	await sql`DROP TABLE IF EXISTS posts CASCADE`;
	await sql`DROP TABLE IF EXISTS session CASCADE`;
	await sql`DROP TABLE IF EXISTS "user" CASCADE`;

	await sql.end();
	sql = null;
	db = null;
}

export { db };
```

## Example 1: Testing SELECT Queries

Test basic and complex SELECT operations to ensure data retrieval works correctly.

```typescript
// src/lib/db/queries/users.ts
import { db } from '$lib/db';
import { user } from '$lib/db/schema';
import { eq, and, or, like, desc } from 'drizzle-orm';

export async function getUserById(userId: string) {
	const [result] = await db.select().from(user).where(eq(user.id, userId));
	return result || null;
}

export async function getUserByUsername(username: string) {
	const [result] = await db.select().from(user).where(eq(user.username, username));
	return result || null;
}

export async function getUsersByAgeRange(minAge: number, maxAge: number) {
	return db
		.select()
		.from(user)
		.where(and(user.age >= minAge, user.age <= maxAge))
		.orderBy(desc(user.age));
}

export async function searchUsers(query: string) {
	return db
		.select()
		.from(user)
		.where(or(like(user.username, `%${query}%`), eq(user.id, query)));
}

export async function getUserWithPosts(userId: string) {
	return db.query.user.findFirst({
		where: eq(user.id, userId),
		with: {
			posts: {
				orderBy: desc(posts.createdAt)
			}
		}
	});
}
```

```typescript
// src/lib/db/queries/users.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, clearTables } from '../../../tests/test-db/setup';
import { user } from '$lib/db/schema';
import {
	getUserById,
	getUserByUsername,
	getUsersByAgeRange,
	searchUsers,
	getUserWithPosts
} from './users';

describe('User Queries', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();

		// Seed test data
		await testDb.insert(user).values([
			{
				id: 'user-1',
				username: 'john_doe',
				age: 25,
				passwordHash: 'hashed_password_1'
			},
			{
				id: 'user-2',
				username: 'jane_smith',
				age: 30,
				passwordHash: 'hashed_password_2'
			},
			{
				id: 'user-3',
				username: 'bob_johnson',
				age: 35,
				passwordHash: 'hashed_password_3'
			}
		]);
	});

	afterEach(async () => {
		await clearTables();
	});

	describe('getUserById', () => {
		it('should return user when found', async () => {
			const result = await getUserById('user-1');

			expect(result).toEqual({
				id: 'user-1',
				username: 'john_doe',
				age: 25,
				passwordHash: 'hashed_password_1'
			});
		});

		it('should return null when user not found', async () => {
			const result = await getUserById('non-existent');

			expect(result).toBeNull();
		});
	});

	describe('getUserByUsername', () => {
		it('should return user when found by username', async () => {
			const result = await getUserByUsername('jane_smith');

			expect(result).toEqual({
				id: 'user-2',
				username: 'jane_smith',
				age: 30,
				passwordHash: 'hashed_password_2'
			});
		});

		it('should return null when username not found', async () => {
			const result = await getUserByUsername('non_existent_user');

			expect(result).toBeNull();
		});
	});

	describe('getUsersByAgeRange', () => {
		it('should return users within age range', async () => {
			const result = await getUsersByAgeRange(20, 35);

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({
				id: 'user-3',
				username: 'bob_johnson',
				age: 35,
				passwordHash: 'hashed_password_3'
			});
			expect(result[1]).toEqual({
				id: 'user-2',
				username: 'jane_smith',
				age: 30,
				passwordHash: 'hashed_password_2'
			});
			expect(result[2]).toEqual({
				id: 'user-1',
				username: 'john_doe',
				age: 25,
				passwordHash: 'hashed_password_1'
			});
		});

		it('should return users within narrower age range', async () => {
			const result = await getUsersByAgeRange(26, 34);

			expect(result).toHaveLength(1);
			expect(result[0].username).toBe('jane_smith');
		});

		it('should return empty array when no users in range', async () => {
			const result = await getUsersByAgeRange(40, 50);

			expect(result).toEqual([]);
		});
	});

	describe('searchUsers', () => {
		it('should find users by partial username match', async () => {
			const result = await searchUsers('john');

			expect(result).toHaveLength(2);
			expect(result.map((u) => u.username)).toEqual(
				expect.arrayContaining(['john_doe', 'bob_johnson'])
			);
		});

		it('should find user by exact ID match', async () => {
			const result = await searchUsers('user-2');

			expect(result).toHaveLength(1);
			expect(result[0].username).toBe('jane_smith');
		});

		it('should return empty array when no matches found', async () => {
			const result = await searchUsers('nonexistent');

			expect(result).toEqual([]);
		});
	});

	describe('getUserWithPosts', () => {
		it('should return user with related posts', async () => {
			// First create posts for testing relations
			await testDb.insert(posts).values([
				{
					title: 'First Post',
					content: 'Content of first post',
					authorId: 'user-1'
				},
				{
					title: 'Second Post',
					content: 'Content of second post',
					authorId: 'user-1'
				}
			]);

			const result = await getUserWithPosts('user-1');

			expect(result).toEqual({
				id: 'user-1',
				username: 'john_doe',
				age: 25,
				passwordHash: 'hashed_password_1',
				posts: [
					expect.objectContaining({
						title: 'Second Post',
						content: 'Content of second post',
						authorId: 'user-1'
					}),
					expect.objectContaining({
						title: 'First Post',
						content: 'Content of first post',
						authorId: 'user-1'
					})
				]
			});
		});

		it('should return user with empty posts array when no posts exist', async () => {
			const result = await getUserWithPosts('user-2');

			expect(result?.posts).toEqual([]);
		});

		it('should return null when user not found', async () => {
			const result = await getUserWithPosts('non-existent');

			expect(result).toBeNull();
		});
	});
});
```

## Example 2: Testing INSERT Queries

Test data insertion operations, including validation and constraint checking.

```typescript
// src/lib/db/queries/users-mutations.ts
import { db } from '$lib/db';
import { user } from '$lib/db/schema';

export interface CreateUserData {
	username: string;
	age?: number;
	passwordHash: string;
}

export async function createUser(userData: CreateUserData) {
	const [result] = await db.insert(user).values(userData).returning();
	return result;
}

export async function createUsers(userData: CreateUserData[]) {
	return db.insert(user).values(userData).returning();
}

export async function upsertUser(userData: CreateUserData) {
	return db
		.insert(user)
		.values(userData)
		.onConflictDoUpdate({
			target: user.username,
			set: {
				age: userData.age,
				passwordHash: userData.passwordHash
			}
		})
		.returning();
}

export async function createUserWithId(userData: CreateUserData & { id: string }) {
	const [result] = await db.insert(user).values(userData).returning();
	return result;
}
```

```typescript
// src/lib/db/queries/users-mutations.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, clearTables } from '../../../tests/test-db/setup';
import { user } from '$lib/db/schema';
import { createUser, createUsers, upsertUser, createUserWithId } from './users-mutations';

describe('User Mutations', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();
	});

	afterEach(async () => {
		await clearTables();
	});

	describe('createUser', () => {
		it('should create a new user with generated ID', async () => {
			const userData = {
				username: 'new_user',
				age: 28,
				passwordHash: 'hashed_password'
			};

			const result = await createUser(userData);

			expect(result).toEqual({
				id: expect.any(String), // ID is auto-generated
				username: 'new_user',
				age: 28,
				passwordHash: 'hashed_password'
			});

			// Verify user was actually inserted
			const insertedUser = await testDb.select().from(user).where(eq(user.username, 'new_user'));
			expect(insertedUser).toHaveLength(1);
			expect(insertedUser[0]).toEqual(result);
		});

		it('should create user with minimal required data', async () => {
			const userData = {
				username: 'minimal_user',
				passwordHash: 'hashed_password'
			};

			const result = await createUser(userData);

			expect(result.username).toBe('minimal_user');
			expect(result.age).toBeNull(); // Optional field
			expect(result.passwordHash).toBe('hashed_password');
		});

		it('should throw error on duplicate username', async () => {
			// Create first user
			await createUser({
				username: 'duplicate_user',
				passwordHash: 'password1'
			});

			// Attempt to create user with same username
			await expect(
				createUser({
					username: 'duplicate_user',
					passwordHash: 'password2'
				})
			).rejects.toThrow();
		});
	});

	describe('createUsers', () => {
		it('should create multiple users in batch', async () => {
			const usersData = [
				{ username: 'user1', age: 20, passwordHash: 'hash1' },
				{ username: 'user2', age: 25, passwordHash: 'hash2' },
				{ username: 'user3', age: 30, passwordHash: 'hash3' }
			];

			const result = await createUsers(usersData);

			expect(result).toHaveLength(3);
			result.forEach((user, index) => {
				expect(user.username).toBe(usersData[index].username);
				expect(user.age).toBe(usersData[index].age);
				expect(user.passwordHash).toBe(usersData[index].passwordHash);
				expect(user.id).toBeDefined();
			});

			// Verify all users were inserted
			const allUsers = await testDb.select().from(user);
			expect(allUsers).toHaveLength(3);
		});

		it('should handle empty array', async () => {
			const result = await createUsers([]);
			expect(result).toEqual([]);
		});
	});

	describe('upsertUser', () => {
		it('should insert new user when username does not exist', async () => {
			const userData = {
				username: 'new_user',
				age: 22,
				passwordHash: 'new_hash'
			};

			const result = await upsertUser(userData);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				id: expect.any(String),
				username: 'new_user',
				age: 22,
				passwordHash: 'new_hash'
			});
		});

		it('should update existing user when username exists', async () => {
			// Create initial user
			const initialUser = await createUser({
				username: 'existing_user',
				age: 25,
				passwordHash: 'old_hash'
			});

			// Upsert with same username but different data
			const updatedData = {
				username: 'existing_user',
				age: 30,
				passwordHash: 'new_hash'
			};

			const result = await upsertUser(updatedData);

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe(initialUser.id); // Same ID
			expect(result[0].username).toBe('existing_user'); // Same username
			expect(result[0].age).toBe(30); // Updated age
			expect(result[0].passwordHash).toBe('new_hash'); // Updated password

			// Verify only one user exists
			const allUsers = await testDb.select().from(user);
			expect(allUsers).toHaveLength(1);
		});
	});

	describe('createUserWithId', () => {
		it('should create user with specified ID', async () => {
			const customId = 'custom-user-id-123';
			const userData = {
				id: customId,
				username: 'custom_user',
				age: 35,
				passwordHash: 'custom_hash'
			};

			const result = await createUserWithId(userData);

			expect(result.id).toBe(customId);
			expect(result.username).toBe('custom_user');
			expect(result.age).toBe(35);
			expect(result.passwordHash).toBe('custom_hash');
		});
	});
});
```

## Example 3: Testing UPDATE Queries

Test data modification operations with proper validation.

```typescript
// src/lib/db/queries/user-updates.ts
import { db } from '$lib/db';
import { user } from '$lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export interface UpdateUserData {
	age?: number;
	passwordHash?: string;
}

export async function updateUser(userId: string, updates: UpdateUserData) {
	const [result] = await db.update(user).set(updates).where(eq(user.id, userId)).returning();

	return result || null;
}

export async function updateUserByUsername(username: string, updates: UpdateUserData) {
	const [result] = await db
		.update(user)
		.set(updates)
		.where(eq(user.username, username))
		.returning();

	return result || null;
}

export async function incrementUserAge(userId: string, incrementBy: number = 1) {
	const [result] = await db
		.update(user)
		.set({
			age: sql`${user.age} + ${incrementBy}`
		})
		.where(eq(user.id, userId))
		.returning();

	return result || null;
}

export async function bulkUpdateUserAges(minAge: number, ageIncrement: number) {
	return db
		.update(user)
		.set({
			age: sql`${user.age} + ${ageIncrement}`
		})
		.where(sql`${user.age} >= ${minAge}`)
		.returning();
}
```

```typescript
// src/lib/db/queries/user-updates.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, clearTables } from '../../../tests/test-db/setup';
import { user } from '$lib/db/schema';
import {
	updateUser,
	updateUserByUsername,
	incrementUserAge,
	bulkUpdateUserAges
} from './user-updates';

describe('User Updates', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();

		// Seed test data
		await testDb.insert(user).values([
			{
				id: 'user-1',
				username: 'john_doe',
				age: 25,
				passwordHash: 'hash1'
			},
			{
				id: 'user-2',
				username: 'jane_smith',
				age: 30,
				passwordHash: 'hash2'
			}
		]);
	});

	afterEach(async () => {
		await clearTables();
	});

	describe('updateUser', () => {
		it('should update user age', async () => {
			const result = await updateUser('user-1', { age: 26 });

			expect(result).toEqual({
				id: 'user-1',
				username: 'john_doe',
				age: 26,
				passwordHash: 'hash1'
			});

			// Verify in database
			const updatedUser = await testDb.select().from(user).where(eq(user.id, 'user-1'));
			expect(updatedUser[0].age).toBe(26);
		});

		it('should update user password', async () => {
			const result = await updateUser('user-1', { passwordHash: 'new_hash' });

			expect(result?.passwordHash).toBe('new_hash');

			// Verify in database
			const updatedUser = await testDb.select().from(user).where(eq(user.id, 'user-1'));
			expect(updatedUser[0].passwordHash).toBe('new_hash');
		});

		it('should update multiple fields at once', async () => {
			const result = await updateUser('user-1', {
				age: 27,
				passwordHash: 'updated_hash'
			});

			expect(result).toEqual({
				id: 'user-1',
				username: 'john_doe',
				age: 27,
				passwordHash: 'updated_hash'
			});
		});

		it('should return null when user not found', async () => {
			const result = await updateUser('non-existent', { age: 99 });

			expect(result).toBeNull();
		});
	});

	describe('updateUserByUsername', () => {
		it('should update user by username', async () => {
			const result = await updateUserByUsername('jane_smith', { age: 31 });

			expect(result?.username).toBe('jane_smith');
			expect(result?.age).toBe(31);

			// Verify in database
			const updatedUser = await testDb.select().from(user).where(eq(user.username, 'jane_smith'));
			expect(updatedUser[0].age).toBe(31);
		});

		it('should return null when username not found', async () => {
			const result = await updateUserByUsername('non_existent_user', { age: 99 });

			expect(result).toBeNull();
		});
	});

	describe('incrementUserAge', () => {
		it('should increment user age by default amount (1)', async () => {
			const result = await incrementUserAge('user-1');

			expect(result?.age).toBe(26); // 25 + 1

			// Verify in database
			const updatedUser = await testDb.select().from(user).where(eq(user.id, 'user-1'));
			expect(updatedUser[0].age).toBe(26);
		});

		it('should increment user age by specified amount', async () => {
			const result = await incrementUserAge('user-2', 5);

			expect(result?.age).toBe(35); // 30 + 5

			// Verify in database
			const updatedUser = await testDb.select().from(user).where(eq(user.id, 'user-2'));
			expect(updatedUser[0].age).toBe(35);
		});

		it('should handle negative increments', async () => {
			const result = await incrementUserAge('user-1', -3);

			expect(result?.age).toBe(22); // 25 - 3
		});

		it('should return null when user not found', async () => {
			const result = await incrementUserAge('non-existent', 10);

			expect(result).toBeNull();
		});
	});

	describe('bulkUpdateUserAges', () => {
		beforeEach(async () => {
			// Add more test users
			await testDb.insert(user).values([
				{ id: 'user-3', username: 'young_user', age: 20, passwordHash: 'hash3' },
				{ id: 'user-4', username: 'older_user', age: 40, passwordHash: 'hash4' }
			]);
		});

		it('should increment ages for users above minimum age', async () => {
			const result = await bulkUpdateUserAges(25, 2);

			// Should update users with age >= 25: user-2 (30), user-4 (40)
			expect(result).toHaveLength(2);

			const updatedUsers = result.sort((a, b) => a.age - b.age);
			expect(updatedUsers[0].age).toBe(32); // 30 + 2
			expect(updatedUsers[1].age).toBe(42); // 40 + 2

			// user-1 (25) should not be updated (25 is not >= 25? Wait, >= 25 should include 25)
			// Actually, let's check the logic - minAge parameter means users with age >= minAge
			// So user-1 (25), user-2 (30), user-4 (40) should be updated
			const allResults = await bulkUpdateUserAges(25, 2);
			expect(allResults).toHaveLength(3);
		});

		it('should handle no users meeting criteria', async () => {
			const result = await bulkUpdateUserAges(50, 1);

			expect(result).toEqual([]);
		});

		it('should increment all users when minAge is low', async () => {
			const result = await bulkUpdateUserAges(15, 1);

			expect(result).toHaveLength(4); // All users should be updated

			// Verify all ages incremented
			const allUsers = await testDb.select().from(user).orderBy(user.age);
			expect(allUsers[0].age).toBe(21); // 20 + 1
			expect(allUsers[1].age).toBe(26); // 25 + 1
			expect(allUsers[2].age).toBe(31); // 30 + 1
			expect(allUsers[3].age).toBe(41); // 40 + 1
		});
	});
});
```

## Example 4: Testing DELETE Queries

Test data deletion operations with proper cascade handling.

```typescript
// src/lib/db/queries/user-deletes.ts
import { db } from '$lib/db';
import { user, session } from '$lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function deleteUser(userId: string) {
	const [result] = await db.delete(user).where(eq(user.id, userId)).returning();

	return result || null;
}

export async function deleteUserByUsername(username: string) {
	const [result] = await db.delete(user).where(eq(user.username, username)).returning();

	return result || null;
}

export async function deleteInactiveUsers() {
	// Delete users who don't have any active sessions (simplified logic)
	return db
		.delete(user)
		.where(
			sql`NOT EXISTS (
      SELECT 1 FROM session
      WHERE session.user_id = ${user.id}
      AND session.expires_at > NOW()
    )`
		)
		.returning();
}

export async function deleteUsersByAge(minAge: number) {
	return db
		.delete(user)
		.where(sql`${user.age} >= ${minAge}`)
		.returning();
}
```

```typescript
// src/lib/db/queries/user-deletes.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, clearTables } from '../../../tests/test-db/setup';
import { user, session } from '$lib/db/schema';
import {
	deleteUser,
	deleteUserByUsername,
	deleteInactiveUsers,
	deleteUsersByAge
} from './user-deletes';

describe('User Deletes', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();

		// Seed test data
		await testDb.insert(user).values([
			{
				id: 'user-1',
				username: 'john_doe',
				age: 25,
				passwordHash: 'hash1'
			},
			{
				id: 'user-2',
				username: 'jane_smith',
				age: 30,
				passwordHash: 'hash2'
			},
			{
				id: 'user-3',
				username: 'bob_johnson',
				age: 35,
				passwordHash: 'hash3'
			}
		]);

		// Add sessions for some users
		await testDb.insert(session).values([
			{
				id: 'session-1',
				userId: 'user-1',
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Future date
			},
			{
				id: 'session-2',
				userId: 'user-2',
				expiresAt: new Date(Date.now() - 60 * 1000) // Past date
			}
		]);
	});

	afterEach(async () => {
		await clearTables();
	});

	describe('deleteUser', () => {
		it('should delete user by ID and return deleted user', async () => {
			const result = await deleteUser('user-1');

			expect(result).toEqual({
				id: 'user-1',
				username: 'john_doe',
				age: 25,
				passwordHash: 'hash1'
			});

			// Verify user was deleted from database
			const remainingUsers = await testDb.select().from(user);
			expect(remainingUsers).toHaveLength(2);
			expect(remainingUsers.map((u) => u.id)).not.toContain('user-1');
		});

		it('should cascade delete related sessions', async () => {
			await deleteUser('user-1');

			// Verify user's session was also deleted
			const remainingSessions = await testDb.select().from(session);
			expect(remainingSessions.map((s) => s.userId)).not.toContain('user-1');
		});

		it('should return null when user not found', async () => {
			const result = await deleteUser('non-existent');

			expect(result).toBeNull();
		});
	});

	describe('deleteUserByUsername', () => {
		it('should delete user by username', async () => {
			const result = await deleteUserByUsername('jane_smith');

			expect(result?.username).toBe('jane_smith');

			// Verify user was deleted
			const remainingUsers = await testDb.select().from(user);
			expect(remainingUsers.map((u) => u.username)).not.toContain('jane_smith');
		});

		it('should return null when username not found', async () => {
			const result = await deleteUserByUsername('non_existent_user');

			expect(result).toBeNull();
		});
	});

	describe('deleteInactiveUsers', () => {
		it('should delete users without active sessions', async () => {
			const result = await deleteInactiveUsers();

			// user-1 has an active session (future expiration)
			// user-2 has an expired session
			// user-3 has no session at all
			// So user-2 and user-3 should be deleted
			expect(result).toHaveLength(2);

			const remainingUsers = await testDb.select().from(user);
			expect(remainingUsers).toHaveLength(1);
			expect(remainingUsers[0].id).toBe('user-1');
		});

		it('should not delete users with active sessions', async () => {
			await deleteInactiveUsers();

			// Verify user-1 still exists (has active session)
			const remainingUser = await testDb.select().from(user).where(eq(user.id, 'user-1'));
			expect(remainingUser).toHaveLength(1);
		});
	});

	describe('deleteUsersByAge', () => {
		it('should delete users above minimum age', async () => {
			const result = await deleteUsersByAge(30);

			// Should delete users with age >= 30: user-2 (30) and user-3 (35)
			expect(result).toHaveLength(2);

			const remainingUsers = await testDb.select().from(user);
			expect(remainingUsers).toHaveLength(1);
			expect(remainingUsers[0].username).toBe('john_doe'); // age 25
		});

		it('should delete all users when minAge is low', async () => {
			const result = await deleteUsersByAge(20);

			expect(result).toHaveLength(3); // All users deleted

			const remainingUsers = await testDb.select().from(user);
			expect(remainingUsers).toEqual([]);
		});

		it('should delete no users when minAge is high', async () => {
			const result = await deleteUsersByAge(50);

			expect(result).toEqual([]);

			const allUsers = await testDb.select().from(user);
			expect(allUsers).toHaveLength(3);
		});
	});
});
```

## Example 5: Testing Transactions

Test complex multi-step operations within database transactions.

```typescript
// src/lib/db/transactions/user-transactions.ts
import { db } from '$lib/db';
import { user, session } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export interface TransferSessionData {
	fromUserId: string;
	toUserId: string;
	sessionId: string;
}

export async function transferSessionOwnership(data: TransferSessionData) {
	return db.transaction(async (tx) => {
		// Verify session belongs to fromUser
		const [sessionToTransfer] = await tx
			.select()
			.from(session)
			.where(eq(session.id, data.sessionId));

		if (!sessionToTransfer || sessionToTransfer.userId !== data.fromUserId) {
			throw new Error('Session not found or does not belong to specified user');
		}

		// Verify target user exists
		const [targetUser] = await tx.select().from(user).where(eq(user.id, data.toUserId));

		if (!targetUser) {
			throw new Error('Target user not found');
		}

		// Transfer session ownership
		await tx.update(session).set({ userId: data.toUserId }).where(eq(session.id, data.sessionId));

		return {
			sessionId: data.sessionId,
			oldOwnerId: data.fromUserId,
			newOwnerId: data.toUserId
		};
	});
}

export async function createUserWithSession(userData: any, sessionData: any) {
	return db.transaction(async (tx) => {
		// Create user
		const [newUser] = await tx.insert(user).values(userData).returning();

		// Create session for the new user
		const [newSession] = await tx
			.insert(session)
			.values({
				...sessionData,
				userId: newUser.id
			})
			.returning();

		return {
			user: newUser,
			session: newSession
		};
	});
}

export async function deactivateUser(userId: string) {
	return db.transaction(async (tx) => {
		// Mark user as inactive (in a real app, you'd add an active field)
		// For this example, we'll just delete all their sessions

		const userSessions = await tx.select().from(session).where(eq(session.userId, userId));

		if (userSessions.length === 0) {
			throw new Error('User has no active sessions to deactivate');
		}

		// Delete all user sessions
		await tx.delete(session).where(eq(session.userId, userId));

		return {
			userId,
			deletedSessionsCount: userSessions.length
		};
	});
}
```

```typescript
// src/lib/db/transactions/user-transactions.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, clearTables } from '../../../tests/test-db/setup';
import { user, session } from '$lib/db/schema';
import {
	transferSessionOwnership,
	createUserWithSession,
	deactivateUser
} from './user-transactions';

describe('User Transactions', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();

		// Seed test data
		await testDb.insert(user).values([
			{
				id: 'user-1',
				username: 'alice',
				age: 28,
				passwordHash: 'hash1'
			},
			{
				id: 'user-2',
				username: 'bob',
				age: 32,
				passwordHash: 'hash2'
			},
			{
				id: 'user-3',
				username: 'charlie',
				age: 25,
				passwordHash: 'hash3'
			}
		]);

		await testDb.insert(session).values([
			{
				id: 'session-1',
				userId: 'user-1',
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
			},
			{
				id: 'session-2',
				userId: 'user-1',
				expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
			},
			{
				id: 'session-3',
				userId: 'user-2',
				expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
			}
		]);
	});

	afterEach(async () => {
		await clearTables();
	});

	describe('transferSessionOwnership', () => {
		it('should successfully transfer session ownership', async () => {
			const result = await transferSessionOwnership({
				fromUserId: 'user-1',
				toUserId: 'user-2',
				sessionId: 'session-1'
			});

			expect(result).toEqual({
				sessionId: 'session-1',
				oldOwnerId: 'user-1',
				newOwnerId: 'user-2'
			});

			// Verify session ownership changed
			const updatedSession = await testDb.select().from(session).where(eq(session.id, 'session-1'));

			expect(updatedSession[0].userId).toBe('user-2');
		});

		it('should fail when session does not belong to fromUser', async () => {
			await expect(
				transferSessionOwnership({
					fromUserId: 'user-2', // Wrong owner
					toUserId: 'user-3',
					sessionId: 'session-1' // Belongs to user-1
				})
			).rejects.toThrow('Session not found or does not belong to specified user');

			// Verify session ownership didn't change
			const sessionCheck = await testDb.select().from(session).where(eq(session.id, 'session-1'));

			expect(sessionCheck[0].userId).toBe('user-1');
		});

		it('should fail when session does not exist', async () => {
			await expect(
				transferSessionOwnership({
					fromUserId: 'user-1',
					toUserId: 'user-2',
					sessionId: 'non-existent-session'
				})
			).rejects.toThrow('Session not found or does not belong to specified user');
		});

		it('should fail when target user does not exist', async () => {
			await expect(
				transferSessionOwnership({
					fromUserId: 'user-1',
					toUserId: 'non-existent-user',
					sessionId: 'session-1'
				})
			).rejects.toThrow('Target user not found');
		});
	});

	describe('createUserWithSession', () => {
		it('should create user and session atomically', async () => {
			const userData = {
				username: 'new_user',
				age: 27,
				passwordHash: 'new_hash'
			};

			const sessionData = {
				id: 'new-session-id',
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
			};

			const result = await createUserWithSession(userData, sessionData);

			expect(result.user.username).toBe('new_user');
			expect(result.user.age).toBe(27);
			expect(result.session.id).toBe('new-session-id');
			expect(result.session.userId).toBe(result.user.id);

			// Verify both were created
			const createdUser = await testDb.select().from(user).where(eq(user.username, 'new_user'));

			const createdSession = await testDb
				.select()
				.from(session)
				.where(eq(session.id, 'new-session-id'));

			expect(createdUser).toHaveLength(1);
			expect(createdSession).toHaveLength(1);
			expect(createdSession[0].userId).toBe(createdUser[0].id);
		});

		it('should rollback on duplicate username', async () => {
			const userData = {
				username: 'alice', // Already exists
				age: 30,
				passwordHash: 'hash'
			};

			const sessionData = {
				id: 'should-not-be-created',
				expiresAt: new Date()
			};

			await expect(createUserWithSession(userData, sessionData)).rejects.toThrow(); // Unique constraint violation

			// Verify session was not created (transaction rolled back)
			const sessionCheck = await testDb
				.select()
				.from(session)
				.where(eq(session.id, 'should-not-be-created'));

			expect(sessionCheck).toHaveLength(0);
		});
	});

	describe('deactivateUser', () => {
		it('should deactivate user by removing all sessions', async () => {
			const result = await deactivateUser('user-1');

			expect(result).toEqual({
				userId: 'user-1',
				deletedSessionsCount: 2 // user-1 had 2 sessions
			});

			// Verify sessions were deleted
			const remainingSessions = await testDb
				.select()
				.from(session)
				.where(eq(session.userId, 'user-1'));

			expect(remainingSessions).toEqual([]);

			// Verify user still exists
			const userCheck = await testDb.select().from(user).where(eq(user.id, 'user-1'));

			expect(userCheck).toHaveLength(1);
		});

		it('should fail when user has no active sessions', async () => {
			await expect(deactivateUser('user-3')).rejects.toThrow(
				'User has no active sessions to deactivate'
			);

			// Verify no sessions were deleted
			const allSessions = await testDb.select().from(session);
			expect(allSessions).toHaveLength(3);
		});
	});
});
```

## Example 6: Testing Complex Joins

Test queries with multiple table joins and aggregations.

```typescript
// src/lib/db/queries/analytics.ts
import { db } from '$lib/db';
import { user, posts } from '$lib/db/schema';
import { eq, desc, count, avg, sql } from 'drizzle-orm';

export interface UserStats {
	userId: string;
	username: string;
	postCount: number;
	avgPostLength: number;
}

export async function getUserPostStats(): Promise<UserStats[]> {
	const result = await db
		.select({
			userId: user.id,
			username: user.username,
			postCount: count(posts.id),
			avgPostLength: avg(sql<number>`length(${posts.content})`)
		})
		.from(user)
		.leftJoin(posts, eq(user.id, posts.authorId))
		.groupBy(user.id, user.username)
		.orderBy(desc(count(posts.id)));

	return result.map((row) => ({
		userId: row.userId!,
		username: row.username!,
		postCount: Number(row.postCount),
		avgPostLength: row.avgPostLength ? Math.round(Number(row.avgPostLength)) : 0
	}));
}

export async function getPostsWithAuthors(limit: number = 10) {
	return db
		.select({
			postId: posts.id,
			title: posts.title,
			content: posts.content,
			createdAt: posts.createdAt,
			author: {
				id: user.id,
				username: user.username,
				age: user.age
			}
		})
		.from(posts)
		.innerJoin(user, eq(posts.authorId, user.id))
		.orderBy(desc(posts.createdAt))
		.limit(limit);
}

export async function getPopularAuthors(minPosts: number = 1) {
	const subquery = db
		.select({
			authorId: posts.authorId,
			postCount: count(posts.id).as('post_count')
		})
		.from(posts)
		.groupBy(posts.authorId)
		.having(sql`${count(posts.id)} >= ${minPosts}`)
		.as('author_stats');

	return db
		.select({
			id: user.id,
			username: user.username,
			age: user.age,
			postCount: subquery.postCount
		})
		.from(user)
		.innerJoin(subquery, eq(user.id, subquery.authorId))
		.orderBy(desc(subquery.postCount));
}
```

```typescript
// src/lib/db/queries/analytics.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, clearTables } from '../../../tests/test-db/setup';
import { user, posts } from '$lib/db/schema';
import { getUserPostStats, getPostsWithAuthors, getPopularAuthors } from './analytics';

describe('Analytics Queries', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();

		// Seed test data
		await testDb.insert(user).values([
			{
				id: 'user-1',
				username: 'alice_writes',
				age: 28,
				passwordHash: 'hash1'
			},
			{
				id: 'user-2',
				username: 'bob_reader',
				age: 32,
				passwordHash: 'hash2'
			},
			{
				id: 'user-3',
				username: 'charlie_prolific',
				age: 25,
				passwordHash: 'hash3'
			},
			{
				id: 'user-4',
				username: 'diana_quiet',
				age: 30,
				passwordHash: 'hash4'
			}
		]);

		await testDb.insert(posts).values([
			// Alice: 2 posts
			{
				title: 'First Post',
				content: 'This is a short post',
				authorId: 'user-1'
			},
			{
				title: 'Second Post',
				content: 'This is a much longer post with more content to test average length calculations',
				authorId: 'user-1'
			},
			// Bob: 1 post
			{
				title: 'Only Post',
				content: 'Just one post from Bob',
				authorId: 'user-2'
			},
			// Charlie: 3 posts
			{
				title: 'Post A',
				content: 'Content A',
				authorId: 'user-3'
			},
			{
				title: 'Post B',
				content: 'Content B is slightly longer than content A',
				authorId: 'user-3'
			},
			{
				title: 'Post C',
				content: 'Content C is the longest content of all the posts in this test',
				authorId: 'user-3'
			}
			// Diana: 0 posts
		]);
	});

	afterEach(async () => {
		await clearTables();
	});

	describe('getUserPostStats', () => {
		it('should return post statistics for all users', async () => {
			const stats = await getUserPostStats();

			expect(stats).toHaveLength(4); // All users, even those with 0 posts

			// Sort by post count descending (as per query)
			const sortedStats = stats.sort((a, b) => b.postCount - a.postCount);

			// Charlie should be first (3 posts)
			expect(sortedStats[0]).toEqual({
				userId: 'user-3',
				username: 'charlie_prolific',
				postCount: 3,
				avgPostLength: expect.any(Number) // We'll check the calculation below
			});

			// Alice should be second (2 posts)
			expect(sortedStats[1]).toEqual({
				userId: 'user-1',
				username: 'alice_writes',
				postCount: 2,
				avgPostLength: expect.any(Number)
			});

			// Bob should be third (1 post)
			expect(sortedStats[2]).toEqual({
				userId: 'user-2',
				username: 'bob_reader',
				postCount: 1,
				avgPostLength: 21 // length of "Just one post from Bob"
			});

			// Diana should be last (0 posts)
			expect(sortedStats[3]).toEqual({
				userId: 'user-4',
				username: 'diana_quiet',
				postCount: 0,
				avgPostLength: 0
			});
		});

		it('should calculate average post length correctly', async () => {
			const stats = await getUserPostStats();

			const aliceStats = stats.find((s) => s.userId === 'user-1');
			expect(aliceStats?.postCount).toBe(2);

			// Alice's posts: "This is a short post" (21 chars) + longer post (80 chars) = avg ~50
			const expectedAvg = Math.round((21 + 80) / 2);
			expect(aliceStats?.avgPostLength).toBe(expectedAvg);

			const charlieStats = stats.find((s) => s.userId === 'user-3');
			expect(charlieStats?.postCount).toBe(3);

			// Charlie's posts: lengths should be calculated correctly
			expect(charlieStats?.avgPostLength).toBeGreaterThan(0);
		});
	});

	describe('getPostsWithAuthors', () => {
		it('should return posts with author information', async () => {
			const postsWithAuthors = await getPostsWithAuthors();

			expect(postsWithAuthors).toHaveLength(6); // All posts

			// Check that each post has the correct structure
			postsWithAuthors.forEach((post) => {
				expect(post).toHaveProperty('postId');
				expect(post).toHaveProperty('title');
				expect(post).toHaveProperty('content');
				expect(post).toHaveProperty('createdAt');
				expect(post).toHaveProperty('author');

				expect(post.author).toHaveProperty('id');
				expect(post.author).toHaveProperty('username');
				expect(post.author).toHaveProperty('age');
			});
		});

		it('should order posts by creation date descending', async () => {
			const postsWithAuthors = await getPostsWithAuthors();

			// Since we inserted posts in order, the last inserted should be first
			expect(postsWithAuthors[0].title).toBe('Post C');
			expect(postsWithAuthors[1].title).toBe('Post B');
			expect(postsWithAuthors[2].title).toBe('Post A');
		});

		it('should limit results when specified', async () => {
			const limitedPosts = await getPostsWithAuthors(3);

			expect(limitedPosts).toHaveLength(3);
		});

		it('should include correct author information', async () => {
			const postsWithAuthors = await getPostsWithAuthors();

			const alicePost = postsWithAuthors.find((p) => p.author.username === 'alice_writes');
			expect(alicePost?.author).toEqual({
				id: 'user-1',
				username: 'alice_writes',
				age: 28
			});
		});
	});

	describe('getPopularAuthors', () => {
		it('should return authors with minimum number of posts', async () => {
			const popularAuthors = await getPopularAuthors(2);

			expect(popularAuthors).toHaveLength(2); // Alice (2) and Charlie (3)

			// Should be ordered by post count descending
			expect(popularAuthors[0].username).toBe('charlie_prolific');
			expect(popularAuthors[1].username).toBe('alice_writes');

			// Should include post count
			expect(popularAuthors[0].postCount).toBe(3);
			expect(popularAuthors[1].postCount).toBe(2);
		});

		it('should return all authors with posts when minPosts is 1', async () => {
			const popularAuthors = await getPopularAuthors(1);

			expect(popularAuthors).toHaveLength(3); // Alice, Bob, Charlie

			// Verify Bob is included
			const bob = popularAuthors.find((a) => a.username === 'bob_reader');
			expect(bob?.postCount).toBe(1);
		});

		it('should return empty array when no authors meet minimum', async () => {
			const popularAuthors = await getPopularAuthors(10);

			expect(popularAuthors).toEqual([]);
		});

		it('should exclude users with no posts', async () => {
			const popularAuthors = await getPopularAuthors(0);

			// Should not include Diana who has 0 posts
			const diana = popularAuthors.find((a) => a.username === 'diana_quiet');
			expect(diana).toBeUndefined();
		});
	});
});
```

## Example 7: Testing Row Level Security

Test RLS policies with different user contexts using Supabase's testing patterns:

```typescript
// src/lib/db/queries/posts-rls.ts
import { db } from '$lib/db';
import { posts } from '$lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function getPostsForUser(userId: string) {
	// RLS will automatically filter posts based on user permissions
	return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPublishedPosts() {
	// Only return published posts (RLS policy should handle visibility)
	return db
		.select()
		.from(posts)
		.where(eq(posts.status, 'published'))
		.orderBy(desc(posts.createdAt));
}

export async function createPostForUser(
	userId: string,
	postData: {
		title: string;
		content: string;
		status: 'draft' | 'published';
	}
) {
	return db
		.insert(posts)
		.values({
			title: postData.title,
			content: postData.content,
			authorId: userId,
			status: postData.status
		})
		.returning();
}

export async function updatePostForUser(
	postId: string,
	userId: string,
	updates: {
		title?: string;
		content?: string;
		status?: 'draft' | 'published';
	}
) {
	return db
		.update(posts)
		.set(updates)
		.where(
			and(
				eq(posts.id, postId),
				eq(posts.authorId, userId) // Ensure user owns the post
			)
		)
		.returning();
}
```

```typescript
// src/lib/db/queries/posts-rls.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, clearTables } from '../../../tests/test-db/setup';
import { user, posts } from '$lib/db/schema';
import {
	getPostsForUser,
	getPublishedPosts,
	createPostForUser,
	updatePostForUser
} from './posts-rls';

describe('Posts RLS Queries', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();

		// Seed test data
		await testDb.insert(user).values([
			{ id: 'user-1', username: 'alice', age: 25, passwordHash: 'hash1' },
			{ id: 'user-2', username: 'bob', age: 30, passwordHash: 'hash2' },
			{ id: 'user-3', username: 'charlie', age: 35, passwordHash: 'hash3' }
		]);

		await testDb.insert(posts).values([
			{
				title: 'Alice Post 1',
				content: 'Content 1',
				authorId: 'user-1',
				status: 'published'
			},
			{
				title: 'Alice Post 2',
				content: 'Content 2',
				authorId: 'user-1',
				status: 'draft'
			},
			{
				title: 'Bob Post 1',
				content: 'Content 3',
				authorId: 'user-2',
				status: 'published'
			},
			{
				title: 'Charlie Post 1',
				content: 'Content 4',
				authorId: 'user-3',
				status: 'draft'
			}
		]);
	});

	afterEach(async () => {
		await clearTables();
	});

	describe('getPostsForUser', () => {
		// Note: In real RLS testing, you would set the auth context
		// This example shows the query logic - RLS policies would filter results

		it('should return posts when user has access', async () => {
			// In a real scenario with RLS enabled, this would only return posts
			// the authenticated user has permission to see
			const userPosts = await getPostsForUser('user-1');

			expect(userPosts.length).toBeGreaterThan(0);
			// RLS would typically filter these results based on auth context
		});
	});

	describe('getPublishedPosts', () => {
		it('should return only published posts', async () => {
			const publishedPosts = await getPublishedPosts();

			expect(publishedPosts.length).toBe(2);
			publishedPosts.forEach((post) => {
				expect(post.status).toBe('published');
			});

			const titles = publishedPosts.map((p) => p.title).sort();
			expect(titles).toEqual(['Alice Post 1', 'Bob Post 1']);
		});

		it('should exclude draft posts', async () => {
			const publishedPosts = await getPublishedPosts();
			const draftPosts = publishedPosts.filter((p) => p.status === 'draft');

			expect(draftPosts).toHaveLength(0);
		});
	});

	describe('createPostForUser', () => {
		it('should create a post for the specified user', async () => {
			const postData = {
				title: 'New Post',
				content: 'New content',
				status: 'draft' as const
			};

			const result = await createPostForUser('user-1', postData);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				id: expect.any(String),
				title: 'New Post',
				content: 'New content',
				authorId: 'user-1',
				status: 'draft',
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date)
			});

			// Verify post was created in database
			const dbPost = await testDb.select().from(posts).where(eq(posts.title, 'New Post'));
			expect(dbPost).toHaveLength(1);
			expect(dbPost[0].authorId).toBe('user-1');
		});

		it('should create published posts', async () => {
			const postData = {
				title: 'Published Post',
				content: 'Published content',
				status: 'published' as const
			};

			await createPostForUser('user-2', postData);

			// Verify it's included in published posts query
			const publishedPosts = await getPublishedPosts();
			const newPost = publishedPosts.find((p) => p.title === 'Published Post');

			expect(newPost).toBeDefined();
			expect(newPost?.authorId).toBe('user-2');
		});
	});

	describe('updatePostForUser', () => {
		let postId: string;

		beforeEach(async () => {
			// Create a test post and get its ID
			const result = await createPostForUser('user-1', {
				title: 'Test Post',
				content: 'Test content',
				status: 'draft'
			});
			postId = result[0].id;
		});

		it('should update post when user owns it', async () => {
			const updates = {
				title: 'Updated Title',
				status: 'published' as const
			};

			const result = await updatePostForUser(postId, 'user-1', updates);

			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('Updated Title');
			expect(result[0].status).toBe('published');
			expect(result[0].authorId).toBe('user-1'); // Unchanged
		});

		it('should not update post when user does not own it', async () => {
			const updates = {
				title: 'Hacked Title'
			};

			const result = await updatePostForUser(postId, 'user-2', updates);

			expect(result).toHaveLength(0); // No rows updated

			// Verify original post is unchanged
			const dbPost = await testDb.select().from(posts).where(eq(posts.id, postId));
			expect(dbPost[0].title).toBe('Test Post');
		});

		it('should allow partial updates', async () => {
			const updates = {
				content: 'Updated content only'
			};

			const result = await updatePostForUser(postId, 'user-1', updates);

			expect(result[0].content).toBe('Updated content only');
			expect(result[0].title).toBe('Test Post'); // Unchanged
		});

		it('should return empty array for non-existent post', async () => {
			const updates = {
				title: 'New Title'
			};

			const result = await updatePostForUser('non-existent-id', 'user-1', updates);

			expect(result).toEqual([]);
		});
	});
});
```

## Example 8: Testing Database Constraints

Test database constraints and error handling:

```typescript
// src/lib/db/queries/constraints.ts
import { db } from '$lib/db';
import { user } from '$lib/db/schema';

export async function createUserWithValidation(userData: {
	username: string;
	age?: number;
	passwordHash: string;
}) {
	// Business logic validation before database constraints
	if (userData.username.length < 3) {
		throw new Error('Username must be at least 3 characters');
	}

	if (userData.age !== undefined && (userData.age < 13 || userData.age > 120)) {
		throw new Error('Age must be between 13 and 120');
	}

	try {
		const [result] = await db.insert(user).values(userData).returning();
		return result;
	} catch (error: any) {
		// Handle database constraint violations
		if (error.code === '23505') {
			// Unique violation
			if (error.constraint?.includes('username')) {
				throw new Error('Username already exists');
			}
		}

		if (error.code === '23514') {
			// Check violation
			throw new Error('Invalid data provided');
		}

		// Re-throw other errors
		throw error;
	}
}

export async function updateUserWithValidation(
	userId: string,
	updates: Partial<{
		username: string;
		age: number;
		passwordHash: string;
	}>
) {
	// Validate updates
	if (updates.username && updates.username.length < 3) {
		throw new Error('Username must be at least 3 characters');
	}

	if (updates.age !== undefined && (updates.age < 13 || updates.age > 120)) {
		throw new Error('Age must be between 13 and 120');
	}

	try {
		const [result] = await db.update(user).set(updates).where(eq(user.id, userId)).returning();

		if (!result) {
			throw new Error('User not found');
		}

		return result;
	} catch (error: any) {
		// Handle constraint violations
		if (error.code === '23505') {
			if (error.constraint?.includes('username')) {
				throw new Error('Username already exists');
			}
		}

		// Re-throw other errors
		throw error;
	}
}
```

```typescript
// src/lib/db/queries/constraints.unit.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb, clearTables } from '../../../tests/test-db/setup';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { createUserWithValidation, updateUserWithValidation } from './constraints';

describe('Database Constraints', () => {
	let testDb: any;

	beforeEach(async () => {
		testDb = await createTestDb();
		await clearTables();
	});

	afterEach(async () => {
		await clearTables();
	});

	describe('createUserWithValidation', () => {
		it('should create user with valid data', async () => {
			const userData = {
				username: 'validuser',
				age: 25,
				passwordHash: 'hash123'
			};

			const result = await createUserWithValidation(userData);

			expect(result.username).toBe('validuser');
			expect(result.age).toBe(25);
		});

		it('should reject username that is too short', async () => {
			const userData = {
				username: 'ab', // Too short
				age: 25,
				passwordHash: 'hash123'
			};

			await expect(createUserWithValidation(userData)).rejects.toThrow(
				'Username must be at least 3 characters'
			);
		});

		it('should reject age that is too low', async () => {
			const userData = {
				username: 'validuser',
				age: 10, // Too young
				passwordHash: 'hash123'
			};

			await expect(createUserWithValidation(userData)).rejects.toThrow(
				'Age must be between 13 and 120'
			);
		});

		it('should reject age that is too high', async () => {
			const userData = {
				username: 'validuser',
				age: 150, // Too old
				passwordHash: 'hash123'
			};

			await expect(createUserWithValidation(userData)).rejects.toThrow(
				'Age must be between 13 and 120'
			);
		});

		it('should handle duplicate username constraint', async () => {
			// Create first user
			await createUserWithValidation({
				username: 'duplicate',
				age: 25,
				passwordHash: 'hash1'
			});

			// Try to create second user with same username
			await expect(
				createUserWithValidation({
					username: 'duplicate', // Duplicate
					age: 30,
					passwordHash: 'hash2'
				})
			).rejects.toThrow('Username already exists');
		});

		it('should allow optional age field', async () => {
			const userData = {
				username: 'noageuser',
				passwordHash: 'hash123'
				// No age provided
			};

			const result = await createUserWithValidation(userData);
			expect(result.username).toBe('noageuser');
			expect(result.age).toBeNull();
		});
	});

	describe('updateUserWithValidation', () => {
		let userId: string;

		beforeEach(async () => {
			// Create a test user
			const result = await testDb
				.insert(user)
				.values({
					username: 'testuser',
					age: 25,
					passwordHash: 'hash123'
				})
				.returning();
			userId = result[0].id;
		});

		it('should update user with valid data', async () => {
			const updates = {
				username: 'updateduser',
				age: 30
			};

			const result = await updateUserWithValidation(userId, updates);

			expect(result.username).toBe('updateduser');
			expect(result.age).toBe(30);
		});

		it('should reject invalid username update', async () => {
			const updates = {
				username: 'ab' // Too short
			};

			await expect(updateUserWithValidation(userId, updates)).rejects.toThrow(
				'Username must be at least 3 characters'
			);
		});

		it('should reject invalid age update', async () => {
			const updates = {
				age: 5 // Too young
			};

			await expect(updateUserWithValidation(userId, updates)).rejects.toThrow(
				'Age must be between 13 and 120'
			);
		});

		it('should handle duplicate username on update', async () => {
			// Create another user
			await testDb.insert(user).values({
				username: 'otheruser',
				age: 30,
				passwordHash: 'hash456'
			});

			// Try to update first user to have same username as second
			const updates = {
				username: 'otheruser' // Duplicate
			};

			await expect(updateUserWithValidation(userId, updates)).rejects.toThrow(
				'Username already exists'
			);
		});

		it('should throw error for non-existent user', async () => {
			const updates = {
				username: 'newname'
			};

			await expect(updateUserWithValidation('non-existent-id', updates)).rejects.toThrow(
				'User not found'
			);
		});

		it('should allow partial updates', async () => {
			const updates = {
				age: 35
				// Only updating age
			};

			const result = await updateUserWithValidation(userId, updates);

			expect(result.age).toBe(35);
			expect(result.username).toBe('testuser'); // Unchanged
		});
	});
});
```

## Best Practices

### Test Data Management

**Isolation Between Tests:**

- Use unique IDs for test data
- Clean up after each test
- Avoid dependencies between tests

**Realistic Test Data:**

- Use representative data that mirrors production
- Include edge cases and boundary values
- Test with various data sizes

### Transaction Testing

**Atomic Operations:**

- Test complete transaction success
- Test transaction rollback on failure
- Verify data consistency after transactions

**Error Scenarios:**

- Test constraint violations
- Test foreign key errors
- Test deadlock scenarios (if applicable)

### Performance Considerations

**Query Efficiency:**

- Test with realistic data volumes
- Monitor query performance in tests
- Use appropriate indexes in test schema

**Test Database Choice:**

- Use in-memory databases for speed
- Consider PGLite for PostgreSQL compatibility
- Use real databases for integration tests

### Query Testing Patterns

**Result Validation:**

- Check exact field values
- Verify correct data types
- Test sorting and ordering
- Validate relationships

**Error Handling:**

- Test invalid parameters
- Test database constraint violations
- Test connection failures (mocked)

### Mocking vs Real Databases

**When to Use Real Databases:**

- Testing complex queries with joins
- Testing transactions
- Testing database constraints
- Integration testing

**When to Mock:**

- External API calls
- File system operations
- Heavy computations
- Third-party services

This comprehensive testing approach ensures your Drizzle ORM queries are robust, efficient, and maintainable. The next guide covers testing SvelteKit API routes.
