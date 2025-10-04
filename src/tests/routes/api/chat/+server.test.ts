import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../routes/api/chat/+server';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('ai', () => ({
	streamText: vi.fn().mockResolvedValue({
		toTextStreamResponse: vi.fn().mockReturnValue(new Response('AI response'))
	})
}));

vi.mock('$db/queries', () => ({
	getChatById: vi.fn().mockReturnValue({
		ok: true,
		value: {
			id: 'chat-1',
			userId: 'user-1',
			title: 'Test Chat',
			createdAt: new Date(),
			visibility: 'private'
		}
	}),
	createMessage: vi.fn().mockReturnValue({
		ok: true,
		value: {
			id: 'message-1',
			chatId: 'chat-1',
			role: 'user',
			parts: '[]',
			attachments: '[]',
			createdAt: new Date()
		}
	})
}));

vi.mock('$lib/server/ai/provider', () => ({
	getModel: vi.fn().mockReturnValue({
		id: 'test-model',
		name: 'Test Model'
	})
}));

describe('Chat API Route', () => {
	let mockRequest: Partial<Request>;
	let mockLocals: any;

	beforeEach(() => {
		mockLocals = {
			user: {
				id: 'user-1',
				email: 'test@example.com',
				username: 'testuser'
			},
			session: {
				id: 'session-1',
				userId: 'user-1',
				expiresAt: new Date()
			}
		};
	});

	it('should return 401 if user is not authenticated', async () => {
		mockRequest = {
			json: vi.fn().mockResolvedValue({
				id: 'chat-1',
				messages: []
			})
		};

		const event = {
			request: mockRequest,
			locals: { user: null, session: null }
		} as unknown as RequestEvent;

		const response = await POST(event);
		expect(response.status).toBe(401);
	});

	it('should return 400 if chat ID is missing', async () => {
		mockRequest = {
			json: vi.fn().mockResolvedValue({ messages: [] })
		};

		const event = {
			request: mockRequest,
			locals: mockLocals
		} as unknown as RequestEvent;

		const response = await POST(event);
		expect(response.status).toBe(400);
	});

	it('should return 400 if messages are missing', async () => {
		mockRequest = {
			json: vi.fn().mockResolvedValue({ id: 'chat-1' })
		};

		const event = {
			request: mockRequest,
			locals: mockLocals
		} as unknown as RequestEvent;

		const response = await POST(event);
		expect(response.status).toBe(400);
	});

	it('should process chat request with valid data', async () => {
		mockRequest = {
			json: vi.fn().mockResolvedValue({
				id: 'chat-1',
				messages: [{ role: 'user', content: 'Hello' }],
				modelId: 'test-model'
			})
		};

		const event = {
			request: mockRequest,
			locals: mockLocals
		} as unknown as RequestEvent;

		const response = await POST(event);
		expect(response).toBeDefined();
		expect(response.status).toBe(200);
	});
});
