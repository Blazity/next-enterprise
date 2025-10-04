import { err, ok, type Result } from 'neverthrow';
import { DbNotFoundError, type DbError } from './errors/db';

export function unwrapSingleQueryResult<T>(
	result: T[],
	identifier: string,
	entityName: string
): Result<T, DbError> {
	if (result.length === 0) {
		return err(new DbNotFoundError({ identifier, entityName }));
	}

	return ok(result[0]);
}
