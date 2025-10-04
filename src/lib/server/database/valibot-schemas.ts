import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import { user, userProfile, session, chat, message, vote, document, suggestion } from './schema';

export const selectUserSchema = createSelectSchema(user);
export const insertUserSchema = createInsertSchema(user);
export const updateUserSchema = createUpdateSchema(user);

export const selectUserProfileSchema = createSelectSchema(userProfile);
export const insertUserProfileSchema = createInsertSchema(userProfile);
export const updateUserProfileSchema = createUpdateSchema(userProfile);

export const selectSessionSchema = createSelectSchema(session);
export const insertSessionSchema = createInsertSchema(session);
export const updateSessionSchema = createUpdateSchema(session);

export const selectChatSchema = createSelectSchema(chat);
export const insertChatSchema = createInsertSchema(chat);
export const updateChatSchema = createUpdateSchema(chat);

export const selectMessageSchema = createSelectSchema(message);
export const insertMessageSchema = createInsertSchema(message);
export const updateMessageSchema = createUpdateSchema(message);

export const selectVoteSchema = createSelectSchema(vote);
export const insertVoteSchema = createInsertSchema(vote);
export const updateVoteSchema = createUpdateSchema(vote);

export const selectDocumentSchema = createSelectSchema(document);
export const insertDocumentSchema = createInsertSchema(document);
export const updateDocumentSchema = createUpdateSchema(document);

export const selectSuggestionSchema = createSelectSchema(suggestion);
export const insertSuggestionSchema = createInsertSchema(suggestion);
export const updateSuggestionSchema = createUpdateSchema(suggestion);
