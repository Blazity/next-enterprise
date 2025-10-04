export abstract class TaggedError<const Tag extends string> extends Error {
	readonly _tag: Tag;

	constructor(message: string, options: ErrorOptions = {}) {
		super(message, options);
		this.name = this.constructor.name;
		this._tag = this.name as Tag;

		if (options.cause && options.cause instanceof Error) {
			this.stack = `${this.stack}\nCaused by: ${options.cause.stack}`;
		}
	}
}
