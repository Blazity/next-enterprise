<script module lang="ts">
	export type VisibilityType = 'private' | 'public';
</script>

<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import { Button } from './ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from './ui/dropdown-menu';
	import ChevronDownIcon from './icons/chevron-down.svelte';
	import LockIcon from './icons/lock.svelte';
	import GlobeIcon from './icons/globe.svelte';
	import CheckCircleFillIcon from './icons/check-circle-fill.svelte';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import type { Chat } from '$db/schema';
	import type { ClassValue } from 'svelte/elements';

	let { chat, class: c }: { chat: Chat; class?: ClassValue } = $props();

	let open = $state(false);

	const visibilities = [
		{
			id: 'private',
			label: 'Private',
			description: 'Only you can access this chat',
			Icon: LockIcon
		},
		{
			id: 'public',
			label: 'Public',
			description: 'Anyone with the link can access this chat',
			Icon: GlobeIcon
		}
	] as const;

	const chatHistory = ChatHistory.fromContext();
	const chatFromHistory = $derived(chatHistory.getChatDetails(chat.id));
	const { label, Icon } = $derived(
		(chatFromHistory && visibilities.find((v) => v.id === chatFromHistory.visibility)) ??
			visibilities[0]
	);
</script>

<DropdownMenu {open} onOpenChange={(val) => (open = val)}>
	<DropdownMenuTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class={cn(
					'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hidden w-fit md:flex md:h-[34px] md:px-2',
					c
				)}
			>
				<Icon />
				{label}
				<ChevronDownIcon />
			</Button>
		{/snippet}
	</DropdownMenuTrigger>

	<DropdownMenuContent align="start" class="min-w-[300px]">
		{#each visibilities as visibility (visibility.id)}
			<DropdownMenuItem
				onSelect={() => {
					chatHistory.updateVisibility(chat.id, visibility.id);
					open = false;
				}}
				class="group/item flex flex-row items-center justify-between gap-4"
				data-active={visibility.id === chatFromHistory?.visibility}
			>
				<div class="flex flex-col items-start gap-1">
					{visibility.label}
					<div class="text-muted-foreground text-xs">
						{visibility.description}
					</div>
				</div>
				<div
					class="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100"
				>
					<CheckCircleFillIcon />
				</div>
			</DropdownMenuItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
