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
	experienceLevel: 'mid',
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
			proficiency: 'native'
		},
		{
			language: 'Spanish',
			proficiency: 'intermediate'
		}
	],
	timezone: 'America/Los_Angeles',
	availability: 'available'
};

const mockExternalData = {
	creditScore: 720,
	employmentStatus: 'employed',
	incomeRange: '75k-100k',
	riskProfile: 'low',
	recommendations: [
		'Consider increasing your emergency fund',
		'Look into retirement investment options',
		'Diversify your investment portfolio'
	]
};

export default {
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

const Template = (args) => ({
	Component: ComplexUserProfileForm,
	props: args,
	on: {
		submit: (event) => {
			console.log('Form submitted:', event.detail);
		}
	}
});

// Default story with empty form
export const EmptyForm = Template.bind({});
EmptyForm.args = {
	userId: 'user-123',
	data: {
		form: {
			profile: {
				firstName: '',
				lastName: '',
				experienceLevel: 'entry',
				skills: [],
				education: [],
				certifications: [],
				languages: []
			},
			externalData: {
				creditScore: 650,
				employmentStatus: 'employed',
				incomeRange: '50k-75k',
				riskProfile: 'medium',
				recommendations: []
			}
		},
		userId: 'user-123'
	}
};

// Story with pre-populated profile data
export const WithProfileData = Template.bind({});
WithProfileData.args = {
	userId: 'user-123',
	data: {
		form: {
			profile: mockUserProfile,
			externalData: mockExternalData
		},
		userId: 'user-123'
	}
};

// Story with loading state
export const Loading = Template.bind({});
Loading.args = {
	userId: 'user-123',
	data: {
		form: {
			profile: {
				firstName: '',
				lastName: '',
				experienceLevel: 'entry'
			},
			externalData: {
				creditScore: 0,
				employmentStatus: '',
				incomeRange: '',
				riskProfile: '',
				recommendations: []
			}
		},
		userId: 'user-123'
	}
};

// Story with validation errors
export const WithValidationErrors = Template.bind({});
WithValidationErrors.args = {
	userId: 'user-123',
	data: {
		form: {
			profile: {
				firstName: 'A', // Too short
				lastName: '', // Required field empty
				experienceLevel: 'entry'
			},
			externalData: mockExternalData
		},
		userId: 'user-123'
	}
};

// Story with external data loading
export const ExternalDataLoading = Template.bind({});
ExternalDataLoading.args = {
	userId: 'user-123',
	data: {
		form: {
			profile: mockUserProfile,
			externalData: {
				creditScore: 0,
				employmentStatus: '',
				incomeRange: '',
				riskProfile: '',
				recommendations: []
			}
		},
		userId: 'user-123'
	}
};

// Story with poor credit score
export const PoorCreditScore = Template.bind({});
PoorCreditScore.args = {
	userId: 'user-123',
	data: {
		form: {
			profile: mockUserProfile,
			externalData: {
				creditScore: 580,
				employmentStatus: 'unemployed',
				incomeRange: '0-25k',
				riskProfile: 'high',
				recommendations: [
					'Consider credit counseling services',
					'Build an emergency fund',
					'Focus on debt reduction strategies'
				]
			}
		},
		userId: 'user-123'
	}
};

// Story with excellent credit score
export const ExcellentCreditScore = Template.bind({});
ExcellentCreditScore.args = {
	userId: 'user-123',
	data: {
		form: {
			profile: mockUserProfile,
			externalData: {
				creditScore: 800,
				employmentStatus: 'employed',
				incomeRange: '100k+',
				riskProfile: 'low',
				recommendations: [
					'Consider premium credit card options',
					'Explore investment opportunities',
					'Maintain current financial habits'
				]
			}
		},
		userId: 'user-123'
	}
};
