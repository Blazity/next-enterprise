<script lang="ts">
	import SparklesIcon from '$lib/components/icons/sparkles.svelte';
	import { fly } from 'svelte/transition';
</script>

<div
	class="group/message mx-auto w-full max-w-3xl px-4"
	data-role="assistant"
	in:fly={{ opacity: 0, y: 5 }}
>
	<div
		class="
      group-data-[role=user]/message:bg-muted flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto
      group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3
      group-data-[role=user]/message:py-2
    "
	>
		<div class="ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
			<SparklesIcon size={14} />
		</div>

		<div class="flex w-full flex-col gap-2">
			<div class="text-muted-foreground flex flex-col gap-4">Hmm...</div>
		</div>
	</div>
</div>
