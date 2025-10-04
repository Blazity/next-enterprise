import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestDb } from '$db/db';
import { user, chat, message } from '$db/schema';
import { eq } from 'drizzle-orm';

describe('Database Queries Integration Tests', () => {
	let db: ReturnType<typeof createTestDb>;

	beforeEach(async () => {
		db = createTestDb();
	});

	afterEach(async () => {
		await db.delete(message);
		await db.delete(chat);
		await db.delete(user);
	});

	describe('User Operations', () => {
		it('should create a new user', async () => {
			const newUser = {
				id: 'user-1',
				email: 'test@example.com',
				username: 'testuser',
				passwordHash: 'hashed_password'
			};

			await db.insert(user).values(newUser);

			const users = await db.select().from(user).where(eq(user.id, 'user-1'));

			expect(users).toHaveLength(1);
			expect(users[0].email).toBe('test@example.com');
			expect(users[0].username).toBe('testuser');
		});

		it('should find user by email', async () => {
			await db.insert(user).values({
				id: 'user-1',
				email: 'test@example.com',
				username: 'testuser',
				passwordHash: 'hashed_password'
			});

			const users = await db.select().from(user).where(eq(user.email, 'test@example.com'));

			expect(users).toHaveLength(1);
			expect(users[0].id).toBe('user-1');
		});

		it('should update user', async () => {
			await db.insert(user).values({
				id: 'user-1',
				email: 'test@example.com',
				username: 'testuser',
				passwordHash: 'hashed_password'
			});

			await db.update(user).set({ username: 'newusername' }).where(eq(user.id, 'user-1'));

			const users = await db.select().from(user).where(eq(user.id, 'user-1'));

			expect(users[0].username).toBe('newusername');
		});

		it('should delete user', async () => {
			await db.insert(user).values({
				id: 'user-1',
				email: 'test@example.com',
				username: 'testuser',
				passwordHash: 'hashed_password'
			});

			await db.delete(user).where(eq(user.id, 'user-1'));

			const users = await db.select().from(user).where(eq(user.id, 'user-1'));

			expect(users).toHaveLength(0);
		});
	});

	describe('Chat Operations', () => {
		beforeEach(async () => {
			await db.insert(user).values({
				id: 'user-1',
				email: 'test@example.com',
				username: 'testuser',
				passwordHash: 'hashed_password'
			});
		});

		it('should create a new chat', async () => {
			const newChat = {
				id: 'chat-1',
				userId: 'user-1',
				title: 'Test Chat',
				createdAt: new Date(),
				visibility: 'private' as const
			};

			await db.insert(chat).values(newChat);

			const chats = await db.select().from(chat).where(eq(chat.id, 'chat-1'));

			expect(chats).toHaveLength(1);
			expect(chats[0].title).toBe('Test Chat');
		});

		it('should find chats by user ID', async () => {
			await db.insert(chat).values([
				{
					id: 'chat-1',
					userId: 'user-1',
					title: 'Chat 1',
					createdAt: new Date(),
					visibility: 'private' as const
				},
				{
					id: 'chat-2',
					userId: 'user-1',
					title: 'Chat 2',
					createdAt: new Date(),
					visibility: 'private' as const
				}
			]);

			const chats = await db.select().from(chat).where(eq(chat.userId, 'user-1'));

			expect(chats).toHaveLength(2);
		});
	});

	describe('Message Operations', () => {
		beforeEach(async () => {
			await db.insert(user).values({
				id: 'user-1',
				email: 'test@example.com',
				username: 'testuser',
				passwordHash: 'hashed_password'
			});

			await db.insert(chat).values({
				id: 'chat-1',
				userId: 'user-1',
				title: 'Test Chat',
				createdAt: new Date(),
				visibility: 'private' as const
			});
		});

		it('should create a new message', async () => {
			const newMessage = {
				id: 'message-1',
				chatId: 'chat-1',
				role: 'user',
				parts: JSON.stringify([{ type: 'text', text: 'Hello' }]),
				attachments: JSON.stringify([]),
				createdAt: new Date()
			};

			await db.insert(message).values(newMessage);

			const messages = await db.select().from(message).where(eq(message.id, 'message-1'));

			expect(messages).toHaveLength(1);
			expect(messages[0].role).toBe('user');
		});

		it('should find messages by chat ID', async () => {
			await db.insert(message).values([
				{
					id: 'message-1',
					chatId: 'chat-1',
					role: 'user',
					parts: JSON.stringify([{ type: 'text', text: 'Hello' }]),
					attachments: JSON.stringify([]),
					createdAt: new Date()
				},
				{
					id: 'message-2',
					chatId: 'chat-1',
					role: 'assistant',
					parts: JSON.stringify([{ type: 'text', text: 'Hi there!' }]),
					attachments: JSON.stringify([]),
					createdAt: new Date()
				}
			]);

			const messages = await db.select().from(message).where(eq(message.chatId, 'chat-1'));

			expect(messages).toHaveLength(2);
		});
	});

	describe('Transaction Operations', () => {
		it('should rollback on error', async () => {
			try {
				await db.transaction(async (tx) => {
					await tx.insert(user).values({
						id: 'user-1',
						email: 'test@example.com',
						username: 'testuser',
						passwordHash: 'hashed_password'
					});

					await tx.insert(user).values({
						id: 'user-1',
						email: 'test2@example.com',
						username: 'testuser2',
						passwordHash: 'hashed_password'
					});
				});
			} catch (error) {}

			const users = await db.select().from(user);
			expect(users).toHaveLength(0);
		});

		it('should commit on success', async () => {
			await db.transaction(async (tx) => {
				await tx.insert(user).values({
					id: 'user-1',
					email: 'test@example.com',
					username: 'testuser',
					passwordHash: 'hashed_password'
				});

				await tx.insert(chat).values({
					id: 'chat-1',
					userId: 'user-1',
					title: 'Test Chat',
					createdAt: new Date(),
					visibility: 'private' as const
				});
			});

			const users = await db.select().from(user);
			const chats = await db.select().from(chat);

			expect(users).toHaveLength(1);
			expect(chats).toHaveLength(1);
		});
	});
});
