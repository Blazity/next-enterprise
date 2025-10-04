import { vi } from 'vitest';
import { ok } from 'neverthrow';

export const createAuthUser = vi.fn().mockReturnValue(
	ok({
		id: 'test-user-id',
		email: 'test@example.com',
		username: 'testuser',
		passwordHash: 'hashed_password'
	})
);

export const getAuthUser = vi.fn().mockReturnValue(
	ok({
		id: 'test-user-id',
		email: 'test@example.com',
		username: 'testuser',
		passwordHash: 'hashed_password'
	})
);

export const getUserById = vi.fn().mockReturnValue(
	ok({
		id: 'test-user-id',
		email: 'test@example.com',
		username: 'testuser'
	})
);

export const getSessionById = vi.fn().mockReturnValue(
	ok({
		id: 'test-session-id',
		userId: 'test-user-id',
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
	})
);

export const deleteSession = vi.fn().mockReturnValue(ok(undefined));

export const getChatsByUserId = vi.fn().mockReturnValue(
	ok([
		{
			id: 'chat-1',
			userId: 'test-user-id',
			title: 'Test Chat',
			createdAt: new Date(),
			visibility: 'private' as const
		}
	])
);

export const getChatById = vi.fn().mockReturnValue(
	ok({
		id: 'chat-1',
		userId: 'test-user-id',
		title: 'Test Chat',
		createdAt: new Date(),
		visibility: 'private' as const
	})
);

export const createChat = vi.fn().mockReturnValue(
	ok({
		id: 'new-chat-id',
		userId: 'test-user-id',
		title: 'New Chat',
		createdAt: new Date(),
		visibility: 'private' as const
	})
);

export const deleteChat = vi.fn().mockReturnValue(ok(undefined));

export const getMessagesByChatId = vi.fn().mockReturnValue(
	ok([
		{
			id: 'message-1',
			chatId: 'chat-1',
			role: 'user',
			parts: JSON.stringify([{ type: 'text', text: 'Hello' }]),
			attachments: JSON.stringify([]),
			createdAt: new Date()
		}
	])
);

export const createMessage = vi.fn().mockReturnValue(
	ok({
		id: 'new-message-id',
		chatId: 'chat-1',
		role: 'user',
		parts: JSON.stringify([{ type: 'text', text: 'Hello' }]),
		attachments: JSON.stringify([]),
		createdAt: new Date()
	})
);

export const getVotesByChatId = vi.fn().mockReturnValue(ok([]));

export const saveVote = vi.fn().mockReturnValue(ok(undefined));

export const getDocumentsByUserId = vi.fn().mockReturnValue(ok([]));

export const createDocument = vi.fn().mockReturnValue(
	ok({
		id: 'doc-1',
		userId: 'test-user-id',
		title: 'Test Document',
		content: 'Test content',
		kind: 'text' as const,
		createdAt: new Date()
	})
);

export default {
	createAuthUser,
	getAuthUser,
	getUserById,
	getSessionById,
	deleteSession,
	getChatsByUserId,
	getChatById,
	createChat,
	deleteChat,
	getMessagesByChatId,
	createMessage,
	getVotesByChatId,
	saveVote,
	getDocumentsByUserId,
	createDocument
};
