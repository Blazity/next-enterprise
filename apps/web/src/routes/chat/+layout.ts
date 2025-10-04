import type { Chat } from '@repo/database/schema';

export async function load({ data, fetch }) {
	const { user } = data;
	let chats = Promise.resolve<Chat[]>([]);
	if (user) {
		chats = fetch('/api/history').then((res) => res.json());
	}
	return {
		chats,
		...data
	};
}
