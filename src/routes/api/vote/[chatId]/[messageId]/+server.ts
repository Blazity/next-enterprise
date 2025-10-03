import { getChatById, voteMessage } from '$db/queries';
import { error } from '@sveltejs/kit';
import { ok, safeTry } from 'neverthrow';

export async function PATCH({ locals: { user }, params: { chatId, messageId }, request }) {
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

	const { type }: { type: 'up' | 'down' } = await request.json();

	// TODO votes are flawed, anyone can change the vote on any message
	return voteMessage({ chatId, messageId, type }).match(
		() => new Response('Message voted', { status: 200 }),
		() => error(500, 'An error occurred while processing your request')
	);
}
