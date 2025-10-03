import { getSuggestionsByDocumentId } from '$db/queries';
import { error } from '@sveltejs/kit';

export async function GET({ locals: { user }, params: { documentId } }) {
	if (!user) {
		error(401, 'Unauthorized');
	}

	return await getSuggestionsByDocumentId({ documentId })
		.andTee((suggestions) => {
			const suggestion = suggestions.at(0);
			if (suggestion?.userId !== user.id) {
				error(403, 'Forbidden');
			}
		})
		.match(
			(suggestions) => Response.json(suggestions),
			() => error(500, 'An error occurred while processing your request')
		);
}
