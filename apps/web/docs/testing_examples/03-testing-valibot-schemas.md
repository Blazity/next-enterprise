# Testing Valibot Schemas

## Introduction

Valibot schemas are crucial for data validation in SvelteKit applications. Testing your schemas ensures that your data validation works correctly and provides appropriate error messages. Since schemas define the contract between your application and external data, comprehensive testing prevents runtime errors and improves type safety.

### Why Validation Testing is Critical

- **Data Integrity**: Schemas prevent invalid data from entering your system
- **Type Safety**: Well-tested schemas ensure TypeScript types match runtime validation
- **User Experience**: Clear error messages help users fix validation issues
- **API Reliability**: Prevents malformed data from causing downstream errors

### Testing Approach

- Test both valid and invalid inputs
- Verify error messages are clear and helpful
- Test edge cases and boundary conditions
- Ensure TypeScript types match schema expectations
- Test schema composition and transformations

## Example 1: Testing Basic Schema Validation

Let's create comprehensive tests for user-related schemas based on your application's architecture.

```typescript
// src/lib/schemas/user.ts
import * as v from 'valibot';

export const userIdSchema = v.pipe(
	v.string('User ID must be a string'),
	v.uuid('User ID must be a valid UUID')
);

export const emailSchema = v.pipe(
	v.string('Email must be a string'),
	v.nonEmpty('Email is required'),
	v.email('Email must be a valid email address'),
	v.maxLength(254, 'Email must be less than 255 characters')
);

export const passwordSchema = v.pipe(
	v.string('Password must be a string'),
	v.nonEmpty('Password is required'),
	v.minLength(8, 'Password must be at least 8 characters'),
	v.maxLength(128, 'Password must be less than 129 characters'),
	v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
	v.regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
	v.regex(/\d/, 'Password must contain at least one number'),
	v.regex(
		/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
		'Password must contain at least one special character'
	)
);

export const userNameSchema = v.pipe(
	v.string('Name must be a string'),
	v.nonEmpty('Name is required'),
	v.trim(),
	v.minLength(2, 'Name must be at least 2 characters'),
	v.maxLength(100, 'Name must be less than 101 characters'),
	v.regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
);

export const createUserSchema = v.object({
	email: emailSchema,
	password: passwordSchema,
	name: userNameSchema
});

export const loginSchema = v.object({
	email: emailSchema,
	password: v.pipe(v.string('Password must be a string'), v.nonEmpty('Password is required'))
});

export type CreateUserInput = v.InferInput<typeof createUserSchema>;
export type CreateUserOutput = v.InferOutput<typeof createUserSchema>;
export type LoginInput = v.InferInput<typeof loginSchema>;
export type LoginOutput = v.InferOutput<typeof loginSchema>;
```

