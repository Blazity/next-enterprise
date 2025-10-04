import { superValidate } from 'sveltekit-superforms/server';
import { valibot } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	completeUserProfileFormSchema,
	defaultUserProfileFormValues,
	defaultExternalUserData
} from '@repo/schemas/user-profile';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw new Error('Authentication required');
	}

	const form = await superValidate(valibot(completeUserProfileFormSchema), {
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

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw new Error('Authentication required');
		}

		const formData = await request.formData();
		const form = await superValidate(formData, valibot(completeUserProfileFormSchema));

		if (!form.valid) {
			return {
				form,
				userId: locals.user.id
			};
		}

		try {
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
