import * as v from 'valibot';

// Base schemas for user profile form
export const addressSchema = v.object({
	street: v.pipe(v.string(), v.minLength(1, 'Street is required')),
	city: v.pipe(v.string(), v.minLength(1, 'City is required')),
	state: v.pipe(v.string(), v.minLength(1, 'State is required')),
	zipCode: v.pipe(v.string(), v.minLength(5, 'ZIP code must be at least 5 characters')),
	country: v.pipe(v.string(), v.minLength(1, 'Country is required'))
});

export const educationSchema = v.object({
	institution: v.pipe(v.string(), v.minLength(1, 'Institution is required')),
	degree: v.pipe(v.string(), v.minLength(1, 'Degree is required')),
	fieldOfStudy: v.pipe(v.string(), v.minLength(1, 'Field of study is required')),
	startDate: v.pipe(v.string(), v.minLength(1, 'Start date is required')),
	endDate: v.optional(v.string()),
	isCurrentlyEnrolled: v.boolean(),
	gpa: v.optional(v.pipe(v.string(), v.transform(Number)))
});

export const certificationSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1, 'Certification name is required')),
	issuer: v.pipe(v.string(), v.minLength(1, 'Issuer is required')),
	issueDate: v.pipe(v.string(), v.minLength(1, 'Issue date is required')),
	expirationDate: v.optional(v.string()),
	credentialId: v.optional(v.string())
});

export const languageSchema = v.object({
	language: v.pipe(v.string(), v.minLength(1, 'Language is required')),
	proficiency: v.picklist(['beginner', 'intermediate', 'advanced', 'native'])
});

// Main user profile form schema
export const userProfileFormSchema = v.object({
	// Basic Information
	firstName: v.pipe(
		v.string(),
		v.minLength(1, 'First name is required'),
		v.minLength(2, 'First name must be at least 2 characters')
	),
	lastName: v.pipe(
		v.string(),
		v.minLength(1, 'Last name is required'),
		v.minLength(2, 'Last name must be at least 2 characters')
	),
	dateOfBirth: v.optional(v.pipe(v.string(), v.minLength(1))),
	phoneNumber: v.optional(
		v.pipe(v.string(), v.regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'))
	),

	// Address
	address: v.optional(addressSchema),

	// Professional Information
	experienceLevel: v.picklist(['entry', 'mid', 'senior', 'lead', 'executive']),
	industry: v.optional(v.pipe(v.string(), v.minLength(1))),
	company: v.optional(v.pipe(v.string(), v.minLength(1))),
	jobTitle: v.optional(v.pipe(v.string(), v.minLength(1))),
	yearsOfExperience: v.optional(
		v.pipe(
			v.number(),
			v.minValue(0, 'Years of experience cannot be negative'),
			v.maxValue(50, 'Years of experience cannot exceed 50')
		)
	),

	// Online Presence
	linkedinUrl: v.optional(v.pipe(v.string(), v.url('Please enter a valid LinkedIn URL'))),
	githubUrl: v.optional(v.pipe(v.string(), v.url('Please enter a valid GitHub URL'))),
	portfolioUrl: v.optional(v.pipe(v.string(), v.url('Please enter a valid portfolio URL'))),

	// Skills and Qualifications
	skills: v.optional(v.array(v.pipe(v.string(), v.minLength(1)))),
	education: v.optional(v.array(educationSchema)),
	certifications: v.optional(v.array(certificationSchema)),
	languages: v.optional(v.array(languageSchema)),

	// Personal Information
	bio: v.optional(v.pipe(v.string(), v.maxLength(500, 'Bio cannot exceed 500 characters'))),
	avatarUrl: v.optional(v.pipe(v.string(), v.url())),
	preferences: v.optional(v.record(v.string(), v.any())),
	timezone: v.optional(v.pipe(v.string(), v.minLength(1))),
	availability: v.optional(v.picklist(['available', 'busy', 'away', 'offline']))
});

// External API response schema
export const externalUserDataSchema = v.object({
	creditScore: v.pipe(v.number(), v.minValue(300), v.maxValue(850)),
	employmentStatus: v.picklist(['employed', 'self-employed', 'unemployed', 'student']),
	incomeRange: v.picklist(['0-25k', '25k-50k', '50k-75k', '75k-100k', '100k+']),
	riskProfile: v.picklist(['low', 'medium', 'high']),
	recommendations: v.array(v.pipe(v.string(), v.minLength(1)))
});

// Combined form schema with external data
export const completeUserProfileFormSchema = v.object({
	// User profile data
	profile: userProfileFormSchema,

	// External API data (read-only)
	externalData: externalUserDataSchema
});

// Type definitions
export type UserProfileFormData = v.InferInput<typeof userProfileFormSchema>;
export type ExternalUserData = v.InferInput<typeof externalUserDataSchema>;
export type CompleteUserProfileFormData = v.InferInput<typeof completeUserProfileFormSchema>;

// Default values for form initialization
export const defaultUserProfileFormValues: UserProfileFormData = {
	firstName: '',
	lastName: '',
	experienceLevel: 'entry',
	skills: [],
	education: [],
	certifications: [],
	languages: []
};

export const defaultExternalUserData: ExternalUserData = {
	creditScore: 650,
	employmentStatus: 'employed',
	incomeRange: '50k-75k',
	riskProfile: 'medium',
	recommendations: []
};
