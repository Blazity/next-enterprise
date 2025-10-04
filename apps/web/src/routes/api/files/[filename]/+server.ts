import { error } from '@sveltejs/kit';
import { storage } from '$lib/server/storage';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params;

	if (!filename) {
		error(400, 'Filename required');
	}

	try {
		const buffer = await storage.download(filename, 'chat-uploads');
		const metadata = await storage.getMetadata(filename, 'chat-uploads');

		return new Response(new Uint8Array(buffer), {
			headers: {
				'Content-Type': metadata?.mimeType || 'application/octet-stream',
				'Content-Length': buffer.length.toString()
			}
		});
	} catch (e) {
		console.error('File download error:', e);
		error(404, 'File not found');
	}
};