```typescript
// src/lib/schemas/user.unit.test.ts
import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import {
	userIdSchema,
	emailSchema,
	passwordSchema,
	userNameSchema,
	createUserSchema,
	loginSchema,
	type CreateUserInput,
	type CreateUserOutput,
	type LoginInput,
	type LoginOutput
} from './user';

describe('User Schemas', () => {
	describe('userIdSchema', () => {
		it('should validate valid UUIDs', () => {
			const validUuids = [
				'123e4567-e89b-12d3-a456-426614174000',
				'550e8400-e29b-41d4-a716-446655440000',
				'f47ac10b-58cc-4372-a567-0e02b2c3d479'
			];

			validUuids.forEach((uuid) => {
				expect(() => v.parse(userIdSchema, uuid)).not.toThrow();
				expect(v.parse(userIdSchema, uuid)).toBe(uuid);
			});
		});

		it('should reject invalid UUIDs', () => {
			const invalidUuids = [
				'not-a-uuid',
				'123',
				'',
				'123e4567-e89b-12d3-a456-42661417400', // too short
				'123e4567-e89b-12d3-a456-426614174000-extra', // too long
				'123e4567-e89b-12d3-a456-42661417400g' // invalid character
			];

			invalidUuids.forEach((uuid) => {
				expect(() => v.parse(userIdSchema, uuid)).toThrow();
			});
		});

		it('should reject non-string inputs', () => {
			const invalidInputs = [123, null, undefined, {}, []];

			invalidInputs.forEach((input) => {
				expect(() => v.parse(userIdSchema, input)).toThrow('User ID must be a string');
			});
		});
	});

	describe('emailSchema', () => {
		it('should validate valid email addresses', () => {
			const validEmails = [
				'user@example.com',
				'test.email+tag@domain.co.uk',
				'user_name@domain.org',
				'123@test-domain.com'
			];

			validEmails.forEach((email) => {
				expect(() => v.parse(emailSchema, email)).not.toThrow();
				expect(v.parse(emailSchema, email)).toBe(email);
			});
		});

		it('should reject invalid email addresses', () => {
			const invalidEmails = [
				'',
				'not-an-email',
				'@example.com',
				'user@',
				'user',
				'user@.com',
				'user..double@example.com'
			];

			invalidEmails.forEach((email) => {
				expect(() => v.parse(emailSchema, email)).toThrow();
			});
		});

		it('should reject emails that are too long', () => {
			const longEmail = 'a'.repeat(250) + '@example.com'; // > 254 chars
			expect(() => v.parse(emailSchema, longEmail)).toThrow(
				'Email must be less than 255 characters'
			);
		});

		it('should reject non-string inputs', () => {
			expect(() => v.parse(emailSchema, 123)).toThrow('Email must be a string');
			expect(() => v.parse(emailSchema, null)).toThrow('Email must be a string');
		});
	});

	describe('passwordSchema', () => {
		it('should validate strong passwords', () => {
			const validPasswords = ['Password123!', 'MySecurePass123@', 'Complex#Pass1'];

			validPasswords.forEach((password) => {
				expect(() => v.parse(passwordSchema, password)).not.toThrow();
				expect(v.parse(passwordSchema, password)).toBe(password);
			});
		});

		it('should reject weak passwords', () => {
			const testCases = [
				['', 'Password is required'],
				['short', 'Password must be at least 8 characters'],
				['nouppercase123!', 'Password must contain at least one uppercase letter'],
				['NOLOWERCASE123!', 'Password must contain at least one lowercase letter'],
				['NoNumber!', 'Password must contain at least one number'],
				['NoSpecial123', 'Password must contain at least one special character'],
				['a'.repeat(129), 'Password must be less than 129 characters'] // too long
			];

			testCases.forEach(([password, expectedError]) => {
				expect(() => v.parse(passwordSchema, password)).toThrow(expectedError);
			});
		});
	});

	describe('userNameSchema', () => {
		it('should validate valid names', () => {
			const validNames = ['John Doe', "Mary-Jane O'Connor", 'José María', 'Åke Nordström'];

			validNames.forEach((name) => {
				expect(() => v.parse(userNameSchema, name)).not.toThrow();
			});
		});

		it('should trim whitespace', () => {
			expect(v.parse(userNameSchema, '  John Doe  ')).toBe('John Doe');
		});

		it('should reject invalid names', () => {
			const testCases = [
				['', 'Name is required'],
				['A', 'Name must be at least 2 characters'],
				['a'.repeat(101), 'Name must be less than 101 characters'],
				['John123', 'Name can only contain letters, spaces, hyphens, and apostrophes'],
				['John@Doe', 'Name can only contain letters, spaces, hyphens, and apostrophes']
			];

			testCases.forEach(([name, expectedError]) => {
				expect(() => v.parse(userNameSchema, name)).toThrow(expectedError);
			});
		});
	});

	describe('createUserSchema', () => {
		it('should validate complete user data', () => {
			const validUser: CreateUserInput = {
				email: 'john.doe@example.com',
				password: 'SecurePass123!',
				name: 'John Doe'
			};

			const result = v.parse(createUserSchema, validUser);
			expect(result).toEqual(validUser);
		});

		it('should reject invalid user data', () => {
			const invalidUsers = [
				{ email: '', password: 'Pass123!', name: 'John' }, // empty email
				{ email: 'john@example.com', password: 'weak', name: 'John' }, // weak password
				{ email: 'john@example.com', password: 'SecurePass123!', name: 'J' }, // short name
				{ email: 'invalid-email', password: 'SecurePass123!', name: 'John' } // invalid email
			];

			invalidUsers.forEach((user) => {
				expect(() => v.parse(createUserSchema, user)).toThrow();
			});
		});

		it('should reject missing required fields', () => {
			const incompleteUsers = [
				{ password: 'SecurePass123!', name: 'John' }, // missing email
				{ email: 'john@example.com', name: 'John' }, // missing password
				{ email: 'john@example.com', password: 'SecurePass123!' } // missing name
			];

			incompleteUsers.forEach((user) => {
				expect(() => v.parse(createUserSchema, user)).toThrow();
			});
		});
	});

	describe('loginSchema', () => {
		it('should validate login credentials', () => {
			const validLogin: LoginInput = {
				email: 'john@example.com',
				password: 'anyPassword'
			};

			const result = v.parse(loginSchema, validLogin);
			expect(result).toEqual(validLogin);
		});

		it('should reject invalid login data', () => {
			const invalidLogins = [
				{ email: '', password: 'password' }, // empty email
				{ email: 'john@example.com', password: '' }, // empty password
				{ email: 'invalid-email', password: 'password' } // invalid email
			];

			invalidLogins.forEach((login) => {
				expect(() => v.parse(loginSchema, login)).toThrow();
			});
		});
	});
});
```

## Example 2: Testing Complex Nested Schemas

Let's create schemas for more complex data structures like blog posts with comments.

```typescript
// src/lib/schemas/blog.ts
import * as v from 'valibot';

export const commentSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	author: v.pipe(v.string(), v.nonEmpty(), v.maxLength(100)),
	content: v.pipe(v.string(), v.nonEmpty(), v.maxLength(2000)),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	isApproved: v.boolean()
});

export const tagSchema = v.pipe(
	v.string(),
	v.nonEmpty(),
	v.trim(),
	v.minLength(2),
	v.maxLength(30),
	v.regex(/^[a-zA-Z0-9\s-]+$/, 'Tags can only contain letters, numbers, spaces, and hyphens')
);

export const postSchema = v.object({
	id: v.pipe(v.string(), v.uuid()),
	title: v.pipe(v.string(), v.nonEmpty(), v.maxLength(200)),
	slug: v.pipe(
		v.string(),
		v.nonEmpty(),
		v.maxLength(200),
		v.regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe')
	),
	content: v.pipe(v.string(), v.nonEmpty(), v.maxLength(50000)),
	excerpt: v.pipe(v.string(), v.maxLength(500)),
	tags: v.array(tagSchema),
	author: v.object({
		id: v.pipe(v.string(), v.uuid()),
		name: v.pipe(v.string(), v.nonEmpty()),
		email: v.pipe(v.string(), v.email())
	}),
	publishedAt: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	comments: v.array(commentSchema),
	metadata: v.record(
		v.pipe(v.string(), v.nonEmpty()),
		v.union([v.string(), v.number(), v.boolean()])
	)
});

export type Post = v.InferOutput<typeof postSchema>;
export type Comment = v.InferOutput<typeof commentSchema>;
```

