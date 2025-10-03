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
		d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z"
		fill="currentColor"
	/>
</svg>
