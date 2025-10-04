import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/auth/index.js';
import { createAuthUser, getAuthUser } from '@repo/database/queries';
import type { AuthUser } from '@repo/database/schema';
import { fail, redirect } from '@sveltejs/kit';
import { compare } from 'bcrypt-ts';
import { err, ok, safeTry } from 'neverthrow';
import * as v from 'valibot';

export function load({ locals }) {
	if (locals.session) {
		return redirect(307, '/');
	}
}

const emailSchema = v.pipe(v.string(), v.email());
const passwordSchema = v.pipe(v.string(), v.minLength(8));
const usernameSchema = v.pipe(v.string(), v.minLength(3));

export const actions = {
	default: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const rawEmail = formData.get('email');
		const emailResult = v.safeParse(emailSchema, rawEmail);
		if (!emailResult.success) {
			return fail(400, {
				success: false,
				message: 'Invalid email',
				email: (rawEmail ?? undefined) as string | undefined
			} as const);
		}
		const passwordResult = v.safeParse(passwordSchema, formData.get('password'));
		if (!passwordResult.success) {
			return fail(400, { success: false, message: 'Invalid password' } as const);
		}

		const actionResult = safeTry(async function* () {
			let user: AuthUser;
			if (params.authType === 'signup') {
				const rawUsername = formData.get('username');
				const usernameResult = v.safeParse(usernameSchema, rawUsername);
				if (!usernameResult.success) {
					return err(undefined);
				}
				user = yield* createAuthUser(
					emailResult.output,
					passwordResult.output,
					usernameResult.output
				);
			} else {
				user = yield* getAuthUser(emailResult.output);
				const passwordIsCorrect = await compare(passwordResult.output, user.passwordHash);
				if (!passwordIsCorrect) {
					return err(undefined);
				}
			}

			const token = generateSessionToken();
			const session = yield* createSession(token, user.id);
			setSessionTokenCookie(cookies, token, session.expiresAt);
			return ok(undefined);
		});

		return actionResult.match(
			() => redirect(303, '/'),
			() =>
				fail(400, {
					success: false,
					message: `Failed to ${params.authType === 'signup' ? 'sign up' : 'sign in'}. Please try again later.`
				})
		);
	}
};
