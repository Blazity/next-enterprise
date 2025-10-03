import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb } from '$db/db';
import { user } from '$db/schema';
import { eq } from 'drizzle-orm';

describe('PGlite Database with Drizzle ORM', () => {
	let db: ReturnType<typeof createTestDb>;

	beforeEach(async () => {
		db = createTestDb();
		// PGlite with Drizzle automatically creates tables from schema
		// No need for manual CREATE TABLE statements
	});

	it('should create a test database', () => {
		expect(db).toBeDefined();
	});

	it('should insert and query data using Drizzle ORM', async () => {
		await db.insert(user).values({
			id: '1',
			email: 'test@example.com',
			username: 'testuser',
			passwordHash: 'hashed_password'
		});

		const result = await db.select().from(user).where(eq(user.email, 'test@example.com'));

		expect(result).toHaveLength(1);
		expect(result[0].email).toBe('test@example.com');
		expect(result[0].username).toBe('testuser');
	});

	it('should handle multiple inserts', async () => {
		await db.insert(user).values([
			{ id: '1', email: 'user1@example.com', username: 'user1', passwordHash: 'hash1' },
			{ id: '2', email: 'user2@example.com', username: 'user2', passwordHash: 'hash2' }
		]);

		const result = await db.select().from(user);

		expect(result).toHaveLength(2);
	});

	it('should update data', async () => {
		await db.insert(user).values({
			id: '1',
			email: 'test@example.com',
			username: 'testuser',
			passwordHash: 'hashed_password'
		});

		await db.update(user).set({ username: 'updateduser' }).where(eq(user.id, '1'));

		const result = await db.select().from(user).where(eq(user.id, '1'));

		expect(result[0].username).toBe('updateduser');
	});

	it('should delete data', async () => {
		await db.insert(user).values({
			id: '1',
			email: 'test@example.com',
			username: 'testuser',
			passwordHash: 'hashed_password'
		});

		await db.delete(user).where(eq(user.id, '1'));

		const result = await db.select().from(user);

		expect(result).toHaveLength(0);
	});
});
