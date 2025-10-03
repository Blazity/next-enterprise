import { chatModels } from '$lib/ai/models.js';

export async function POST({ params, cookies, request }) {
	const { value } = await request.json();
	if (typeof value !== 'string') {
		return new Response(null, {
			status: 400
		});
	}
	switch (params.cookieName) {
		case 'selected-model':
			if (!chatModels.find((model) => model.id === value)) {
				return new Response('Unknown model', {
					status: 400
				});
			}
			break;
		default: {
			return new Response('Unknown cookie', {
				status: 404
			});
		}
	}

	cookies.set(params.cookieName, value, {
		path: '/',
		sameSite: 'lax',
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		httpOnly: true
	});
	return new Response(null, {
		status: 200
	});
}
