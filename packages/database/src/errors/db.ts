import { TaggedError } from './tagged-error';

export class DbEntityNotFoundError extends TaggedError<'DbEntityNotFoundError'> {
	readonly id: string;
	readonly entityType: string;

	constructor(id: string, entityType: string, options: ErrorOptions = {}) {
		super(`${entityType} not found: ${id}`, options);
		this.id = id;
		this.entityType = entityType;
	}
}

export class DbNotFoundError extends TaggedError<'DbNotFoundError'> {
	readonly identifier: string;
	readonly entityName: string;

	constructor({
		identifier,
		entityName,
		...options
	}: { identifier: string; entityName: string } & ErrorOptions) {
		super(`${entityName} not found: ${identifier}`, options);
		this.identifier = identifier;
		this.entityName = entityName;
	}
}

export class DbInternalError extends TaggedError<'DbInternalError'> {
	constructor(options: ErrorOptions = {}) {
		super('Internal error', options);
	}
}

export type DbError = DbEntityNotFoundError | DbNotFoundError | DbInternalError;
