import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export type AuthUser = InferSelectModel<typeof user>;
export type User = Omit<AuthUser, 'passwordHash'>;

export const userProfile = pgTable('user_profile', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	dateOfBirth: text('date_of_birth'),
	phoneNumber: text('phone_number'),
	address: text('address'),
	preferences: text('preferences'),
	avatarUrl: text('avatar_url'),
	bio: text('bio'),
	linkedinUrl: text('linkedin_url'),
	githubUrl: text('github_url'),
	portfolioUrl: text('portfolio_url'),
	skills: text('skills'),
	experienceLevel: text('experience_level')
		.$type<'entry' | 'mid' | 'senior' | 'lead' | 'executive'>()
		.default('entry'),
	industry: text('industry'),
	company: text('company'),
	jobTitle: text('job_title'),
	yearsOfExperience: integer('years_of_experience').default(0),
	education: text('education'),
	certifications: text('certifications'),
	languages: text('languages'),
	timezone: text('timezone').default('UTC'),
	availability: text('availability')
		.$type<'available' | 'busy' | 'away' | 'offline'>()
		.default('available'),
	lastActive: timestamp('last_active'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export type UserProfile = InferSelectModel<typeof userProfile>;

