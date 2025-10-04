import { json } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const key = url.searchParams.get('key');

	if (!key) {
		return json({ error: 'Key parameter required' }, { status: 400 });
	}

	const value = cache.get(key);

	if (value === undefined) {
		return json({ error: 'Key not found' }, { status: 404 });
	}

	return json({ success: true, key, value });
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { key, value, ttl } = await request.json();

		if (!key || value === undefined) {
			return json({ error: 'Key and value required' }, { status: 400 });
		}

		const success = cache.set(key, value, ttl);

		return json({ success, key });
	} catch (error) {
		console.error('Cache Set Error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to set cache' },
			{ status: 500 }
		);
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	const key = url.searchParams.get('key');

	if (!key) {
		return json({ error: 'Key parameter required' }, { status: 400 });
	}

	const deleted = cache.del(key);

	return json({ success: deleted > 0, deleted });
};
