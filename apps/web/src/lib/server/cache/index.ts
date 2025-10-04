import NodeCache from 'node-cache';

interface CacheOptions {
	stdTTL?: number;
	checkperiod?: number;
}

class CacheService {
	private cache: NodeCache;

	constructor(options: CacheOptions = {}) {
		this.cache = new NodeCache({
			stdTTL: options.stdTTL || 600,
			checkperiod: options.checkperiod || 120
		});
	}

	get<T>(key: string): T | undefined {
		return this.cache.get<T>(key);
	}

	set<T>(key: string, value: T, ttl?: number): boolean {
		return this.cache.set(key, value, ttl || 0);
	}

	del(key: string | string[]): number {
		return this.cache.del(key);
	}

	has(key: string): boolean {
		return this.cache.has(key);
	}

	flush(): void {
		this.cache.flushAll();
	}

	keys(): string[] {
		return this.cache.keys();
	}

	getStats(): NodeCache.Stats {
		return this.cache.getStats();
	}
}

export const cache = new CacheService({ stdTTL: 600, checkperiod: 120 });

export function createTestCache(): CacheService {
	return new CacheService({ stdTTL: 60, checkperiod: 10 });
}
