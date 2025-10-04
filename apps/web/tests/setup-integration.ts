import { beforeAll, afterAll, afterEach } from 'vitest';
import { createTestDatabase, dropTables } from './test-db';

beforeAll(async () => {
	await createTestDatabase();
});

afterAll(async () => {
	await dropTables();
});

afterEach(async () => {});
