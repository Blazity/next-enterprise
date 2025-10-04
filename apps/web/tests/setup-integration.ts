import { beforeAll, afterAll, afterEach } from 'vitest';
import { createTables, dropTables } from './test-db';

beforeAll(async () => {
	await createTables();
});

afterAll(async () => {
	await dropTables();
});

afterEach(async () => {});
