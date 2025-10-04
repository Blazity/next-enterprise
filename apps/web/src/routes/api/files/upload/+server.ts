import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import { storage } from '$lib/server/storage';

const FileSchema = v.object({
	file: v.pipe(
		v.instance(Blob),
		v.check((file) => file.size <= 5 * 1024 * 1024, 'File size should be less than 5MB'),
		v.check(
			(file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
			'File type should be JPEG, PNG, GIF, or WebP'
		)
	)
});

export async function POST({ request, locals: { user } }) {
	if (!user) {
		error(401, 'Unauthorized');
	}

	if (request.body === null) {
		error(400, 'Empty file received');
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return error(400, 'No file uploaded');
		}

		const validatedFile = v.safeParse(FileSchema, { file });

		if (!validatedFile.success) {
			const errorMessage = validatedFile.issues.map((issue) => issue.message).join(', ');

			return error(400, errorMessage);
		}

		try {
			const metadata = await storage.upload(file, 'chat-uploads');

			return json({
				url: `/api/files/${metadata.name}`,
				pathname: metadata.name,
				contentType: metadata.mimeType,
				size: metadata.size,
				uploadedAt: metadata.uploadedAt
			});
		} catch (e) {
			console.error(e);
			return error(500, 'Upload failed');
		}
	} catch (e) {
		console.error(e);
		return error(500, 'Failed to process request');
	}
}
