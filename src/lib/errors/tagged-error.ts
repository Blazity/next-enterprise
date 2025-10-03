/**
 * An abstract base class for creating tagged error types.
 *
 * This class extends the built-in Error class and adds a tagged union
 * pattern, allowing each error to have a unique tag type. The tag helps in
 * identifying and categorizing different types of errors
 * for structured error handling.
 *
 * @template Tag - The type of the tag used for identifying the error.
 * @abstract
 * @extends {Error}
 */
export abstract class TaggedError<const Tag extends string> extends Error {
	readonly _tag: Tag;

	/**
	 * Creates a new TaggedError instance.
	 *
	 * @param message - The error message.
	 * @param options - Additional options for the error.
	 */
	constructor(message: string, options: ErrorOptions = {}) {
		super(message, options);
		this.name = this.constructor.name;
		this._tag = this.name as Tag;

		if (options.cause && options.cause instanceof Error) {
			this.stack = `${this.stack}\nCaused by: ${options.cause.stack}`;
		}
	}
}
