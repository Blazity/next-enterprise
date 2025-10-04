import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import type { Session, User } from '@repo/database/schema';
import {
	createSession as createSessionDb,
	deleteSession,
	deleteSessionsForUser,
	extendSession,
	getFullSession
} from '@repo/database/queries';
import { ok, ResultAsync, safeTry } from 'neverthrow';
import type { DbError } from '@repo/database/errors/db';
import ms from 'ms';
import type { Cookies, RequestEvent } from '@sveltejs/kit';

export function generateSessionToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export function createSession(token: string, userId: string): ResultAsync<Session, DbError> {
	return safeTry(async function* () {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const session: Session = {
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
		};
		yield* createSessionDb(session);
		return ok(session);
	});
}

export function validateSessionToken(token: string): ResultAsync<SessionValidationResult, DbError> {
	return safeTry(async function* () {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const { user, session } = yield* getFullSession(sessionId);
		if (Date.now() >= session.expiresAt.getTime()) {
			yield* deleteSession(sessionId);
			return ok({ session: null, user: null });
		}
		if (Date.now() >= session.expiresAt.getTime() - ms('15d')) {
			yield* extendSession(sessionId);
		}
		return ok({ session, user });
	});
}

export function invalidateSession(sessionId: string): ResultAsync<undefined, DbError> {
	return deleteSession(sessionId);
}

export function invalidateAllSessions(userId: string): ResultAsync<undefined, DbError> {
	return deleteSessionsForUser(userId);
}

export function getSessionCookie(event: RequestEvent): string | undefined {
	return event.cookies.get('session');
}

export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
	cookies.set('session', 'token', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
