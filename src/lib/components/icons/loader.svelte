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
	<g clip-path="url(#clip0_2393_1490)">
		<path d="M8 0V4" stroke="currentColor" stroke-width="1.5" />
		<path opacity="0.5" d="M8 16V12" stroke="currentColor" stroke-width="1.5" />
		<path
			opacity="0.9"
			d="M3.29773 1.52783L5.64887 4.7639"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<path
			opacity="0.1"
			d="M12.7023 1.52783L10.3511 4.7639"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<path
			opacity="0.4"
			d="M12.7023 14.472L10.3511 11.236"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<path
			opacity="0.6"
			d="M3.29773 14.472L5.64887 11.236"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<path
			opacity="0.2"
			d="M15.6085 5.52783L11.8043 6.7639"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<path
			opacity="0.7"
			d="M0.391602 10.472L4.19583 9.23598"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<path
			opacity="0.3"
			d="M15.6085 10.4722L11.8043 9.2361"
			stroke="currentColor"
			stroke-width="1.5"
		/>
		<path
			opacity="0.8"
			d="M0.391602 5.52783L4.19583 6.7639"
			stroke="currentColor"
			stroke-width="1.5"
		/>
	</g>
	<defs>
		<clipPath id="clip0_2393_1490">
			<rect width="16" height="16" fill="white" />
		</clipPath>
	</defs>
</svg>
