export const mockUser = {
	id: 'user-123',
	email: 'test@example.com',
	firstName: 'John',
	lastName: 'Doe',
	createdAt: new Date('2024-01-01T00:00:00Z')
};

export const mockUsers = [
	mockUser,
	{
		id: 'user-456',
		email: 'jane@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		createdAt: new Date('2024-01-02T00:00:00Z')
	}
];

export const mockChat = {
	id: 'chat-1',
	title: 'AI Discussion',
	userId: 'user-123',
	createdAt: new Date('2024-01-15T10:00:00Z'),
	updatedAt: new Date('2024-01-15T10:30:00Z'),
	isPublic: false
};

export const mockChats = [
	mockChat,
	{
		id: 'chat-2',
		title: 'Code Help',
		userId: 'user-123',
		createdAt: new Date('2024-01-14T15:00:00Z'),
		updatedAt: new Date('2024-01-14T15:45:00Z'),
		isPublic: true
	},
	{
		id: 'chat-3',
		title: 'Empty Chat',
		userId: 'user-123',
		createdAt: new Date('2024-01-13T09:00:00Z'),
		updatedAt: new Date('2024-01-13T09:00:00Z'),
		isPublic: false
	}
];

export const mockMessage = {
	id: 'msg-1',
	role: 'user',
	content: 'What is SvelteKit?',
	parts: [{ type: 'text', text: 'What is SvelteKit?' }],
	createdAt: new Date('2024-01-15T10:00:00Z')
};

export const mockMessages = [
	mockMessage,
	{
		id: 'msg-2',
		role: 'assistant',
		content: 'SvelteKit is a framework for building web applications with Svelte.',
		parts: [
			{ type: 'text', text: 'SvelteKit is a framework for building web applications with Svelte.' }
		],
		createdAt: new Date('2024-01-15T10:01:00Z')
	},
	{
		id: 'msg-3',
		role: 'user',
		content: 'How do I create a new project?',
		parts: [{ type: 'text', text: 'How do I create a new project?' }],
		createdAt: new Date('2024-01-15T10:02:00Z')
	}
];

export const mockConversation = {
	chat: mockChat,
	messages: mockMessages
};

export const mockFileUpload = {
	url: 'https://example.com/uploads/document.pdf',
	pathname: 'document.pdf',
	contentType: 'application/pdf',
	size: 1024000
};

export function createMockUser(overrides = {}) {
	return {
		...mockUser,
		id: `user-${crypto.randomUUID()}`,
		...overrides
	};
}

export function createMockChat(overrides = {}) {
	return {
		...mockChat,
		id: `chat-${crypto.randomUUID()}`,
		...overrides
	};
}

export function createMockMessage(overrides = {}) {
	return {
		...mockMessage,
		id: `msg-${crypto.randomUUID()}`,
		...overrides
	};
}

export function createMockConversation(chatOverrides = {}, messageOverrides = []) {
	const chat = createMockChat(chatOverrides);
	const messages =
		messageOverrides.length > 0 ? messageOverrides.map(createMockMessage) : mockMessages;

	return {
		chat,
		messages
	};
}

export const testScenarios = {
	emptyChat: {
		chat: createMockChat({ title: 'Empty Chat' }),
		messages: []
	},

	singleMessage: {
		chat: createMockChat({ title: 'Single Message' }),
		messages: [createMockMessage()]
	},

	longConversation: {
		chat: createMockChat({ title: 'Long Conversation' }),
		messages: Array.from({ length: 20 }, (_, i) =>
			createMockMessage({
				id: `msg-${i + 1}`,
				role: i % 2 === 0 ? 'user' : 'assistant',
				content: `Message ${i + 1} content`,
				createdAt: new Date(`2024-01-15T10:${i.toString().padStart(2, '0')}:00Z`)
			})
		)
	},

	errorStates: {
		chat: createMockChat({ title: 'Error Chat' }),
		messages: mockMessages,
		error: 'Failed to load messages'
	},

	loadingStates: {
		chat: createMockChat({ title: 'Loading Chat' }),
		messages: [],
		loading: true
	}
};
