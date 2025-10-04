import { http, HttpResponse, delay } from 'msw';

export const mockUser = {
	id: 'user-123',
	email: 'test@example.com',
	firstName: 'John',
	lastName: 'Doe'
};

export const mockChats = [
	{
		id: 'chat-1',
		title: 'AI Discussion',
		userId: 'user-123',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: 'chat-2',
		title: 'Code Help',
		userId: 'user-123',
		createdAt: new Date(Date.now() - 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 86400000).toISOString()
	}
];

export const mockMessages = [
	{
		id: 'msg-1',
		role: 'user',
		content: 'What is SvelteKit?',
		parts: [{ type: 'text', text: 'What is SvelteKit?' }]
	},
	{
		id: 'msg-2',
		role: 'assistant',
		content: 'SvelteKit is a framework for building web applications with Svelte.',
		parts: [
			{ type: 'text', text: 'SvelteKit is a framework for building web applications with Svelte.' }
		]
	}
];

export const authHandlers = [
	http.post('/signin', async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (email === 'test@example.com' && password === 'password123') {
			return new HttpResponse(null, {
				status: 303,
				headers: { Location: '/' }
			});
		}

		if (email === 'invalid@example.com') {
			return HttpResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
		}

		if (email === 'locked@example.com') {
			return HttpResponse.json(
				{ success: false, message: 'Account locked due to too many failed attempts' },
				{ status: 429 }
			);
		}

		return HttpResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 });
	}),

	http.post('/signup', async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		if (email === 'duplicate@example.com') {
			return HttpResponse.json(
				{ success: false, message: 'Email already exists' },
				{ status: 409 }
			);
		}

		if (email === 'weak@example.com') {
			return HttpResponse.json(
				{ success: false, message: 'Password is too weak' },
				{ status: 400 }
			);
		}

		return new HttpResponse(null, {
			status: 303,
			headers: { Location: '/' }
		});
	})
];

export const chatHandlers = [
	http.post('/api/chat', async ({ request }) => {
		await request.json();
		await delay(500);

		const isStreaming = request.headers.get('accept')?.includes('text/event-stream');

		if (isStreaming) {
			const stream = new ReadableStream({
				start(controller) {
					const chunks = [
						'data: {"id":"msg-new","role":"assistant","content":"SvelteKit","parts":[{"type":"text","text":"SvelteKit"}]}\n\n',
						'data: {"id":"msg-new","role":"assistant","content":"SvelteKit is a","parts":[{"type":"text","text":"SvelteKit is a"}]}\n\n',
						'data: {"id":"msg-new","role":"assistant","content":"SvelteKit is a framework","parts":[{"type":"text","text":"SvelteKit is a framework"}]}\n\n',
						'data: {"id":"msg-new","role":"assistant","content":"SvelteKit is a framework for building","parts":[{"type":"text","text":"SvelteKit is a framework for building"}]}\n\n',
						'data: {"id":"msg-new","role":"assistant","content":"SvelteKit is a framework for building web applications.","parts":[{"type":"text","text":"SvelteKit is a framework for building web applications."}]}\n\n',
						'data: [DONE]\n\n'
					];

					let index = 0;
					const sendChunk = () => {
						if (index < chunks.length) {
							controller.enqueue(new TextEncoder().encode(chunks[index]));
							index++;
							setTimeout(sendChunk, 100);
						} else {
							controller.close();
						}
					};
					sendChunk();
				}
			});

			return new HttpResponse(stream, {
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive'
				}
			});
		}

		return HttpResponse.json({
			id: 'msg-' + crypto.randomUUID(),
			role: 'assistant',
			content: 'Mocked AI response to your message.',
			parts: [{ type: 'text', text: 'Mocked AI response to your message.' }]
		});
	}),

	http.get('/api/history', () => {
		return HttpResponse.json(mockChats);
	}),

	http.get('/api/chat/:chatId', ({ params }) => {
		const { chatId } = params;

		const chat = mockChats.find((c) => c.id === chatId);
		if (!chat) {
			return new HttpResponse(null, { status: 404 });
		}

		return HttpResponse.json({
			chat,
			messages: mockMessages
		});
	}),

	http.delete('/api/chat/:chatId', ({ params }) => {
		const { chatId } = params;
		const chatIndex = mockChats.findIndex((c) => c.id === chatId);

		if (chatIndex === -1) {
			return new HttpResponse(null, { status: 404 });
		}

		return new HttpResponse(null, { status: 200 });
	}),

	http.post('/api/chat/:chatId/visibility', () => {
		return HttpResponse.json({ success: true });
	})
];

export const fileHandlers = [
	http.post('/api/files/upload', async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || !(file instanceof File)) {
			return HttpResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		await delay(300);

		return HttpResponse.json({
			url: `https://example.com/uploads/${file.name}`,
			pathname: file.name,
			contentType: file.type,
			size: file.size
		});
	})
];

export const voteHandlers = [
	http.post('/api/vote', async ({ request }) => {
		const body = (await request.json()) as { messageId: string; value: string };
		const { messageId, value } = body;

		return HttpResponse.json({
			messageId,
			votes: value === 'up' ? 1 : -1
		});
	}),

	http.get('/api/vote/:messageId', ({ params }) => {
		const { messageId } = params;

		return HttpResponse.json({
			messageId,
			votes: 0
		});
	})
];

export const errorHandlers = [
	http.post('/api/chat', async () => {
		await delay(200);
		return new HttpResponse(null, { status: 500 });
	}),

	http.post('/api/files/upload', async () => {
		await delay(200);
		return HttpResponse.json({ error: 'Upload failed' }, { status: 500 });
	})
];

export const emptyHandlers = [
	http.get('/api/history', () => {
		return HttpResponse.json([]);
	}),

	http.get('/api/chat/:chatId', () => {
		return HttpResponse.json({
			chat: { id: 'chat-1', title: 'Empty Chat', userId: 'user-123' },
			messages: []
		});
	})
];

export const loadingHandlers = [
	http.post('/api/chat', async () => {
		await delay(5000);
		return HttpResponse.json({
			id: 'msg-loading',
			role: 'assistant',
			content: 'Slow response',
			parts: [{ type: 'text', text: 'Slow response' }]
		});
	})
];

export const handlers = [...authHandlers, ...chatHandlers, ...fileHandlers, ...voteHandlers];

export const allHandlers = {
	default: handlers,
	error: [...handlers, ...errorHandlers],
	empty: [...handlers, ...emptyHandlers],
	loading: [...handlers, ...loadingHandlers]
};
