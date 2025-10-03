import type { Handle } from '@sveltejs/kit';
import {
	deleteSessionTokenCookie,
	getSessionCookie,
	setSessionTokenCookie,
	validateSessionToken
} from './index.js';

export const handle: Handle = async ({ event, resolve }) => {
	const token = getSessionCookie(event);
	if (!token) {
		event.locals.session = null;
		event.locals.user = null;
		return resolve(event);
	}

	const validatedTokenResult = await validateSessionToken(token);

	await validatedTokenResult.match(
		(result) => {
			const { session, user } = result;
			if (session) {
				setSessionTokenCookie(event.cookies, token, session.expiresAt);
				event.locals.session = session;
				event.locals.user = user;
			} else {
				deleteSessionTokenCookie(event.cookies);
				event.locals.session = null;
				event.locals.user = null;
			}
		},
		(error) => {
			console.error('Session validation error:', error);
			deleteSessionTokenCookie(event.cookies);
			event.locals.session = null;
			event.locals.user = null;
		}
	);

	return resolve(event);
};
