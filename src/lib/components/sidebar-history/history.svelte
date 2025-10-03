<script lang="ts">
	import ChatItem from './item.svelte';
	import type { Chat, User } from '$db/schema';
	import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '../ui/sidebar';
	import { page } from '$app/state';
	import { subWeeks, subMonths, isToday, isYesterday } from 'date-fns';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '../ui/alert-dialog';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Skeleton } from '../ui/skeleton';

	let { user }: { user?: User } = $props();
	const chatHistory = ChatHistory.fromContext();
	let alertDialogOpen = $state(false);
	const groupedChats = $derived(groupChatsByDate(chatHistory.chats));
	let chatIdToDelete = $state<string | undefined>(undefined);

	type GroupedChats = {
		today: Chat[];
		yesterday: Chat[];
		lastWeek: Chat[];
		lastMonth: Chat[];
		older: Chat[];
	};
	const chatGroupTitles = {
		today: 'Today',
		yesterday: 'Yesterday',
		lastWeek: 'Last 7 days',
		lastMonth: 'Last 30 days',
		older: 'Older'
	} as const;

	function groupChatsByDate(chats: Chat[]): GroupedChats {
		const now = new Date();
		const oneWeekAgo = subWeeks(now, 1);
		const oneMonthAgo = subMonths(now, 1);

		return chats.reduce(
			(groups, chat) => {
				const chatDate = new Date(chat.createdAt);

				if (isToday(chatDate)) {
					groups.today.push(chat);
				} else if (isYesterday(chatDate)) {
					groups.yesterday.push(chat);
				} else if (chatDate > oneWeekAgo) {
					groups.lastWeek.push(chat);
				} else if (chatDate > oneMonthAgo) {
					groups.lastMonth.push(chat);
				} else {
					groups.older.push(chat);
				}

				return groups;
			},
			{
				today: [],
				yesterday: [],
				lastWeek: [],
				lastMonth: [],
				older: []
			} as GroupedChats
		);
	}

	async function handleDeleteChat() {
		const deletePromise = (async () => {
			const res = await fetch('/api/chat', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: chatIdToDelete })
			});
			if (!res.ok) {
				throw new Error();
			}
		})();

		toast.promise(deletePromise, {
			loading: 'Deleting chat...',
			success: () => {
				chatHistory.chats = chatHistory.chats.filter((chat) => chat.id !== chatIdToDelete);
				chatHistory.refetch();
				return 'Chat deleted successfully';
			},
			error: 'Failed to delete chat'
		});

		alertDialogOpen = false;

		if (chatIdToDelete === page.params.chatId) {
			await goto('/');
		}
	}
</script>

{#if !user}
	<SidebarGroup>
		<SidebarGroupContent>
			<div
				class="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500"
			>
				Login to save and revisit previous chats!
			</div>
		</SidebarGroupContent>
	</SidebarGroup>
{:else if chatHistory.loading}
	<SidebarGroup>
		<div class="text-sidebar-foreground/50 px-2 py-1 text-xs">Today</div>
		<SidebarGroupContent>
			<div class="flex flex-col">
				{#each [44, 32, 28, 64, 52] as width (width)}
					<div class="flex h-8 items-center gap-2 rounded-md px-2">
						<Skeleton
							class="bg-sidebar-accent-foreground/10 h-4 max-w-[--skeleton-width] flex-1"
							style="--skeleton-width: {width}%"
						/>
					</div>
				{/each}
			</div>
		</SidebarGroupContent>
	</SidebarGroup>
{:else if chatHistory.chats.length === 0}
	<SidebarGroup>
		<SidebarGroupContent>
			<div
				class="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500"
			>
				Your conversations will appear here once you start chatting!
			</div>
		</SidebarGroupContent>
	</SidebarGroup>
{:else}
	<SidebarGroup>
		<SidebarGroupContent>
			<SidebarMenu>
				{#each Object.entries(groupedChats) as [group, chats] (group)}
					{#if chats.length > 0}
						<div class="text-sidebar-foreground/50 px-2 py-1 text-xs">
							{chatGroupTitles[group as keyof typeof chatGroupTitles]}
						</div>
						{#each chats as chat (chat.id)}
							<ChatItem
								{chat}
								active={chat.id === page.params.chatId}
								ondelete={(chatId) => {
									chatIdToDelete = chatId;
									alertDialogOpen = true;
								}}
							/>
						{/each}
					{/if}
				{/each}
			</SidebarMenu>
		</SidebarGroupContent>
	</SidebarGroup>
	<AlertDialog bind:open={alertDialogOpen}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete your chat and remove it from
					our servers.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction onclick={handleDeleteChat}>Continue</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
{/if}
