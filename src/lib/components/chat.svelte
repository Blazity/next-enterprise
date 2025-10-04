<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import ChatHeader from './chat-header.svelte';
	import type { Chat as DbChat, User } from '$db/schema';
	import Messages from './messages.svelte';
	import MultimodalInput from './multimodal-input.svelte';
	import { untrack } from 'svelte';
	import type { ExtendedMessage } from '$types';
	import { ChatClient } from '$lib/hooks/use-chat.svelte';

	let {
		user,
		chat,
		readonly,
		initialMessages
	}: {
		user: User | undefined;
		chat: DbChat | undefined;
		initialMessages: ExtendedMessage[];
		readonly: boolean;
	} = $props();

	const chatHistory = ChatHistory.fromContext();

	const chatClient = $derived(
		new ChatClient({
			id: chat?.id,
			initialMessages: untrack(() => initialMessages),
			onFinish: async () => {
				await chatHistory.refetch();
			},
			onError: (error) => {
				try {
					const jsonError = JSON.parse(error.message);
					console.log(jsonError);
					if (
						typeof jsonError === 'object' &&
						jsonError !== null &&
						'message' in jsonError &&
						typeof jsonError.message === 'string'
					) {
						toast.error(jsonError.message);
					} else {
						toast.error(error.message);
					}
				} catch {
					toast.error(error.message);
				}
			}
		})
	);

	let attachments = $state<Array<{ url: string; name: string; contentType: string }>>([]);
</script>

<div class="bg-background flex h-dvh min-w-0 flex-col">
	<ChatHeader {user} {chat} {readonly} />
	<Messages
		{readonly}
		loading={chatClient.status === 'streaming' || chatClient.status === 'submitted'}
		messages={chatClient.messages}
	/>

	<form class="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
		{#if !readonly}
			<MultimodalInput {attachments} {user} {chatClient} class="flex-1" />
		{/if}
	</form>
</div>

<!-- TODO -->
<!-- <Artifact
	chatId={id}
	{input}
	{setInput}
	{handleSubmit}
	{isLoading}
	{stop}
	{attachments}
	{setAttachments}
	{append}
	{messages}
	{setMessages}
	{reload}
	{votes}
	{readonly}
/> -->
