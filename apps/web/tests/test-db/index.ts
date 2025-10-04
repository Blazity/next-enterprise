import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '$db/schema';

let sql: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export async function createTestDatabase() {
	const testDbUrl = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
	sql = postgres(testDbUrl, { max: 1 });
	db = drizzle(sql, { schema });

	await createTables();
	return db;
}

export async function createTables() {
	if (!sql) throw new Error('Database not initialized');

	await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function dropTables() {
	if (!sql) return;

	await sql`DROP TABLE IF EXISTS users CASCADE`;

	await sql.end();
	sql = null;
	db = null;
}

export { db };
