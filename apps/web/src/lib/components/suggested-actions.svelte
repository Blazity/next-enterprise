<script lang="ts">
	import type { ChatClient } from '$lib/hooks/use-chat.svelte';
	import { Button } from '@repo/ui/components/ui/button';
	import { fly } from 'svelte/transition';
	import { replaceState } from '$app/navigation';
	import type { User } from '@repo/database/schema';

	let { user, chatClient }: { user: User | undefined; chatClient: ChatClient } = $props();

	const suggestedActions = [
		{
			title: 'What are the advantages',
			label: 'of using SvelteKit?',
			action: 'What are the advantages of using SvelteKit?'
		},
		{
			title: 'Write code to',
			label: `demonstrate djikstra's algorithm`,
			action: `Write code to demonstrate djikstra's algorithm`
		},
		{
			title: 'Help me write an essay',
			label: `about silicon valley`,
			action: `Help me write an essay about silicon valley`
		},
		{
			title: 'What is the weather like',
			label: 'in San Francisco?',
			action: 'What is the weather like in San Francisco?'
		}
	];
</script>

<div class="grid w-full gap-2 sm:grid-cols-2">
	{#each suggestedActions as suggestedAction, i (suggestedAction.title)}
		<div
			in:fly|global={{ opacity: 0, y: 20, delay: 50 * i, duration: 400 }}
			class={i > 1 ? 'hidden sm:block' : 'block'}
		>
			<Button
				variant="ghost"
				onclick={async () => {
					if (user) {
						replaceState(`/chat/${chatClient.id}`, {});
					}
					chatClient.setInput(suggestedAction.action);
					await chatClient.submit();
				}}
				class="h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
			>
				<span class="font-medium">{suggestedAction.title}</span>
				<span class="text-muted-foreground">
					{suggestedAction.label}
				</span>
			</Button>
		</div>
	{/each}
</div>
