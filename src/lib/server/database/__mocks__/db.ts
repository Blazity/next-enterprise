import { vi } from 'vitest';

export const db = {
	select: vi.fn().mockReturnThis(),
	insert: vi.fn().mockReturnThis(),
	update: vi.fn().mockReturnThis(),
	delete: vi.fn().mockReturnThis(),
	from: vi.fn().mockReturnThis(),
	where: vi.fn().mockReturnThis(),
	set: vi.fn().mockReturnThis(),
	values: vi.fn().mockReturnThis(),
	returning: vi.fn().mockResolvedValue([]),
	execute: vi.fn().mockResolvedValue([]),
	then: vi.fn().mockResolvedValue([]),
	orderBy: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	offset: vi.fn().mockReturnThis(),
	leftJoin: vi.fn().mockReturnThis(),
	innerJoin: vi.fn().mockReturnThis(),
	rightJoin: vi.fn().mockReturnThis(),
	transaction: vi.fn().mockImplementation(async (callback) => {
		return callback(db);
	})
};

export const createTestDb = vi.fn().mockReturnValue(db);
