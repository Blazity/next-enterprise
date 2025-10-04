import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte } from 'drizzle-orm';
import { ResultAsync, fromPromise, ok, safeTry } from 'neverthrow';
import {
	user,
	chat,
	type User,
	document,
	type Suggestion,
	suggestion,
	type Message,
	message,
	vote,
	type Session,
	session,
	type AuthUser,
	type Chat,
	type Vote,
	userProfile,
	type UserProfile
} from '$db/schema';
import type { DbError } from '$lib/errors/db';
import { DbInternalError } from '$lib/errors/db';
import ms from 'ms';
import { unwrapSingleQueryResult } from '$db/utils';
import { db } from '$db/db';

export function getAuthUser(email: string): ResultAsync<AuthUser, DbError> {
	return safeTry(async function* () {
		const userResult = yield* fromPromise(
			db.select().from(user).where(eq(user.email, email)),
			(e) => new DbInternalError({ cause: e })
		);
		return unwrapSingleQueryResult(userResult, email, 'User');
	});
}

export function getUser(email: string): ResultAsync<User, DbError> {
	return safeTry(async function* () {
		const userResult = yield* fromPromise(
			db.select().from(user).where(eq(user.email, email)),
			(e) => new DbInternalError({ cause: e })
		);
		const { passwordHash: _passwordHash, ...rest } = yield* unwrapSingleQueryResult(
			userResult,
			email,
			'User'
		);

		return ok(rest);
	});
}

export function createAuthUser(
	email: string,
	password: string,
	username: string
): ResultAsync<AuthUser, DbError> {
	return safeTry(async function* () {
		const salt = genSaltSync(10);
		const hash = hashSync(password, salt);

		const userResult = yield* fromPromise(
			db
				.insert(user)
				.values({ id: crypto.randomUUID(), email, passwordHash: hash, username })
				.returning(),
			(e) => {
				console.error(e);
				return new DbInternalError({ cause: e });
			}
		);

		return unwrapSingleQueryResult(userResult, email, 'User');
	});
}

export function createSession(value: Session): ResultAsync<Session, DbError> {
	return safeTry(async function* () {
		const sessionResult = yield* fromPromise(
			db.insert(session).values(value).returning(),
			(e) => new DbInternalError({ cause: e })
		);
		return unwrapSingleQueryResult(sessionResult, value.id, 'Session');
	});
}

export function getFullSession(
	sessionId: string
): ResultAsync<{ session: Session; user: User }, DbError> {
	return safeTry(async function* () {
		const sessionResult = yield* fromPromise(
			db
				.select({ user: { id: user.id, email: user.email, username: user.username }, session })
				.from(session)
				.innerJoin(user, eq(session.userId, user.id))
				.where(eq(session.id, sessionId)),
			(e) => new DbInternalError({ cause: e })
		);
		return unwrapSingleQueryResult(sessionResult, sessionId, 'Session');
	});
}

export function deleteSession(sessionId: string): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db.delete(session).where(eq(session.id, sessionId)),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(undefined);
	});
}

export function extendSession(sessionId: string): ResultAsync<Session, DbError> {
	return safeTry(async function* () {
		const sessionResult = yield* fromPromise(
			db
				.update(session)
				.set({ expiresAt: new Date(Date.now() + ms('30d')) })
				.where(eq(session.id, sessionId))
				.returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(sessionResult, sessionId, 'Session');
	});
}

export function deleteSessionsForUser(userId: string): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db.delete(session).where(eq(session.userId, userId)),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(undefined);
	});
}

export function saveChat({
	id,
	userId,
	title
}: {
	id: string;
	userId: string;
	title: string;
}): ResultAsync<Chat, DbError> {
	return safeTry(async function* () {
		const insertResult = yield* fromPromise(
			db
				.insert(chat)
				.values({
					id,
					createdAt: new Date(),
					userId,
					title
				})
				.returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(insertResult, id, 'Chat');
	});
}

export function deleteChatById({ id }: { id: string }): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		const actions = [
			() => db.delete(vote).where(eq(vote.chatId, id)),
			() => db.delete(message).where(eq(message.chatId, id)),
			() => db.delete(chat).where(eq(chat.id, id))
		];

		for (const action of actions) {
			yield* fromPromise(action(), (e) => new DbInternalError({ cause: e }));
		}

		return ok(undefined);
	});
}

