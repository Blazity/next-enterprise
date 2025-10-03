<script lang="ts">
	import { Button } from './ui/button';
	import {
		useSidebar,
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarHeader,
		SidebarMenu
	} from './ui/sidebar';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
	import { goto } from '$app/navigation';
	import PlusIcon from './icons/plus.svelte';
	import type { User } from '$db/schema';
	import SidebarUserNav from './sidebar-user-nav.svelte';
	import { SidebarHistory } from './sidebar-history';

	let { user }: { user?: User } = $props();

	const context = useSidebar();
</script>

<Sidebar class="group-data-[side=left]:border-r-0">
	<SidebarHeader>
		<SidebarMenu>
			<div class="flex h-10 flex-row items-center justify-between md:h-[34px]">
				<a
					href="/"
					onclick={() => {
						context.setOpenMobile(false);
					}}
					class="flex flex-row items-center gap-3"
				>
					<span class="hover:bg-muted cursor-pointer rounded-md px-2 text-lg font-semibold">
						Chatbot
					</span>
				</a>
				<Tooltip>
					<TooltipTrigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								type="button"
								class="h-fit p-2"
								onclick={() => {
									context.setOpenMobile(false);
									goto('/', { invalidateAll: true });
								}}
							>
								<PlusIcon />
							</Button>
						{/snippet}
					</TooltipTrigger>
					<TooltipContent align="end">New Chat</TooltipContent>
				</Tooltip>
			</div>
		</SidebarMenu>
	</SidebarHeader>
	<SidebarContent>
		<SidebarHistory {user} />
	</SidebarContent>
	<SidebarFooter>
		{#if user}
			<SidebarUserNav {user} />
		{/if}
	</SidebarFooter>
</Sidebar>
