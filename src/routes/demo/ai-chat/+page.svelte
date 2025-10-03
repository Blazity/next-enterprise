<script lang="ts">
	interface Message {
		role: 'user' | 'assistant';
		content: string;
	}

	let messages = $state<Message[]>([]);
	let input = $state('');
	let isLoading = $state(false);

	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = { role: 'user', content: input };
		messages = [...messages, userMessage];
		const currentInput = input;
		input = '';
		isLoading = true;

		try {
			const response = await fetch('/api/ai/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: [...messages] })
			});

			if (!response.ok) throw new Error('Failed to get response');

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let assistantMessage = '';

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value);
					assistantMessage += chunk;
					messages = [...messages.slice(0, -1), { role: 'assistant', content: assistantMessage }];
				}
			}
		} catch (error) {
			console.error('Chat error:', error);
			messages = [
				...messages.slice(0, -1),
				{ role: 'assistant', content: 'Sorry, there was an error processing your request.' }
			];
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">AI Chat Demo</h1>

	<div class="mb-4 rounded-lg border border-gray-200 bg-white p-4">
		<div class="mb-4 h-96 space-y-4 overflow-y-auto">
			{#each messages as message}
				<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-xs rounded-lg px-4 py-2 {message.role === 'user'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200 text-gray-900'}"
					>
						<p class="text-sm font-semibold">{message.role === 'user' ? 'You' : 'AI'}</p>
						<p class="mt-1">{message.content}</p>
					</div>
				</div>
			{/each}

			{#if isLoading}
				<div class="flex justify-start">
					<div class="max-w-xs rounded-lg bg-gray-200 px-4 py-2 text-gray-900">
						<p class="text-sm font-semibold">AI</p>
						<p class="mt-1">Thinking...</p>
					</div>
				</div>
			{/if}
		</div>

		<form onsubmit={handleSubmit} class="flex gap-2">
			<input
				type="text"
				bind:value={input}
				placeholder="Type your message..."
				class="flex-1 rounded-lg border border-gray-300 px-4 py-2"
				disabled={isLoading}
			/>
			<button
				type="submit"
				disabled={isLoading}
				class="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
			>
				Send
			</button>
		</form>
	</div>

	<div class="mt-4 rounded-lg bg-blue-50 p-4">
		<h2 class="mb-2 font-semibold">Features:</h2>
		<ul class="list-inside list-disc space-y-1 text-sm">
			<li>Powered by AI SDK 5 with OpenRouter</li>
			<li>Streaming responses for real-time interaction</li>
			<li>Message history management</li>
			<li>Clean, responsive UI</li>
		</ul>
	</div>
</div>
