<script lang="ts">
	import type { Attachment } from 'ai';
	import LoaderIcon from './icons/loader.svelte';

	let {
		attachment,
		uploading = false
	}: {
		attachment: Attachment;
		uploading?: boolean;
	} = $props();

	const { name, url, contentType } = $derived(attachment);
</script>

<div class="flex flex-col gap-2">
	<div
		class="bg-muted relative flex aspect-video h-16 w-20 flex-col items-center justify-center rounded-md"
	>
		{#if contentType && contentType.startsWith('image')}
			<img
				src={url}
				alt={name ?? 'An image attachment'}
				class="size-full rounded-md object-cover"
			/>
		{:else}
			<div></div>
		{/if}

		{#if uploading}
			<div class="absolute animate-spin text-zinc-500">
				<LoaderIcon />
			</div>
		{/if}
	</div>
	<div class="max-w-16 truncate text-xs text-zinc-500">{name}</div>
</div>
