import { describe, it, expect, beforeEach } from 'vitest';
import { createTestCache } from './index';

describe('Cache Service', () => {
	let cache: ReturnType<typeof createTestCache>;

	beforeEach(() => {
		cache = createTestCache();
		cache.flush();
	});

	it('should set and get a value', () => {
		cache.set('test-key', 'test-value');
		const value = cache.get('test-key');
		expect(value).toBe('test-value');
	});

	it('should return undefined for non-existent key', () => {
		const value = cache.get('non-existent');
		expect(value).toBeUndefined();
	});

	it('should delete a key', () => {
		cache.set('test-key', 'test-value');
		const deleted = cache.del('test-key');
		expect(deleted).toBe(1);
		expect(cache.get('test-key')).toBeUndefined();
	});

	it('should check if key exists', () => {
		cache.set('test-key', 'test-value');
		expect(cache.has('test-key')).toBe(true);
		expect(cache.has('non-existent')).toBe(false);
	});

	it('should flush all keys', () => {
		cache.set('key1', 'value1');
		cache.set('key2', 'value2');
		cache.flush();
		expect(cache.get('key1')).toBeUndefined();
		expect(cache.get('key2')).toBeUndefined();
	});

	it('should list all keys', () => {
		cache.set('key1', 'value1');
		cache.set('key2', 'value2');
		const keys = cache.keys();
		expect(keys).toContain('key1');
		expect(keys).toContain('key2');
	});

	it('should handle complex objects', () => {
		const obj = { name: 'test', count: 42, nested: { value: true } };
		cache.set('object-key', obj);
		const retrieved = cache.get<typeof obj>('object-key');
		expect(retrieved).toEqual(obj);
	});
});
