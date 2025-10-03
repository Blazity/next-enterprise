import { beforeAll, afterAll, afterEach } from 'vitest';
import { createTables, dropTables } from './test-db';

// Global test setup for integration tests
beforeAll(async () => {
	// Set up test database
	await createTables();
});

afterAll(async () => {
	// Clean up test database
	await dropTables();
});

afterEach(async () => {
	// Reset database state between tests
	// This could involve truncating tables or resetting sequences
});
