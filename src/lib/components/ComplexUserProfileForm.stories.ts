import type { Meta, StoryObj } from '@storybook/svelte';
import ComplexUserProfileForm from './ComplexUserProfileForm.svelte';

// Mock data for stories
const mockUserProfile = {
	firstName: 'John',
	lastName: 'Doe',
	dateOfBirth: '1990-01-01',
	phoneNumber: '+1234567890',
	address: {
		street: '123 Main St',
		city: 'Anytown',
		state: 'CA',
		zipCode: '12345',
		country: 'USA'
	},
	experienceLevel: 'mid' as const,
	industry: 'Technology',
	company: 'Tech Corp',
	jobTitle: 'Software Developer',
	yearsOfExperience: 5,
	linkedinUrl: 'https://linkedin.com/in/johndoe',
	githubUrl: 'https://github.com/johndoe',
	portfolioUrl: 'https://johndoe.dev',
	bio: 'Passionate software developer with 5 years of experience in web development.',
	skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
	education: [
		{
			institution: 'University of Example',
			degree: 'Bachelor of Science',
			fieldOfStudy: 'Computer Science',
			startDate: '2008-09-01',
			endDate: '2012-05-01',
			isCurrentlyEnrolled: false
		}
	],
	certifications: [
		{
			name: 'AWS Certified Developer',
			issuer: 'Amazon Web Services',
			issueDate: '2020-01-01',
			expirationDate: '2023-01-01',
			credentialId: 'ABC123'
		}
	],
	languages: [
		{
			language: 'English',
			proficiency: 'native' as const
		},
		{
			language: 'Spanish',
			proficiency: 'intermediate' as const
		}
	],
	timezone: 'America/Los_Angeles',
	availability: 'available' as const
};

const mockExternalData = {
	creditScore: 720,
	employmentStatus: 'employed' as const,
	incomeRange: '75k-100k' as const,
	riskProfile: 'low' as const,
	recommendations: [
		'Consider increasing your emergency fund',
		'Look into retirement investment options',
		'Diversify your investment portfolio'
	]
};

const meta: Meta<typeof ComplexUserProfileForm> = {
	title: 'Components/ComplexUserProfileForm',
	component: ComplexUserProfileForm,
	argTypes: {
		userId: {
			control: 'text',
			description: 'User ID for profile loading'
		},
		data: {
			control: 'object',
			description: 'Form data and user information'
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with empty form
export const EmptyForm: Story = {
	args: {
		userId: 'user-123',
		data: {
			form: {
				profile: {
					firstName: '',
					lastName: '',
					experienceLevel: 'entry' as const,
					skills: [],
					education: [],
					certifications: [],
					languages: []
				},
				externalData: {
					creditScore: 650,
					employmentStatus: 'employed' as const,
					incomeRange: '50k-75k' as const,
					riskProfile: 'medium' as const,
					recommendations: []
				}
			},
			userId: 'user-123'
		}
	}
};

// Story with pre-populated profile data
export const WithProfileData: Story = {
	args: {
		userId: 'user-123',
		data: {
			form: {
				profile: mockUserProfile,
				externalData: mockExternalData
			},
			userId: 'user-123'
		}
	}
};

// Story with loading state
export const Loading: Story = {
	args: {
		userId: 'user-123',
		data: {
			form: {
				profile: {
					firstName: '',
					lastName: '',
					experienceLevel: 'entry' as const
				},
				externalData: {
					creditScore: 0,
					employmentStatus: '' as const,
					incomeRange: '' as const,
					riskProfile: '' as const,
					recommendations: []
				}
			},
			userId: 'user-123'
		}
	}
};

// Story with validation errors
export const WithValidationErrors: Story = {
	args: {
		userId: 'user-123',
		data: {
			form: {
				profile: {
					firstName: 'A', // Too short
					lastName: '', // Required field empty
					experienceLevel: 'entry' as const
				},
				externalData: mockExternalData
			},
			userId: 'user-123'
		}
	}
};

// Story with external data loading
export const ExternalDataLoading: Story = {
	args: {
		userId: 'user-123',
		data: {
			form: {
				profile: mockUserProfile,
				externalData: {
					creditScore: 0,
					employmentStatus: '' as const,
					incomeRange: '' as const,
					riskProfile: '' as const,
					recommendations: []
				}
			},
			userId: 'user-123'
		}
	}
};

// Story with poor credit score
export const PoorCreditScore: Story = {
	args: {
		userId: 'user-123',
		data: {
			form: {
				profile: mockUserProfile,
				externalData: {
					creditScore: 580,
					employmentStatus: 'unemployed' as const,
					incomeRange: '0-25k' as const,
					riskProfile: 'high' as const,
					recommendations: [
						'Consider credit counseling services',
						'Build an emergency fund',
						'Focus on debt reduction strategies'
					]
				}
			},
			userId: 'user-123'
		}
	}
};

// Story with excellent credit score
export const ExcellentCreditScore: Story = {
	args: {
		userId: 'user-123',
		data: {
			form: {
				profile: mockUserProfile,
				externalData: {
					creditScore: 800,
					employmentStatus: 'employed' as const,
					incomeRange: '100k+' as const,
					riskProfile: 'low' as const,
					recommendations: [
						'Consider premium credit card options',
						'Explore investment opportunities',
						'Maintain current financial habits'
					]
				}
			},
			userId: 'user-123'
		}
	}
};
