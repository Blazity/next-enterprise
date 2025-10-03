import { getChatsByUserId } from '$db/queries';
import { error } from '@sveltejs/kit';

export async function GET({ locals: { user } }) {
	if (!user) {
		error(401, 'Unauthorized');
	}

	return await getChatsByUserId({ id: user.id }).match(
		(chats) => Response.json(chats),
		() => error(500, 'An error occurred while processing your request')
	);
}
