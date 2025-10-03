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
		d="M15 11.25V10.5H13.5V11.25V12.75C13.5 13.1642 13.1642 13.5 12.75 13.5H3.25C2.83579 13.5 2.5 13.1642 2.5 12.75L2.5 3.25C2.5 2.83579 2.83579 2.5 3.25 2.5H5.75H6.5V1H5.75H3.25C2.00736 1 1 2.00736 1 3.25V12.75C1 13.9926 2.00736 15 3.25 15H12.75C13.9926 15 15 13.9926 15 12.75V11.25ZM15 5.5L10.5 1V4C7.46243 4 5 6.46243 5 9.5V10L5.05855 9.91218C6.27146 8.09281 8.31339 7 10.5 7V10L15 5.5Z"
		fill="currentColor"
	></path>
</svg>
