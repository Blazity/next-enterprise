import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { user } from './users';

export const chat = pgTable('chat', {
	id: text('id').primaryKey(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	title: text('title').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	visibility: text('visibility').$type<'public' | 'private'>().notNull().default('private')
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('message', {
	id: text('id').primaryKey(),
	chatId: text('chat_id')
		.notNull()
		.references(() => chat.id),
	role: text('role').notNull(),
	parts: text('parts').notNull(),
	attachments: text('attachments').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
	'vote',
	{
		chatId: text('chat_id')
			.notNull()
			.references(() => chat.id),
		messageId: text('message_id')
			.notNull()
			.references(() => message.id),
		isUpvoted: boolean('is_upvoted').notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.chatId, table.messageId] })
	})
);

export type Vote = InferSelectModel<typeof vote>;
