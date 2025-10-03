import { myProvider } from '$lib/server/ai';
import { systemPrompt } from '$lib/server/ai/prompts.js';
import { generateTitleFromUserMessage } from '$lib/server/ai/utils';
import { deleteChatById, getChatById, saveChat, saveMessages } from '$db/queries';
import type { Chat } from '$db/schema';
import { getMostRecentUserMessage, getTrailingMessageId } from '$lib/utils/chat.js';
import { allowAnonymousChats } from '$lib/utils/constants.js';
import { error } from '@sveltejs/kit';
import { smoothStream, streamText, type CoreMessage } from 'ai';
import { ok, safeTry } from 'neverthrow';
import { nanoid } from 'nanoid';

type MessageWithId = CoreMessage & { id?: string };

export async function POST({ request, locals: { user }, cookies }) {
	// TODO: zod?
	const { id, messages }: { id: string; messages: MessageWithId[] } = await request.json();
	const selectedChatModel = cookies.get('selected-model') || 'openai/gpt-3.5-turbo';

	if (!user && !allowAnonymousChats) {
		error(401, 'Unauthorized');
	}

	const userMessage = getMostRecentUserMessage(messages);

	if (!userMessage) {
		error(400, 'No user message found');
	}

	if (user) {
		await safeTry(async function* () {
			let chat: Chat;
			const chatResult = await getChatById({ id });
			if (chatResult.isErr()) {
				if (chatResult.error._tag !== 'DbEntityNotFoundError') {
					return chatResult;
				}
				const title = yield* generateTitleFromUserMessage({ message: userMessage });
				chat = yield* saveChat({ id, userId: user.id, title });
			} else {
				chat = chatResult.value;
			}

			if (chat.userId !== user.id) {
				error(403, 'Forbidden');
			}

			const messageId = userMessage.id || nanoid();
			yield* saveMessages({
				messages: [
					{
						chatId: id,
						id: messageId,
						role: 'user',
						parts: JSON.stringify([{ type: 'text', text: userMessage.content }]),
						attachments: JSON.stringify([]),
						createdAt: new Date()
					}
				]
			});

			return ok(undefined);
		}).orElse(() => error(500, 'An error occurred while processing your request'));
	}

	try {
		const result = await streamText({
			model: myProvider.languageModel(selectedChatModel),
			system: systemPrompt({ selectedChatModel }),
			messages,
			experimental_transform: smoothStream({ chunking: 'word' }),
			onFinish: async ({ text }) => {
				if (!user) return;

				const assistantId = nanoid();
				await saveMessages({
					messages: [
						{
							id: assistantId,
							chatId: id,
							role: 'assistant',
							parts: JSON.stringify([{ type: 'text', text }]),
							attachments: JSON.stringify([]),
							createdAt: new Date()
						}
					]
				});
			}
		});

		return result.toTextStreamResponse();
	} catch (e) {
		console.error('Chat error:', e);
		error(500, 'An error occurred while processing your request');
	}
}

export async function DELETE({ locals: { user }, request }) {
	// TODO: zod
	const { id }: { id: string } = await request.json();
	if (!user) {
		error(401, 'Unauthorized');
	}

	return await getChatById({ id })
		.andTee((chat) => {
			if (chat.userId !== user.id) {
				error(403, 'Forbidden');
			}
		})
		.andThen(deleteChatById)
		.match(
			() => new Response('Chat deleted', { status: 200 }),
			() => error(500, 'An error occurred while processing your request')
		);
}