```typescript
// src/lib/schemas/blog.unit.test.ts
import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import { postSchema, commentSchema, tagSchema, type Post, type Comment } from './blog';

describe('Blog Schemas', () => {
	describe('commentSchema', () => {
		it('should validate complete comment data', () => {
			const validComment = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				author: 'John Doe',
				content: 'This is a great post!',
				createdAt: '2024-01-15T10:30:00.000Z',
				isApproved: true
			};

			const result = v.parse(commentSchema, validComment);
			expect(result).toEqual(validComment);
		});

		it('should reject invalid comment data', () => {
			const invalidComments = [
				{
					id: 'invalid-uuid',
					author: 'John',
					content: 'Hi',
					createdAt: '2024-01-15T10:30:00.000Z',
					isApproved: true
				}, // invalid UUID
				{
					id: '123e4567-e89b-12d3-a456-426614174000',
					author: '',
					content: 'Hi',
					createdAt: '2024-01-15T10:30:00.000Z',
					isApproved: true
				}, // empty author
				{
					id: '123e4567-e89b-12d3-a456-426614174000',
					author: 'John',
					content: '',
					createdAt: '2024-01-15T10:30:00.000Z',
					isApproved: true
				}, // empty content
				{
					id: '123e4567-e89b-12d3-a456-426614174000',
					author: 'John',
					content: 'Hi',
					createdAt: 'invalid-date',
					isApproved: true
				} // invalid date
			];

			invalidComments.forEach((comment) => {
				expect(() => v.parse(commentSchema, comment)).toThrow();
			});
		});

		it('should handle long content', () => {
			const longContent = 'a'.repeat(2001); // exceeds maxLength
			const comment = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				author: 'John Doe',
				content: longContent,
				createdAt: '2024-01-15T10:30:00.000Z',
				isApproved: false
			};

			expect(() => v.parse(commentSchema, comment)).toThrow(
				'content must be less than 2001 characters'
			);
		});
	});

	describe('tagSchema', () => {
		it('should validate valid tags', () => {
			const validTags = ['javascript', 'web-development', 'svelte-kit', 'TypeScript', 'CSS Tricks'];

			validTags.forEach((tag) => {
				expect(() => v.parse(tagSchema, tag)).not.toThrow();
			});
		});

		it('should reject invalid tags', () => {
			const invalidTags = [
				'', // empty
				'a', // too short
				'a'.repeat(31), // too long
				'tag@with#special', // special characters
				'tag with invalid:chars' // invalid characters
			];

			invalidTags.forEach((tag) => {
				expect(() => v.parse(tagSchema, tag)).toThrow();
			});
		});

		it('should trim whitespace', () => {
			expect(v.parse(tagSchema, '  javascript  ')).toBe('javascript');
		});
	});

	describe('postSchema', () => {
		const validPost = {
			id: '123e4567-e89b-12d3-a456-426614174000',
			title: 'Getting Started with SvelteKit',
			slug: 'getting-started-with-sveltekit',
			content: 'SvelteKit is a framework for building web applications...',
			excerpt: 'Learn how to build modern web apps with SvelteKit',
			tags: ['svelte', 'javascript', 'web-development'],
			author: {
				id: '456e7890-e89b-12d3-a456-426614174000',
				name: 'Jane Smith',
				email: 'jane@example.com'
			},
			publishedAt: '2024-01-15T10:30:00.000Z',
			comments: [
				{
					id: '789e0123-e89b-12d3-a456-426614174000',
					author: 'Commenter One',
					content: 'Great article!',
					createdAt: '2024-01-16T14:20:00.000Z',
					isApproved: true
				}
			],
			metadata: {
				wordCount: 1250,
				readingTime: 6,
				featured: true,
				category: 'tutorial'
			}
		};

		it('should validate complete post data', () => {
			const result = v.parse(postSchema, validPost);
			expect(result).toEqual(validPost);
		});

		it('should handle optional publishedAt', () => {
			const draftPost = { ...validPost };
			delete draftPost.publishedAt;

			const result = v.parse(postSchema, draftPost);
			expect(result.publishedAt).toBeUndefined();
		});

		it('should validate empty comments array', () => {
			const postWithoutComments = { ...validPost, comments: [] };
			const result = v.parse(postSchema, postWithoutComments);
			expect(result.comments).toEqual([]);
		});

		it('should validate metadata record', () => {
			const postWithMetadata = {
				...validPost,
				metadata: {
					views: 1500,
					likes: 42,
					published: true,
					tags: 'svelte,typescript'
				}
			};

			const result = v.parse(postSchema, postWithMetadata);
			expect(result.metadata).toEqual(postWithMetadata.metadata);
		});

		it('should reject invalid post data', () => {
			const invalidPosts = [
				{ ...validPost, id: 'invalid-uuid' }, // invalid UUID
				{ ...validPost, title: '' }, // empty title
				{ ...validPost, slug: 'Invalid Slug!' }, // invalid slug
				{ ...validPost, tags: ['valid', 'tag@invalid'] }, // invalid tag
				{ ...validPost, author: { ...validPost.author, email: 'invalid-email' } } // invalid email
			];

			invalidPosts.forEach((post) => {
				expect(() => v.parse(postSchema, post)).toThrow();
			});
		});
	});
});
```

## Example 3: Testing Custom Validation Rules

Create schemas with custom validation functions for business logic.

