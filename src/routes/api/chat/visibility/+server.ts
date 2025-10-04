import type { VisibilityType } from '$lib/components/visibility-selector.svelte';
import { updateChatVisiblityById } from '$db/queries';

export async function POST({ request }) {
	const { chatId, visibility }: { chatId: string; visibility: VisibilityType } =
		await request.json();

	try {
		await updateChatVisiblityById({ chatId, visibility });
		return new Response('Chat visibility updated', { status: 200 });
	} catch {
		return new Response('An error occurred while processing your request', { status: 500 });
	}
}
