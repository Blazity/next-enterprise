import type { ExtendedMessage } from '@repo/types';
import { nanoid } from 'nanoid';

export interface ChatOptions {
	id?: string;
	initialMessages?: ExtendedMessage[];
	onFinish?: () => Promise<void>;
	onError?: (error: Error) => void;
}

export class ChatClient {
	id: string;
	messages = $state<ExtendedMessage[]>([]);
	input = $state('');
	status = $state<'idle' | 'streaming' | 'submitted'>('idle');
	private onFinish?: () => Promise<void>;
	private onError?: (error: Error) => void;

	constructor(options: ChatOptions) {
		this.id = options.id || nanoid();
		this.messages = options.initialMessages || [];
		this.onFinish = options.onFinish;
		this.onError = options.onError;
	}

	async submit(event?: Event) {
		if (event) {
			event.preventDefault();
		}

		if (!this.input.trim() || this.status !== 'idle') {
			return;
		}

		const userMessage: ExtendedMessage = {
			id: nanoid(),
			role: 'user',
			content: this.input
		};

		this.messages = [...this.messages, userMessage];
		const currentInput = this.input;
		this.input = '';
		this.status = 'submitted';

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: this.id,
					messages: this.messages
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get response');
			}

			this.status = 'streaming';

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let assistantMessage = '';

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value);
					assistantMessage += chunk;

					const lastMessage = this.messages[this.messages.length - 1];
					if (lastMessage?.role === 'assistant') {
						this.messages = [
							...this.messages.slice(0, -1),
							{ ...lastMessage, content: assistantMessage }
						];
					} else {
						this.messages = [
							...this.messages,
							{ id: nanoid(), role: 'assistant', content: assistantMessage }
						];
					}
				}
			}

			this.status = 'idle';

			if (this.onFinish) {
				await this.onFinish();
			}
		} catch (error) {
			console.error('Chat error:', error);
			this.status = 'idle';
			this.input = currentInput;

			if (this.onError && error instanceof Error) {
				this.onError(error);
			}
		}
	}

	stop() {
		this.status = 'idle';
	}

	setInput(value: string) {
		this.input = value;
	}
}