```typescript
// src/lib/schemas/business-rules.ts
import * as v from 'valibot';

export const ageSchema = v.pipe(
	v.number('Age must be a number'),
	v.minValue(0, 'Age cannot be negative'),
	v.maxValue(150, 'Age cannot be more than 150')
);

export const phoneNumberSchema = v.pipe(
	v.string('Phone number must be a string'),
	v.nonEmpty('Phone number is required'),
	v.regex(
		/^\+?[\d\s\-\(\)]+$/,
		'Phone number can only contain digits, spaces, hyphens, parentheses, and optional leading +'
	),
	v.custom((phone) => {
		// Remove all non-digit characters except +
		const digitsOnly = phone.replace(/[^\d+]/g, '');
		return digitsOnly.length >= 10 && digitsOnly.length <= 15;
	}, 'Phone number must be between 10 and 15 digits')
);

// Business rule: Password cannot contain the user's name
export function createPasswordSchema(forbiddenWords: string[] = []) {
	return v.pipe(
		v.string('Password must be a string'),
		v.nonEmpty('Password is required'),
		v.minLength(8, 'Password must be at least 8 characters'),
		v.custom((password) => {
			const lowerPassword = password.toLowerCase();
			return !forbiddenWords.some((word) => lowerPassword.includes(word.toLowerCase()));
		}, `Password cannot contain forbidden words`)
	);
}

// Business rule: End date must be after start date
export const dateRangeSchema = v.pipe(
	v.object({
		startDate: v.pipe(v.string(), v.isoDate()),
		endDate: v.pipe(v.string(), v.isoDate())
	}),
	v.custom((dates) => {
		const start = new Date(dates.startDate);
		const end = new Date(dates.endDate);
		return end > start;
	}, 'End date must be after start date')
);

// Business rule: At least one contact method required
export const contactInfoSchema = v.pipe(
	v.object({
		email: v.optional(v.pipe(v.string(), v.email())),
		phone: v.optional(phoneNumberSchema),
		address: v.optional(v.pipe(v.string(), v.nonEmpty()))
	}),
	v.custom((contact) => {
		return !!(contact.email || contact.phone || contact.address);
	}, 'At least one contact method (email, phone, or address) is required')
);

export type ContactInfo = v.InferOutput<typeof contactInfoSchema>;
```

```typescript
// src/lib/schemas/business-rules.unit.test.ts
import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import {
	ageSchema,
	phoneNumberSchema,
	createPasswordSchema,
	dateRangeSchema,
	contactInfoSchema,
	type ContactInfo
} from './business-rules';

describe('Business Rules Schemas', () => {
	describe('ageSchema', () => {
		it('should validate valid ages', () => {
			const validAges = [0, 18, 25, 65, 100, 150];

			validAges.forEach((age) => {
				expect(() => v.parse(ageSchema, age)).not.toThrow();
				expect(v.parse(ageSchema, age)).toBe(age);
			});
		});

		it('should reject invalid ages', () => {
			const invalidAges = [
				[-1, 'Age cannot be negative'],
				[151, 'Age cannot be more than 150'],
				['25', 'Age must be a number'],
				[null, 'Age must be a number']
			];

			invalidAges.forEach(([age, expectedError]) => {
				expect(() => v.parse(ageSchema, age)).toThrow(expectedError);
			});
		});
	});

	describe('phoneNumberSchema', () => {
		it('should validate valid phone numbers', () => {
			const validPhones = [
				'+1-555-123-4567',
				'(555) 123-4567',
				'555-123-4567',
				'+44 20 7123 4567',
				'07123456789'
			];

			validPhones.forEach((phone) => {
				expect(() => v.parse(phoneNumberSchema, phone)).not.toThrow();
			});
		});

		it('should reject invalid phone numbers', () => {
			const invalidPhones = [
				['', 'Phone number is required'],
				[
					'abc',
					'Phone number can only contain digits, spaces, hyphens, parentheses, and optional leading +'
				],
				['123', 'Phone number must be between 10 and 15 digits'], // too short
				['1'.repeat(20), 'Phone number must be between 10 and 15 digits'], // too long
				['555-123-456', 'Phone number must be between 10 and 15 digits'] // too short after cleaning
			];

			invalidPhones.forEach(([phone, expectedError]) => {
				expect(() => v.parse(phoneNumberSchema, phone)).toThrow(expectedError);
			});
		});
	});

	describe('createPasswordSchema', () => {
		it('should validate passwords without forbidden words', () => {
			const passwordSchema = createPasswordSchema(['password', 'admin']);
			const validPasswords = ['MySecurePass123', 'AnotherPass456'];

			validPasswords.forEach((password) => {
				expect(() => v.parse(passwordSchema, password)).not.toThrow();
			});
		});

		it('should reject passwords containing forbidden words', () => {
			const passwordSchema = createPasswordSchema(['password', 'admin']);

			expect(() => v.parse(passwordSchema, 'mypassword123')).toThrow(
				'Password cannot contain forbidden words'
			);
			expect(() => v.parse(passwordSchema, 'adminSecure456')).toThrow(
				'Password cannot contain forbidden words'
			);
			expect(() => v.parse(passwordSchema, 'MyPassword123')).toThrow(
				'Password cannot contain forbidden words'
			); // case insensitive
		});

		it('should work with empty forbidden words list', () => {
			const passwordSchema = createPasswordSchema([]);
			expect(() => v.parse(passwordSchema, 'password123')).not.toThrow();
		});
	});

	describe('dateRangeSchema', () => {
		it('should validate valid date ranges', () => {
			const validRanges = [
				{ startDate: '2024-01-01', endDate: '2024-01-02' },
				{ startDate: '2024-01-15T10:00:00.000Z', endDate: '2024-01-15T11:00:00.000Z' }
			];

			validRanges.forEach((range) => {
				expect(() => v.parse(dateRangeSchema, range)).not.toThrow();
			});
		});

		it('should reject invalid date ranges', () => {
			const invalidRanges = [
				{ startDate: '2024-01-02', endDate: '2024-01-01' }, // end before start
				{ startDate: '2024-01-01', endDate: '2024-01-01' }, // same date
				{ startDate: 'invalid', endDate: '2024-01-02' }, // invalid start date
				{ startDate: '2024-01-01', endDate: 'invalid' } // invalid end date
			];

			invalidRanges.forEach((range) => {
				expect(() => v.parse(dateRangeSchema, range)).toThrow();
			});
		});
	});

	describe('contactInfoSchema', () => {
		it('should validate contact info with at least one method', () => {
			const validContacts: ContactInfo[] = [
				{ email: 'user@example.com' },
				{ phone: '+1-555-123-4567' },
				{ address: '123 Main St' },
				{ email: 'user@example.com', phone: '+1-555-123-4567' },
				{ email: 'user@example.com', address: '123 Main St' },
				{ phone: '+1-555-123-4567', address: '123 Main St' },
				{ email: 'user@example.com', phone: '+1-555-123-4567', address: '123 Main St' }
			];

			validContacts.forEach((contact) => {
				expect(() => v.parse(contactInfoSchema, contact)).not.toThrow();
			});
		});

		it('should reject contact info with no methods', () => {
			const invalidContacts = [
				{},
				{ email: '' },
				{ phone: '' },
				{ address: '' },
				{ email: null, phone: null, address: null }
			];

			invalidContacts.forEach((contact) => {
				expect(() => v.parse(contactInfoSchema, contact)).toThrow(
					'At least one contact method (email, phone, or address) is required'
				);
			});
		});

		it('should validate individual contact methods', () => {
			const contactWithInvalidEmail = {
				email: 'invalid-email',
				phone: '+1-555-123-4567'
			};

			expect(() => v.parse(contactInfoSchema, contactWithInvalidEmail)).toThrow();

			const contactWithInvalidPhone = {
				email: 'user@example.com',
				phone: 'invalid-phone'
			};

			expect(() => v.parse(contactInfoSchema, contactWithInvalidPhone)).toThrow();
		});
	});
});
```

