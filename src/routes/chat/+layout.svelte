<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte.js';

	let { data, children } = $props();

	const chatHistory = new ChatHistory(data.chats);
	chatHistory.setContext();
	data.selectedChatModel.setContext();
</script>

<SidebarProvider open={!data.sidebarCollapsed}>
	<AppSidebar user={data.user} />
	<SidebarInset>{@render children?.()}</SidebarInset>
</SidebarProvider>
