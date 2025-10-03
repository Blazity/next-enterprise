import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import {
	user,
	userProfile,
	session,
	chat,
	message,
	vote,
	document,
	suggestion
} from './schema';

// User schemas
export const selectUserSchema = createSelectSchema(user);
export const insertUserSchema = createInsertSchema(user);
export const updateUserSchema = createUpdateSchema(user);

// User Profile schemas
export const selectUserProfileSchema = createSelectSchema(userProfile);
export const insertUserProfileSchema = createInsertSchema(userProfile);
export const updateUserProfileSchema = createUpdateSchema(userProfile);

// Session schemas
export const selectSessionSchema = createSelectSchema(session);
export const insertSessionSchema = createInsertSchema(session);
export const updateSessionSchema = createUpdateSchema(session);

// Chat schemas
export const selectChatSchema = createSelectSchema(chat);
export const insertChatSchema = createInsertSchema(chat);
export const updateChatSchema = createUpdateSchema(chat);

// Message schemas
export const selectMessageSchema = createSelectSchema(message);
export const insertMessageSchema = createInsertSchema(message);
export const updateMessageSchema = createUpdateSchema(message);

// Vote schemas
export const selectVoteSchema = createSelectSchema(vote);
export const insertVoteSchema = createInsertSchema(vote);
export const updateVoteSchema = createUpdateSchema(vote);

// Document schemas
export const selectDocumentSchema = createSelectSchema(document);
export const insertDocumentSchema = createInsertSchema(document);
export const updateDocumentSchema = createUpdateSchema(document);

// Suggestion schemas
export const selectSuggestionSchema = createSelectSchema(suggestion);
export const insertSuggestionSchema = createInsertSchema(suggestion);
export const updateSuggestionSchema = createUpdateSchema(suggestion);

