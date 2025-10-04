import { createTestDb } from '@repo/database';

let db: ReturnType<typeof createTestDb> | null = null;

export async function createTestDatabase() {
	db = createTestDb();
	return db;
}

export async function createTables() {
	// Tables are automatically created by Drizzle schema
	// No manual table creation needed with PGLite
}

export async function dropTables() {
	// PGLite handles cleanup automatically
	db = null;
}

export { db };
