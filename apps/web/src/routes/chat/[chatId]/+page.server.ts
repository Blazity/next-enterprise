import { getChatById, getMessagesByChatId } from '@repo/database/queries';
import { error } from '@sveltejs/kit';
import { ok, safeTry } from 'neverthrow';

export async function load({ params: { chatId }, locals: { user } }) {
	return safeTry(async function* () {
		const chat = yield* getChatById({ id: chatId }).mapErr(() => error(404, 'Not found'));
		if (chat.visibility === 'private') {
			if (!user || chat.userId !== user.id) {
				error(404, 'Not found');
			}
		}
		const messages = yield* getMessagesByChatId({ id: chatId });

		return ok({ chat, messages });
	}).match(
		(result) => result,
		() => error(500, 'An error occurred while processing your request')
	);
}
