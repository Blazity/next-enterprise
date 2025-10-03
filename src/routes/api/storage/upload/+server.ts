import { json } from '@sveltejs/kit';
import { storage } from '$lib/server/storage';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		const metadata = await storage.upload(file);

		return json({
			success: true,
			file: metadata
		});
	} catch (error) {
		console.error('Upload Error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Upload failed' },
			{ status: 500 }
		);
	}
};

export const GET: RequestHandler = async () => {
	try {
		const files = await storage.list();

		return json({
			success: true,
			files
		});
	} catch (error) {
		console.error('List Files Error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to list files' },
			{ status: 500 }
		);
	}
};
