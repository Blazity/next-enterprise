import { vi } from 'vitest';
import { ok } from 'neverthrow';

export const generateSessionToken = vi.fn().mockReturnValue('test-session-token');

export const createSession = vi.fn().mockReturnValue(
	ok({
		id: 'test-session-id',
		userId: 'test-user-id',
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
	})
);

export const validateSessionToken = vi.fn().mockReturnValue(
	ok({
		session: {
			id: 'test-session-id',
			userId: 'test-user-id',
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
		},
		user: {
			id: 'test-user-id',
			email: 'test@example.com',
			username: 'testuser'
		}
	})
);

export const invalidateSession = vi.fn().mockReturnValue(ok(undefined));

export const setSessionTokenCookie = vi.fn();

export const deleteSessionTokenCookie = vi.fn();
