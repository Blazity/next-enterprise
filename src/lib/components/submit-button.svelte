<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from './ui/button';
	import LoaderIcon from './icons/loader.svelte';

	let { pending, success, children }: { pending: boolean; success: boolean; children: Snippet } =
		$props();
</script>

<Button type={pending ? 'button' : 'submit'} disabled={pending || success} class="relative">
	{@render children()}

	{#if pending || success}
		<span class="absolute right-4 animate-spin">
			<LoaderIcon />
		</span>
	{/if}

	<output aria-live="polite" class="sr-only">
		{pending || success ? 'Loading' : 'Submit form'}
	</output>
</Button>
