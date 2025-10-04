<script lang="ts">
	import { useSidebar } from '@repo/ui/components/ui/sidebar';
	import SidebarToggle from './sidebar-toggle.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/ui/tooltip';
	import { Button } from '@repo/ui/components/ui/button';
	import PlusIcon from './icons/plus.svelte';
	import { goto } from '$app/navigation';
	import ModelSelector from './model-selector.svelte';
	import type { Chat, User } from '@repo/database/schema';
	import VisibilitySelector from './visibility-selector.svelte';
	import VercelIcon from './icons/vercel.svelte';

	let {
		user,
		chat,
		readonly
	}: {
		user: User | undefined;
		chat: Chat | undefined;
		readonly: boolean;
	} = $props();

	const sidebar = useSidebar();
</script>

<header class="bg-background sticky top-0 flex items-center gap-2 p-2">
	<SidebarToggle />

	{#if !sidebar.open || (innerWidth.current ?? 768) < 768}
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						class="order-2 ml-auto px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
						onclick={() => {
							goto('/', {
								invalidateAll: true
							});
						}}
					>
						<PlusIcon />
						<span class="md:sr-only">New Chat</span>
					</Button>
				{/snippet}
			</TooltipTrigger>
			<TooltipContent>New Chat</TooltipContent>
		</Tooltip>
	{/if}

	{#if !readonly}
		<ModelSelector class="order-1 md:order-2" />
	{/if}

	{#if !readonly && chat}
		<VisibilitySelector {chat} class="order-1 md:order-3" />
	{/if}

	{#if !user}
		<Button href="/signin" class="order-5 px-2 py-1.5 md:h-[34px]">Sign In</Button>
	{/if}

	<Button
		class="order-4 hidden h-fit bg-zinc-900 px-2 py-1.5 text-zinc-50 hover:bg-zinc-800 md:ml-auto md:flex md:h-[34px] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
		href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot-svelte&project-name=my-awesome-chatbot&repository-name=my-awesome-chatbot&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel&demo-url=https%3A%2F%2Fsvelte-chat.vercel.ai&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22grok%22%2C%22integrationSlug%22%3A%22xai%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22api-key%22%2C%22integrationSlug%22%3A%22groq%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D"
		target="_blank"
	>
		<VercelIcon size={16} />
		Deploy with Vercel
	</Button>
</header>
