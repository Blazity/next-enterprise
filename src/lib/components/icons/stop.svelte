<script lang="ts">
	import type { WithElementRef } from '$lib/utils/types.js';
	import type { SVGAttributes } from 'svelte/elements';

	let {
		size = 16,
		ref = $bindable(null),
		...rest
	}: WithElementRef<SVGAttributes<SVGElement> & { size?: number }, SVGElement> = $props();
</script>

<svg
	height={size}
	viewBox="0 0 16 16"
	width={size}
	style="color: currentColor;"
	bind:this={ref}
	{...rest}
>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M3 3H13V13H3V3Z" fill="currentColor" />
</svg>
