<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	let {
		inline,
		class: c,
		children,
		...rest
	}: {
		inline?: boolean;
		class?: ClassValue;
		children?: Snippet;
	} = $props();
</script>

{#if inline}
	<code class={cn(`rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`, c)} {...rest}>
		{@render children?.()}
	</code>
{:else}
	<div class="not-prose flex flex-col">
		<pre
			{...rest}
			class="w-full overflow-x-auto rounded-xl border border-zinc-200 p-4 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
          <code class="whitespace-pre-wrap break-words">{@render children?.()}</code>
        </pre>
	</div>
{/if}