## Example 4: Testing Schema Transformations

Test schemas that transform data during validation.

```typescript
// src/lib/schemas/transformations.ts
import * as v from 'valibot';

export const normalizedEmailSchema = v.pipe(
	v.string(),
	v.email(),
	v.transform((email) => email.toLowerCase().trim())
);

export const slugSchema = v.pipe(
	v.string(),
	v.nonEmpty(),
	v.transform((str) => str.toLowerCase()),
	v.transform((str) => str.replace(/[^\w\s-]/g, '')), // Remove special chars
	v.transform((str) => str.replace(/[\s_-]+/g, '-')), // Replace spaces/underscores with hyphens
	v.transform((str) => str.replace(/^-+|-+$/g, '')), // Remove leading/trailing hyphens
	v.minLength(1, 'Slug cannot be empty after normalization')
);

export const userProfileSchema = v.pipe(
	v.object({
		firstName: v.pipe(v.string(), v.trim(), v.nonEmpty()),
		lastName: v.pipe(v.string(), v.trim(), v.nonEmpty()),
		email: normalizedEmailSchema
	}),
	v.transform((user) => ({
		...user,
		fullName: `${user.firstName} ${user.lastName}`,
		initials: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase(),
		emailHash: btoa(user.email).slice(0, 10) // Simple hash for demo
	}))
);

export const apiResponseSchema = v.pipe(
	v.object({
		data: v.array(
			v.object({
				id: v.number(),
				name: v.string(),
				created_at: v.string()
			})
		),
		meta: v.object({
			total: v.number(),
			page: v.number(),
			limit: v.number()
		})
	}),
	v.transform((response) => ({
		items: response.data.map((item) => ({
			...item,
			createdAt: new Date(item.created_at).toISOString()
		})),
		pagination: {
			total: response.meta.total,
			currentPage: response.meta.page,
			perPage: response.meta.limit,
			totalPages: Math.ceil(response.meta.total / response.meta.limit)
		}
	}))
);

export type UserProfile = v.InferOutput<typeof userProfileSchema>;
export type ApiResponse = v.InferOutput<typeof apiResponseSchema>;
```

