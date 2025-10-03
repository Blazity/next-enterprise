import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { user } from './users';

export const document = pgTable(
	'document',
	{
		id: text('id').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		title: text('title').notNull(),
		content: text('content'),
		kind: text('kind').$type<'text' | 'code' | 'image' | 'sheet'>().notNull().default('text'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.id, table.createdAt] })
	})
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable('suggestion', {
	id: text('id').primaryKey(),
	documentId: text('document_id').notNull(),
	documentCreatedAt: timestamp('document_created_at').notNull(),
	originalText: text('original_text').notNull(),
	suggestedText: text('suggested_text').notNull(),
	description: text('description'),
	isResolved: boolean('is_resolved').notNull().default(false),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export type Suggestion = InferSelectModel<typeof suggestion>;

