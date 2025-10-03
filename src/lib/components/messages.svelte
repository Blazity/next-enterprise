<script lang="ts">
	import ThinkingMessage from './messages/thinking-message.svelte';
	import Overview from './messages/overview.svelte';
	import { onMount } from 'svelte';
	import PreviewMessage from './messages/preview-message.svelte';
	import type { UIMessage } from '@ai-sdk/svelte';
	import { getLock } from '$lib/hooks/lock';

	let containerRef = $state<HTMLDivElement | null>(null);
	let endRef = $state<HTMLDivElement | null>(null);

	let {
		readonly,
		loading,
		messages
	}: {
		readonly: boolean;
		loading: boolean;
		messages: UIMessage[];
	} = $props();

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	const scrollLock = getLock('messages-scroll');

	$effect(() => {
		if (!(containerRef && endRef)) return;

		const observer = new MutationObserver(() => {
			if (!endRef || scrollLock.locked) return;
			endRef.scrollIntoView({ behavior: 'instant', block: 'end' });
		});

		observer.observe(containerRef, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true
		});

		return () => observer.disconnect();
	});
</script>

<div bind:this={containerRef} class="flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4">
	{#if mounted && messages.length === 0}
		<Overview />
	{/if}

	{#each messages as message (message.id)}
		<PreviewMessage {message} {readonly} {loading} />
	{/each}

	{#if loading && messages.length > 0 && messages[messages.length - 1].role === 'user'}
		<ThinkingMessage />
	{/if}

	<div bind:this={endRef} class="min-h-[24px] min-w-[24px] shrink-0"></div>
</div>
