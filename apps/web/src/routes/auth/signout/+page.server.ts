import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth/index.js';
import { redirect } from '@sveltejs/kit';

export function load({ locals, cookies }) {
	if (locals.session) {
		invalidateSession(locals.session.id);
		deleteSessionTokenCookie(cookies);
	}

	redirect(307, '/signin');
}
