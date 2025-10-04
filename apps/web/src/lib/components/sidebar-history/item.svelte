<script lang="ts">
	import type { Chat } from '@repo/database/schema';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSub,
		DropdownMenuSubContent,
		DropdownMenuSubTrigger,
		DropdownMenuTrigger
	} from '@repo/ui/components/ui/dropdown-menu';
	import {
		useSidebar,
		SidebarMenuAction,
		SidebarMenuButton,
		SidebarMenuItem
	} from '@repo/ui/components/ui/sidebar';
	import TrashIcon from '../icons/trash.svelte';
	import GlobeIcon from '../icons/globe.svelte';
	import CheckCircleFillIcon from '../icons/check-circle-fill.svelte';
	import LockIcon from '../icons/lock.svelte';
	import ShareIcon from '../icons/share.svelte';
	import MoreHorizontalIcon from '../icons/more-horizontal.svelte';
	import { goto } from '$app/navigation';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';

	let {
		chat,
		active,
		ondelete
	}: {
		chat: Chat;
		active: boolean;
		ondelete: (chatId: string) => void;
	} = $props();

	const context = useSidebar();

	const chatHistory = ChatHistory.fromContext();
	const chatFromHistory = $derived(chatHistory.getChatDetails(chat.id));
</script>

<SidebarMenuItem>
	<SidebarMenuButton isActive={active}>
		{#snippet child({ props })}
			<button
				{...props}
				onclick={() => {
					goto(`/chat/${chat.id}`);
					context.setOpenMobile(false);
				}}
			>
				<span>{chat.title}</span>
			</button>
		{/snippet}
	</SidebarMenuButton>

	<DropdownMenu>
		<DropdownMenuTrigger>
			{#snippet child({ props })}
				<SidebarMenuAction
					{...props}
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
					showOnHover={!active}
				>
					<MoreHorizontalIcon />
					<span class="sr-only">More</span>
				</SidebarMenuAction>
			{/snippet}
		</DropdownMenuTrigger>

		<DropdownMenuContent side="bottom" align="end">
			<DropdownMenuSub>
				<DropdownMenuSubTrigger class="cursor-pointer">
					<ShareIcon />
					<span>Share</span>
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent align="start">
					<DropdownMenuItem
						class="cursor-pointer flex-row justify-between"
						onclick={() => {
							chatHistory.updateVisibility(chat.id, 'private');
						}}
					>
						<div class="flex flex-row items-center gap-2">
							<LockIcon size={12} />
							<span>Private</span>
						</div>
						{#if chatFromHistory?.visibility === 'private'}
							<CheckCircleFillIcon />
						{/if}
					</DropdownMenuItem>
					<DropdownMenuItem
						class="cursor-pointer flex-row justify-between"
						onclick={() => {
							chatHistory.updateVisibility(chat.id, 'public');
						}}
					>
						<div class="flex flex-row items-center gap-2">
							<GlobeIcon />
							<span>Public</span>
						</div>
						{#if chatFromHistory?.visibility === 'public'}
							<CheckCircleFillIcon />
						{/if}
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuSub>

			<DropdownMenuItem
				class="text-destructive focus:bg-destructive/15 focus:text-destructive cursor-pointer dark:text-red-500"
				onclick={() => ondelete(chat.id)}
			>
				<TrashIcon />
				<span>Delete</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</SidebarMenuItem>
