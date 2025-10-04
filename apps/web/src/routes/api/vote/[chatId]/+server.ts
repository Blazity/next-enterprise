import { getChatById, getVotesByChatId } from '@repo/database/queries';
import { error } from '@sveltejs/kit';
import { ok, safeTry } from 'neverthrow';

export async function GET({ locals: { user }, params: { chatId } }) {
	if (!user) {
		error(401, 'Unauthorized');
	}

	await safeTry(async function* () {
		const chat = yield* getChatById({ id: chatId });
		if (chat.userId !== user.id) {
			error(403, 'Forbidden');
		}
		return ok(undefined);
	}).orElse(() => error(404, 'Not found'));

	return getVotesByChatId({ id: chatId }).match(
		(votes) => Response.json(votes),
		() => error(500, 'An error occurred while processing your request')
	);
}