export function getChatsByUserId({ id }: { id: string }): ResultAsync<Chat[], DbError> {
	return fromPromise(
		db.select().from(chat).where(eq(chat.userId, id)).orderBy(desc(chat.createdAt)),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getChatById({ id }: { id: string }): ResultAsync<Chat, DbError> {
	return safeTry(async function* () {
		const chatResult = yield* fromPromise(
			db.select().from(chat).where(eq(chat.id, id)),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(chatResult, id, 'Chat');
	});
}

export function saveMessages({
	messages
}: {
	messages: Array<Message>;
}): ResultAsync<Message[], DbError> {
	return safeTry(async function* () {
		const insertResult = yield* fromPromise(
			db.insert(message).values(messages).returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(insertResult);
	});
}

export function getMessagesByChatId({ id }: { id: string }): ResultAsync<Message[], DbError> {
	return safeTry(async function* () {
		const messages = yield* fromPromise(
			db.select().from(message).where(eq(message.chatId, id)).orderBy(asc(message.createdAt)),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(messages);
	});
}

export function voteMessage({
	chatId,
	messageId,
	type
}: {
	chatId: string;
	messageId: string;
	type: 'up' | 'down';
}): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		yield* fromPromise(
			db
				.insert(vote)
				.values({
					chatId,
					messageId,
					isUpvoted: type === 'up'
				})
				.onConflictDoUpdate({
					target: [vote.messageId, vote.chatId],
					set: { isUpvoted: type === 'up' }
				}),
			(e) => new DbInternalError({ cause: e })
		);
		return ok(undefined);
	});
}

export function getVotesByChatId({ id }: { id: string }): ResultAsync<Vote[], DbError> {
	return fromPromise(
		db.select().from(vote).where(eq(vote.chatId, id)),
		(e) => new DbInternalError({ cause: e })
	);
}

export async function saveDocument({
	id,
	title,
	kind,
	content,
	userId
}: {
	id: string;
	title: string;
	kind: 'text' | 'code' | 'image' | 'sheet';
	content: string;
	userId: string;
}) {
	try {
		return await db.insert(document).values({
			id,
			title,
			kind,
			content,
			userId,
			createdAt: new Date()
		});
	} catch (error) {
		console.error('Failed to save document in database');
		throw error;
	}
}

export async function getDocumentsById({ id }: { id: string }) {
	try {
		const documents = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(asc(document.createdAt));

		return documents;
	} catch (error) {
		console.error('Failed to get document by id from database');
		throw error;
	}
}

export async function getDocumentById({ id }: { id: string }) {
	try {
		const [selectedDocument] = await db
			.select()
			.from(document)
			.where(eq(document.id, id))
			.orderBy(desc(document.createdAt));

		return selectedDocument;
	} catch (error) {
		console.error('Failed to get document by id from database');
		throw error;
	}
}

export async function deleteDocumentsByIdAfterTimestamp({
	id,
	timestamp
}: {
	id: string;
	timestamp: Date;
}) {
	try {
		await db.delete(document).where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
	} catch (error) {
		console.error('Failed to delete documents by id after timestamp from database');
		throw error;
	}
}

export async function saveSuggestions({ suggestions }: { suggestions: Array<Suggestion> }) {
	try {
		return await db.insert(suggestion).values(suggestions);
	} catch (error) {
		console.error('Failed to save suggestions in database');
		throw error;
	}
}

export async function getSuggestionsByDocumentId({ documentId }: { documentId: string }) {
	try {
		return await db
			.select()
			.from(suggestion)
			.where(and(eq(suggestion.documentId, documentId)));
	} catch (error) {
		console.error('Failed to get suggestions by document version from database');
		throw error;
	}
}

export async function getMessageById({ id }: { id: string }) {
	try {
		return await db.select().from(message).where(eq(message.id, id));
	} catch (error) {
		console.error('Failed to get message by id from database');
		throw error;
	}
}

export async function deleteMessagesByChatIdAfterTimestamp({
	chatId,
	timestamp
}: {
	chatId: string;
	timestamp: Date;
}) {
	try {
		return await db
			.delete(message)
			.where(and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)));
	} catch (error) {
		console.error('Failed to delete messages by id after timestamp from database');
		throw error;
	}
}

export async function updateChatVisiblityById({
	chatId,
	visibility
}: {
	chatId: string;
	visibility: 'public' | 'private';
}) {
	try {
		return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
	} catch (error) {
		console.error('Failed to update chat visibility in database');
		throw error;
	}
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
	try {
		const [profile] = await db.select().from(userProfile).where(eq(userProfile.userId, userId));
		return profile || null;
	} catch (error) {
		console.error('Failed to get user profile from database');
		throw error;
	}
}

