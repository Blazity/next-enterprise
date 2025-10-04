import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupMSW, resetMSW, teardownMSW } from './msw-server';
beforeAll(async () => {
	await setupMSW();
});

afterEach(async () => {
	await resetMSW();
});

afterAll(async () => {
	await teardownMSW();
});
