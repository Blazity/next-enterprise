import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

let cachedDb: ReturnType<typeof drizzle> | null = null;
let cachedClient: PGlite | null = null;

export function createDb(dbUrl?: string): ReturnType<typeof drizzle> {
	const url = dbUrl || process.env.DATABASE_URL || './pglite-data';
	const client = new PGlite(url);
	return drizzle(client, { schema });
}

function getDb(): ReturnType<typeof drizzle> {
	if (cachedDb) return cachedDb;

	const dbUrl = process.env.DATABASE_URL || './pglite-data';

	cachedClient = new PGlite(dbUrl);
	cachedDb = drizzle(cachedClient, { schema });

	return cachedDb;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(target, prop) {
		return getDb()[prop as keyof ReturnType<typeof drizzle>];
	}
});

export function createTestDb(): ReturnType<typeof drizzle> {
	const client = new PGlite();
	return drizzle(client, { schema });
}
