import type { VisibilityType } from '$lib/components/visibility-selector.svelte';
import type { Chat } from '@repo/database/schema';
import { getContext, setContext } from 'svelte';
import { toast } from 'svelte-sonner';

const contextKey = Symbol('ChatHistory');

export class ChatHistory {
	#loading = $state(false);
	#revalidating = $state(false);
	chats = $state<Chat[]>([]);

	get loading() {
		return this.#loading;
	}

	get revalidating() {
		return this.#revalidating;
	}

	constructor(chatsPromise: Promise<Chat[]>) {
		this.#loading = true;
		this.#revalidating = true;
		chatsPromise
			.then((chats) => (this.chats = chats))
			.finally(() => {
				this.#loading = false;
				this.#revalidating = false;
			});
	}

	getChatDetails = (chatId: string) => {
		return this.chats.find((c) => c.id === chatId);
	};

	updateVisibility = async (chatId: string, visibility: VisibilityType) => {
		const chat = this.chats.find((c) => c.id === chatId);
		if (chat) {
			chat.visibility = visibility;
		}
		const res = await fetch('/api/chat/visibility', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ chatId, visibility })
		});
		if (!res.ok) {
			toast.error('Failed to update chat visibility');

			await this.refetch();
		}
	};

	setContext() {
		setContext(contextKey, this);
	}

	async refetch() {
		this.#revalidating = true;
		try {
			const res = await fetch('/api/history');
			if (res.ok) {
				this.chats = await res.json();
			}
		} finally {
			this.#revalidating = false;
		}
	}

	static fromContext(): ChatHistory {
		return getContext(contextKey);
	}
}
