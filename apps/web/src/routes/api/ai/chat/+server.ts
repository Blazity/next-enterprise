import { streamAIChat } from '$lib/server/ai';
import type { RequestHandler } from './$types';
import type { CoreMessage } from 'ai';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { messages } = await request.json();

		if (!Array.isArray(messages)) {
			return new Response(JSON.stringify({ error: 'Messages must be an array' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const result = await streamAIChat(messages as CoreMessage[]);

		return result.toTextStreamResponse();
	} catch (error) {
		console.error('AI Chat Error:', error);
		return new Response(
			JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
