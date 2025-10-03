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
	stroke-linejoin="round"
	viewBox="0 0 16 16"
	width={size}
	style="color: currentColor;"
	bind:this={ref}
	{...rest}
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M 8.75,1 H7.25 V7.25 H1.5 V8.75 H7.25 V15 H8.75 V8.75 H14.5 V7.25 H8.75 V1.75 Z"
		fill="currentColor"
	/>
</svg>