```typescript
// src/lib/schemas/transformations.unit.test.ts
import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import {
	normalizedEmailSchema,
	slugSchema,
	userProfileSchema,
	apiResponseSchema,
	type UserProfile,
	type ApiResponse
} from './transformations';

describe('Schema Transformations', () => {
	describe('normalizedEmailSchema', () => {
		it('should normalize email addresses', () => {
			const testCases = [
				['USER@EXAMPLE.COM', 'user@example.com'],
				['  user@example.com  ', 'user@example.com'],
				['User.Name+Tag@Domain.Co.Uk', 'user.name+tag@domain.co.uk']
			];

			testCases.forEach(([input, expected]) => {
				const result = v.parse(normalizedEmailSchema, input);
				expect(result).toBe(expected);
			});
		});

		it('should reject invalid emails before transformation', () => {
			const invalidEmails = ['', 'not-an-email', '@example.com'];

			invalidEmails.forEach((email) => {
				expect(() => v.parse(normalizedEmailSchema, email)).toThrow();
			});
		});
	});

	describe('slugSchema', () => {
		it('should transform strings into URL-safe slugs', () => {
			const testCases = [
				['Hello World', 'hello-world'],
				['SvelteKit & TypeScript!', 'sveltekit-typescript'],
				['Multiple   Spaces', 'multiple-spaces'],
				['Under_Score and Hyphen-Test', 'under-score-and-hyphen-test'],
				['123 Numbers & Symbols @#$%', '123-numbers-symbols']
			];

			testCases.forEach(([input, expected]) => {
				const result = v.parse(slugSchema, input);
				expect(result).toBe(expected);
			});
		});

		it('should reject empty strings after normalization', () => {
			const invalidInputs = ['', '!!!', '   ', '@#$%'];

			invalidInputs.forEach((input) => {
				expect(() => v.parse(slugSchema, input)).toThrow(
					'Slug cannot be empty after normalization'
				);
			});
		});

		it('should handle edge cases', () => {
			expect(v.parse(slugSchema, 'a')).toBe('a');
			expect(v.parse(slugSchema, 'A')).toBe('a');
			expect(v.parse(slugSchema, '-leading-and-trailing-')).toBe('leading-and-trailing');
		});
	});

	describe('userProfileSchema', () => {
		it('should transform user data with computed fields', () => {
			const input = {
				firstName: '  John  ',
				lastName: 'Doe',
				email: 'JOHN.DOE@EXAMPLE.COM'
			};

			const expected: UserProfile = {
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@example.com',
				fullName: 'John Doe',
				initials: 'JD',
				emailHash: btoa('john.doe@example.com').slice(0, 10)
			};

			const result = v.parse(userProfileSchema, input);
			expect(result).toEqual(expected);
		});

		it('should validate input before transformation', () => {
			const invalidInputs = [
				{ firstName: '', lastName: 'Doe', email: 'john@example.com' }, // empty firstName
				{ firstName: 'John', lastName: '', email: 'john@example.com' }, // empty lastName
				{ firstName: 'John', lastName: 'Doe', email: 'invalid-email' } // invalid email
			];

			invalidInputs.forEach((input) => {
				expect(() => v.parse(userProfileSchema, input)).toThrow();
			});
		});

		it('should handle trimmed names correctly', () => {
			const input = {
				firstName: '  mary jane  ',
				lastName: '  smith-jones  ',
				email: 'mary@example.com'
			};

			const result = v.parse(userProfileSchema, input);
			expect(result.firstName).toBe('mary jane');
			expect(result.lastName).toBe('smith-jones');
			expect(result.fullName).toBe('mary jane smith-jones');
			expect(result.initials).toBe('MS');
		});
	});

	describe('apiResponseSchema', () => {
		it('should transform API response with computed pagination', () => {
			const input = {
				data: [
					{ id: 1, name: 'Item 1', created_at: '2024-01-15T10:30:00.000Z' },
					{ id: 2, name: 'Item 2', created_at: '2024-01-16T14:20:00.000Z' }
				],
				meta: {
					total: 25,
					page: 2,
					limit: 10
				}
			};

			const expected: ApiResponse = {
				items: [
					{ id: 1, name: 'Item 1', createdAt: '2024-01-15T10:30:00.000Z' },
					{ id: 2, name: 'Item 2', createdAt: '2024-01-16T14:20:00.000Z' }
				],
				pagination: {
					total: 25,
					currentPage: 2,
					perPage: 10,
					totalPages: 3
				}
			};

			const result = v.parse(apiResponseSchema, input);
			expect(result).toEqual(expected);
		});

		it('should calculate total pages correctly', () => {
			const testCases = [
				{ total: 10, limit: 5, expectedPages: 2 },
				{ total: 11, limit: 5, expectedPages: 3 },
				{ total: 1, limit: 10, expectedPages: 1 },
				{ total: 0, limit: 10, expectedPages: 0 }
			];

			testCases.forEach(({ total, limit, expectedPages }) => {
				const input = {
					data: [],
					meta: { total, page: 1, limit }
				};

				const result = v.parse(apiResponseSchema, input);
				expect(result.pagination.totalPages).toBe(expectedPages);
			});
		});

		it('should validate input data structure', () => {
			const invalidInputs = [
				{ data: 'not-an-array', meta: { total: 10, page: 1, limit: 5 } }, // invalid data
				{ data: [], meta: 'not-an-object' }, // invalid meta
				{ data: [], meta: { total: '10', page: 1, limit: 5 } } // invalid total type
			];

			invalidInputs.forEach((input) => {
				expect(() => v.parse(apiResponseSchema, input)).toThrow();
			});
		});
	});
});
```

## Example 5: Testing Schema Type Inference

Ensure TypeScript types match schema expectations.

```typescript
// src/lib/schemas/type-inference.unit.test.ts
import { describe, it, expectTypeOf } from 'vitest';
import * as v from 'valibot';
import { createUserSchema, loginSchema } from './user';
import { userProfileSchema, type UserProfile } from './transformations';

describe('Schema Type Inference', () => {
	describe('createUserSchema', () => {
		it('should have correct input type', () => {
			type InputType = v.InferInput<typeof createUserSchema>;

			expectTypeOf<InputType>().toEqualTypeOf<{
				email: string;
				password: string;
				name: string;
			}>();
		});

		it('should have correct output type (same as input for this schema)', () => {
			type OutputType = v.InferOutput<typeof createUserSchema>;

			expectTypeOf<OutputType>().toEqualTypeOf<{
				email: string;
				password: string;
				name: string;
			}>();
		});
	});

	describe('loginSchema', () => {
		it('should have correct input type', () => {
			type InputType = v.InferInput<typeof loginSchema>;

			expectTypeOf<InputType>().toEqualTypeOf<{
				email: string;
				password: string;
			}>();
		});

		it('should have correct output type', () => {
			type OutputType = v.InferOutput<typeof loginSchema>;

			expectTypeOf<OutputType>().toEqualTypeOf<{
				email: string;
				password: string;
			}>();
		});
	});

	describe('userProfileSchema', () => {
		it('should have correct input type', () => {
			type InputType = v.InferInput<typeof userProfileSchema>;

			expectTypeOf<InputType>().toEqualTypeOf<{
				firstName: string;
				lastName: string;
				email: string;
			}>();
		});

		it('should have correct output type with computed fields', () => {
			type OutputType = v.InferOutput<typeof userProfileSchema>;

			expectTypeOf<OutputType>().toEqualTypeOf<UserProfile>();

			// More specific checks
			expectTypeOf<OutputType>().toHaveProperty('firstName');
			expectTypeOf<OutputType>().toHaveProperty('lastName');
			expectTypeOf<OutputType>().toHaveProperty('email');
			expectTypeOf<OutputType>().toHaveProperty('fullName');
			expectTypeOf<OutputType>().toHaveProperty('initials');
			expectTypeOf<OutputType>().toHaveProperty('emailHash');
		});
	});

	describe('complex schema types', () => {
		it('should handle union types correctly', () => {
			const unionSchema = v.union([
				v.object({ type: v.literal('text'), content: v.string() }),
				v.object({ type: v.literal('image'), url: v.string(), alt: v.string() })
			]);

			type UnionType = v.InferOutput<typeof unionSchema>;

			expectTypeOf<UnionType>().toEqualTypeOf<
				{ type: 'text'; content: string } | { type: 'image'; url: string; alt: string }
			>();
		});

		it('should handle optional fields', () => {
			const optionalSchema = v.object({
				required: v.string(),
				optional: v.optional(v.number())
			});

			type OptionalType = v.InferOutput<typeof optionalSchema>;

			expectTypeOf<OptionalType>().toEqualTypeOf<{
				required: string;
				optional?: number;
			}>();
		});

		it('should handle array types', () => {
			const arraySchema = v.array(
				v.object({
					id: v.number(),
					name: v.string()
				})
			);

			type ArrayType = v.InferOutput<typeof arraySchema>;

			expectTypeOf<ArrayType>().toEqualTypeOf<
				Array<{
					id: number;
					name: string;
				}>
			>();
		});
	});
});
```

