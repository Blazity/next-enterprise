import { getSuggestionsByDocumentId } from '@repo/database/queries';
import { error } from '@sveltejs/kit';

export async function GET({ locals: { user }, params: { documentId } }) {
	if (!user) {
		error(401, 'Unauthorized');
	}

	try {
		const suggestions = await getSuggestionsByDocumentId({ documentId });
		const suggestion = suggestions.at(0);
		if (suggestion?.userId !== user.id) {
			error(403, 'Forbidden');
		}
		return Response.json(suggestions);
	} catch {
		error(500, 'An error occurred while processing your request');
	}
}