export async function createUserProfile(profileData: {
	userId: string;
	firstName: string;
	lastName: string;
	dateOfBirth?: string;
	phoneNumber?: string;
	address?: Record<string, unknown>;
	preferences?: Record<string, unknown>;
	avatarUrl?: string;
	bio?: string;
	linkedinUrl?: string;
	githubUrl?: string;
	portfolioUrl?: string;
	skills?: string[];
	experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
	industry?: string;
	company?: string;
	jobTitle?: string;
	yearsOfExperience?: number;
	education?: Record<string, unknown>[];
	certifications?: Record<string, unknown>[];
	languages?: Record<string, unknown>[];
	timezone?: string;
	availability?: 'available' | 'busy' | 'away' | 'offline';
}): Promise<UserProfile> {
	try {
		const [profile] = await db
			.insert(userProfile)
			.values({
				id: crypto.randomUUID(),
				userId: profileData.userId,
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				dateOfBirth: profileData.dateOfBirth,
				phoneNumber: profileData.phoneNumber,
				address: profileData.address ? JSON.stringify(profileData.address) : null,
				preferences: profileData.preferences ? JSON.stringify(profileData.preferences) : null,
				avatarUrl: profileData.avatarUrl,
				bio: profileData.bio,
				linkedinUrl: profileData.linkedinUrl,
				githubUrl: profileData.githubUrl,
				portfolioUrl: profileData.portfolioUrl,
				skills: profileData.skills ? JSON.stringify(profileData.skills) : null,
				experienceLevel: profileData.experienceLevel,
				industry: profileData.industry,
				company: profileData.company,
				jobTitle: profileData.jobTitle,
				yearsOfExperience: profileData.yearsOfExperience,
				education: profileData.education ? JSON.stringify(profileData.education) : null,
				certifications: profileData.certifications
					? JSON.stringify(profileData.certifications)
					: null,
				languages: profileData.languages ? JSON.stringify(profileData.languages) : null,
				timezone: profileData.timezone,
				availability: profileData.availability,
				lastActive: new Date(),
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();

		return profile;
	} catch (error) {
		console.error('Failed to create user profile in database');
		throw error;
	}
}

export async function updateUserProfile(
	userId: string,
	updates: Partial<{
		firstName?: string;
		lastName?: string;
		dateOfBirth?: string;
		phoneNumber?: string;
		address?: Record<string, unknown>;
		preferences?: Record<string, unknown>;
		avatarUrl?: string;
		bio?: string;
		linkedinUrl?: string;
		githubUrl?: string;
		portfolioUrl?: string;
		skills?: string[];
		experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
		industry?: string;
		company?: string;
		jobTitle?: string;
		yearsOfExperience?: number;
		education?: Record<string, unknown>[];
		certifications?: Record<string, unknown>[];
		languages?: Record<string, unknown>[];
		timezone?: string;
		availability?: 'available' | 'busy' | 'away' | 'offline';
	}>
): Promise<UserProfile | null> {
	try {
		const updateData: Record<string, unknown> = {
			...updates,
			updatedAt: new Date()
		};

		if (updates.address) updateData.address = JSON.stringify(updates.address);
		if (updates.preferences) updateData.preferences = JSON.stringify(updates.preferences);
		if (updates.skills) updateData.skills = JSON.stringify(updates.skills);
		if (updates.education) updateData.education = JSON.stringify(updates.education);
		if (updates.certifications) updateData.certifications = JSON.stringify(updates.certifications);
		if (updates.languages) updateData.languages = JSON.stringify(updates.languages);

		const [profile] = await db
			.update(userProfile)
			.set(updateData)
			.where(eq(userProfile.userId, userId))
			.returning();

		return profile || null;
	} catch (error) {
		console.error('Failed to update user profile in database');
		throw error;
	}
}

export async function deleteUserProfile(userId: string): Promise<void> {
	try {
		await db.delete(userProfile).where(eq(userProfile.userId, userId));
	} catch (error) {
		console.error('Failed to delete user profile from database');
		throw error;
	}
}

export async function fetchExternalUserData(_userProfile: UserProfile) {
	const externalApiResponse = {
		creditScore: Math.floor(Math.random() * 300) + 400,
		employmentStatus: ['employed', 'self-employed', 'unemployed', 'student'][
			Math.floor(Math.random() * 4)
		],
		incomeRange: ['0-25k', '25k-50k', '50k-75k', '75k-100k', '100k+'][
			Math.floor(Math.random() * 5)
		],
		riskProfile: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
		recommendations: [
			'Consider increasing your emergency fund',
			'Look into retirement investment options',
			'Diversify your investment portfolio'
		].slice(0, Math.floor(Math.random() * 3) + 1)
	};

	return externalApiResponse;
}