## Example 6: Testing Schema Composition

Test how multiple schemas work together.

```typescript
// src/lib/schemas/composition.ts
import * as v from 'valibot';
import { userIdSchema, emailSchema } from './user';

// Reusable address schema
export const addressSchema = v.object({
	street: v.pipe(v.string(), v.nonEmpty(), v.maxLength(200)),
	city: v.pipe(v.string(), v.nonEmpty(), v.maxLength(100)),
	state: v.pipe(v.string(), v.nonEmpty(), v.maxLength(100)),
	zipCode: v.pipe(
		v.string(),
		v.regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
	),
	country: v.pipe(v.string(), v.nonEmpty(), v.maxLength(100))
});

// Profile schema that extends user info
export const profileSchema = v.object({
	userId: userIdSchema,
	email: emailSchema,
	displayName: v.pipe(v.string(), v.nonEmpty(), v.maxLength(100)),
	bio: v.optional(v.pipe(v.string(), v.maxLength(500))),
	avatar: v.optional(v.pipe(v.string(), v.url())),
	address: addressSchema,
	preferences: v.record(
		v.pipe(v.string(), v.nonEmpty()),
		v.union([v.string(), v.number(), v.boolean()])
	)
});

// API request/response schemas
export const createProfileRequestSchema = v.omit(profileSchema, ['userId']);

export const updateProfileRequestSchema = v.partial(v.omit(profileSchema, ['userId', 'email']));

export const profileResponseSchema = v.object({
	...profileSchema.entries,
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	updatedAt: v.pipe(v.string(), v.isoTimestamp())
});

// Union type for different profile actions
export const profileActionSchema = v.union([
	v.object({
		type: v.literal('create'),
		data: createProfileRequestSchema
	}),
	v.object({
		type: v.literal('update'),
		userId: userIdSchema,
		data: updateProfileRequestSchema
	}),
	v.object({
		type: v.literal('delete'),
		userId: userIdSchema
	})
]);

export type Profile = v.InferOutput<typeof profileSchema>;
export type CreateProfileRequest = v.InferInput<typeof createProfileRequestSchema>;
export type UpdateProfileRequest = v.InferInput<typeof updateProfileRequestSchema>;
export type ProfileAction = v.InferInput<typeof profileActionSchema>;
```

