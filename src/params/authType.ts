import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is 'signup' | 'signin' => {
	return param === 'signup' || param === 'signin';
}) satisfies ParamMatcher;
