import { TaggedError } from '$lib/errors/tagged-error';

export class AIInternalError extends TaggedError<'AIInternalError'> {
	constructor(options: ErrorOptions = {}) {
		super('Internal error', options);
	}
}

export type AIError = AIInternalError;