```typescript
// src/lib/schemas/composition.unit.test.ts
import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import {
	addressSchema,
	profileSchema,
	createProfileRequestSchema,
	updateProfileRequestSchema,
	profileResponseSchema,
	profileActionSchema,
	type Profile,
	type CreateProfileRequest,
	type UpdateProfileRequest,
	type ProfileAction
} from './composition';

describe('Schema Composition', () => {
	const validAddress = {
		street: '123 Main St',
		city: 'Anytown',
		state: 'CA',
		zipCode: '12345',
		country: 'USA'
	};

	const validProfileBase = {
		userId: '123e4567-e89b-12d3-a456-426614174000',
		email: 'john.doe@example.com',
		displayName: 'John Doe',
		bio: 'Software developer passionate about TypeScript',
		avatar: 'https://example.com/avatar.jpg',
		address: validAddress,
		preferences: {
			theme: 'dark',
			notifications: true,
			language: 'en'
		}
	};

	describe('addressSchema', () => {
		it('should validate complete address', () => {
			const result = v.parse(addressSchema, validAddress);
			expect(result).toEqual(validAddress);
		});

		it('should validate ZIP codes', () => {
			const validZips = ['12345', '12345-6789', '90210', '10001-1234'];

			validZips.forEach((zip) => {
				const address = { ...validAddress, zipCode: zip };
				expect(() => v.parse(addressSchema, address)).not.toThrow();
			});
		});

		it('should reject invalid ZIP codes', () => {
			const invalidZips = ['1234', '123456', 'abcde', '12345-abc'];

			invalidZips.forEach((zip) => {
				const address = { ...validAddress, zipCode: zip };
				expect(() => v.parse(addressSchema, address)).toThrow(
					'ZIP code must be in format 12345 or 12345-6789'
				);
			});
		});
	});

	describe('profileSchema', () => {
		it('should validate complete profile', () => {
			const result = v.parse(profileSchema, validProfileBase);
			expect(result).toEqual(validProfileBase);
		});

		it('should handle optional fields', () => {
			const minimalProfile = {
				userId: '123e4567-e89b-12d3-a456-426614174000',
				email: 'john@example.com',
				displayName: 'John',
				address: validAddress,
				preferences: {}
			};

			const result = v.parse(profileSchema, minimalProfile);
			expect(result.bio).toBeUndefined();
			expect(result.avatar).toBeUndefined();
		});

		it('should validate nested address', () => {
			const profileWithInvalidAddress = {
				...validProfileBase,
				address: { ...validAddress, zipCode: 'invalid' }
			};

			expect(() => v.parse(profileSchema, profileWithInvalidAddress)).toThrow();
		});

		it('should validate preferences record', () => {
			const profileWithPreferences = {
				...validProfileBase,
				preferences: {
					theme: 'light',
					volume: 75,
					enabled: false,
					tags: 'typescript,svelte'
				}
			};

			const result = v.parse(profileSchema, profileWithPreferences);
			expect(result.preferences).toEqual(profileWithPreferences.preferences);
		});
	});

	describe('createProfileRequestSchema', () => {
		it('should exclude userId from profile schema', () => {
			const createRequest: CreateProfileRequest = {
				email: 'john@example.com',
				displayName: 'John Doe',
				bio: 'Developer',
				address: validAddress,
				preferences: { theme: 'dark' }
			};

			const result = v.parse(createProfileRequestSchema, createRequest);
			expect(result).not.toHaveProperty('userId');
			expect(result.email).toBe('john@example.com');
		});

		it('should require all fields except userId', () => {
			const incompleteRequest = {
				email: 'john@example.com'
				// missing displayName, address, preferences
			};

			expect(() => v.parse(createProfileRequestSchema, incompleteRequest)).toThrow();
		});
	});

	describe('updateProfileRequestSchema', () => {
		it('should allow partial updates', () => {
			const updateRequests: UpdateProfileRequest[] = [
				{ displayName: 'New Name' },
				{ bio: 'Updated bio' },
				{ address: { ...validAddress, city: 'New City' } },
				{ preferences: { theme: 'light' } },
				{ displayName: 'Name', bio: 'Bio', avatar: 'https://example.com/new-avatar.jpg' }
			];

			updateRequests.forEach((request) => {
				expect(() => v.parse(updateProfileRequestSchema, request)).not.toThrow();
			});
		});

		it('should reject userId and email fields', () => {
			const invalidUpdates = [
				{ userId: '123e4567-e89b-12d3-a456-426614174000' },
				{ email: 'new@example.com' }
			];

			invalidUpdates.forEach((update) => {
				expect(() => v.parse(updateProfileRequestSchema, update)).toThrow();
			});
		});
	});

	describe('profileResponseSchema', () => {
		it('should include timestamps in response', () => {
			const responseData = {
				...validProfileBase,
				createdAt: '2024-01-15T10:30:00.000Z',
				updatedAt: '2024-01-16T14:20:00.000Z'
			};

			const result = v.parse(profileResponseSchema, responseData);
			expect(result.createdAt).toBe('2024-01-15T10:30:00.000Z');
			expect(result.updatedAt).toBe('2024-01-16T14:20:00.000Z');
		});

		it('should validate timestamp format', () => {
			const invalidResponse = {
				...validProfileBase,
				createdAt: 'invalid-date',
				updatedAt: '2024-01-16T14:20:00.000Z'
			};

			expect(() => v.parse(profileResponseSchema, invalidResponse)).toThrow();
		});
	});

	describe('profileActionSchema', () => {
		it('should validate create action', () => {
			const createAction: ProfileAction = {
				type: 'create',
				data: {
					email: 'john@example.com',
					displayName: 'John Doe',
					address: validAddress,
					preferences: {}
				}
			};

			const result = v.parse(profileActionSchema, createAction);
			expect(result.type).toBe('create');
		});

		it('should validate update action', () => {
			const updateAction: ProfileAction = {
				type: 'update',
				userId: '123e4567-e89b-12d3-a456-426614174000',
				data: { displayName: 'Updated Name' }
			};

			const result = v.parse(profileActionSchema, updateAction);
			expect(result.type).toBe('update');
		});

		it('should validate delete action', () => {
			const deleteAction: ProfileAction = {
				type: 'delete',
				userId: '123e4567-e89b-12d3-a456-426614174000'
			};

			const result = v.parse(profileActionSchema, deleteAction);
			expect(result.type).toBe('delete');
		});

		it('should reject invalid action types', () => {
			const invalidAction = {
				type: 'invalid',
				data: {}
			};

			expect(() => v.parse(profileActionSchema, invalidAction)).toThrow();
		});
	});
});
```

## Best Practices

### Testing Valid and Invalid Inputs

- **Comprehensive Coverage**: Test both valid and invalid inputs for every schema
- **Edge Cases**: Include boundary values, empty strings, null/undefined values
- **Error Messages**: Verify that error messages are clear and actionable

### Error Message Validation

```typescript
// Test specific error messages
it('should provide clear error message for invalid email', () => {
	expect(() => v.parse(emailSchema, 'invalid')).toThrow('Email must be a valid email address');
});
```

### Type Testing

- **Type Inference**: Use `v.InferInput<>` and `v.InferOutput<>` types
- **Type Guards**: Use `expectTypeOf()` for compile-time type checking
- **Type Safety**: Ensure TypeScript types match runtime validation

### Performance Considerations

- **Schema Reuse**: Define schemas once and reuse them
- **Validation Order**: Place fast validations before expensive ones
- **Early Returns**: Use `v.pipe()` to fail fast on invalid inputs

### Schema Organization

- **Separation of Concerns**: Keep validation logic separate from business logic
- **Composable Schemas**: Build complex schemas from smaller, reusable parts
- **Clear Naming**: Use descriptive names for schemas and their exported types

This comprehensive testing approach ensures your Valibot schemas are robust, well-documented, and maintainable. The next guide covers testing Drizzle ORM database queries.
