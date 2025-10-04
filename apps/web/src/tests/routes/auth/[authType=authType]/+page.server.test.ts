import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

// Dynamic import to handle bracket characters in path
const { actions, load } = await import('../../../routes/auth/[authType=authType]/+page.server.ts');

vi.mock('$lib/server/auth/index', () => ({
	generateSessionToken: vi.fn().mockReturnValue('test-token'),
	createSession: vi.fn().mockReturnValue({
		ok: true,
		value: { id: 'session-id', userId: 'user-id', expiresAt: new Date() }
	}),
	setSessionTokenCookie: vi.fn()
}));

vi.mock('$db/queries', () => ({
	createAuthUser: vi.fn().mockReturnValue({
		ok: true,
		value: {
			id: 'user-id',
			email: 'test@example.com',
			username: 'testuser',
			passwordHash: 'hashed'
		}
	}),
	getAuthUser: vi.fn().mockReturnValue({
		ok: true,
		value: {
			id: 'user-id',
			email: 'test@example.com',
			username: 'testuser',
			passwordHash: '$2a$10$test.hash.here'
		}
	})
}));

vi.mock('bcrypt-ts', () => ({ compare: vi.fn().mockResolvedValue(true) }));

describe('Auth Page Server', () => {
	describe('load', () => {
		it('should redirect if user is already logged in', () => {
			const mockLocals = {
				session: { id: 'session-id', userId: 'user-id', expiresAt: new Date() }
			};
			expect(() => load({ locals: mockLocals } as any)).toThrow();
		});

		it('should not redirect if user is not logged in', () => {
			const mockLocals = { session: null };
			expect(() => load({ locals: mockLocals } as any)).not.toThrow();
		});
	});

	describe('actions.default', () => {
		let mockRequest: Partial<Request>;
		let mockCookies: any;
		let mockParams: any;

		beforeEach(() => {
			mockCookies = { set: vi.fn() };
			mockParams = { authType: 'signup' };
		});

		it('should handle signup with valid data', async () => {
			const formData = new FormData();
			formData.append('email', 'test@example.com');
			formData.append('password', 'password123');
			formData.append('username', 'testuser');
			mockRequest = { formData: vi.fn().mockResolvedValue(formData) };
			const event = {
				request: mockRequest,
				params: mockParams,
				cookies: mockCookies
			} as unknown as RequestEvent;
			expect(async () => {
				await actions.default(event);
			}).rejects.toThrow();
		});

		it('should fail signup with invalid email', async () => {
			const formData = new FormData();
			formData.append('email', 'invalid-email');
			formData.append('password', 'password123');
			formData.append('username', 'testuser');
			mockRequest = { formData: vi.fn().mockResolvedValue(formData) };
			const event = {
				request: mockRequest,
				params: mockParams,
				cookies: mockCookies
			} as unknown as RequestEvent;
			const result = await actions.default(event);
			expect(result).toHaveProperty('status', 400);
			expect(result).toHaveProperty('data.message', 'Invalid email');
		});

		it('should fail signup with short password', async () => {
			const formData = new FormData();
			formData.append('email', 'test@example.com');
			formData.append('password', 'short');
			formData.append('username', 'testuser');
			mockRequest = { formData: vi.fn().mockResolvedValue(formData) };
			const event = {
				request: mockRequest,
				params: mockParams,
				cookies: mockCookies
			} as unknown as RequestEvent;
			const result = await actions.default(event);
			expect(result).toHaveProperty('status', 400);
			expect(result).toHaveProperty('data.message', 'Invalid password');
		});

		it('should handle signin with valid credentials', async () => {
			mockParams.authType = 'signin';
			const formData = new FormData();
			formData.append('email', 'test@example.com');
			formData.append('password', 'password123');
			mockRequest = { formData: vi.fn().mockResolvedValue(formData) };
			const event = {
				request: mockRequest,
				params: mockParams,
				cookies: mockCookies
			} as unknown as RequestEvent;
			expect(async () => {
				await actions.default(event);
			}).rejects.toThrow();
		});
	});
});
