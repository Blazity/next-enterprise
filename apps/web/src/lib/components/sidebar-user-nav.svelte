<script lang="ts">
	import type { User } from '@repo/database/schema';
	import { cn } from '@repo/ui/utils';
	import ChevronUp from './icons/chevron-up.svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '@repo/ui/components/ui/dropdown-menu';
	import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@repo/ui/components/ui/sidebar';
	import { mode, toggleMode } from 'mode-watcher';

	let { user }: { user: User } = $props();
</script>

<SidebarMenu>
	<SidebarMenuItem>
		<DropdownMenu>
			<DropdownMenuTrigger>
				{#snippet child({ props })}
					<SidebarMenuButton
						{...props}
						class="bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10"
					>
						<img
							src={`https://avatar.vercel.sh/${user.email}`}
							alt={user.email ?? 'User Avatar'}
							width={24}
							height={24}
							class="rounded-full"
						/>
						<span class="truncate">{user?.email}</span>
						<ChevronUp class="ml-auto" />
					</SidebarMenuButton>
				{/snippet}
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top" class="w-[--bits-floating-anchor-width]">
				<DropdownMenuItem class="cursor-pointer" onSelect={toggleMode}>
					Toggle {mode.current === 'light' ? 'dark' : 'light'} mode
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					{#snippet child({ props })}
						<a
							{...props}
							href="/signout"
							class={cn('w-full cursor-pointer', props.class as string)}
							data-sveltekit-preload-data="false"
							data-sveltekit-reload>Sign out</a
						>
					{/snippet}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</SidebarMenuItem>
</SidebarMenu>
