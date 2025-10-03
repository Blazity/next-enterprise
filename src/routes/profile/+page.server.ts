import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	completeUserProfileFormSchema,
	defaultUserProfileFormValues,
	defaultExternalUserData
} from '$schemas/user-profile';

// Load function for the profile page
export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		throw new Error('Authentication required');
	}

	// Initialize form with default values
	const form = await superValidate(completeUserProfileFormSchema, {
		defaults: {
			profile: defaultUserProfileFormValues,
			externalData: defaultExternalUserData
		}
	});

	return {
		form,
		userId: locals.user.id
	};
};

// Actions for form submission
export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Check authentication
		if (!locals.user) {
			throw new Error('Authentication required');
		}

		// Parse and validate form data
		const formData = await request.formData();
		const form = await superValidate(formData, zod(completeUserProfileFormSchema));

		if (!form.valid) {
			return {
				form,
				userId: locals.user.id
			};
		}

		try {
			// The form validation and processing is handled by the component
			// In a real application, you might want to add additional server-side processing here

			return {
				form,
				userId: locals.user.id,
				success: true
			};
		} catch (error) {
			console.error('Profile update error:', error);
			return {
				form,
				userId: locals.user.id,
				error: 'Failed to update profile'
			};
		}
	}
};
