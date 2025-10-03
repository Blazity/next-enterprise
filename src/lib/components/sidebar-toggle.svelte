<script>
	import SidebarLeftIcon from './icons/sidebar-left.svelte';
	import { Button } from './ui/button';
	import { useSidebar } from './ui/sidebar';
	import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

	const sidebar = useSidebar();
</script>

<Tooltip>
	<TooltipTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				onclick={() => {
					sidebar.toggle();
				}}
				variant="outline"
				class="md:h-fit md:px-2"
			>
				<SidebarLeftIcon />
			</Button>
		{/snippet}
	</TooltipTrigger>
	<TooltipContent align="start">Toggle Sidebar</TooltipContent>
</Tooltip>
