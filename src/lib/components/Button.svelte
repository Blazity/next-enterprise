<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { twMerge } from 'tailwind-merge';
	import type { Snippet } from 'svelte';

	const button = cva(['btn'], {
		variants: {
			intent: {
				primary: ['btn-primary'],
				secondary: ['btn-outline']
			},
			size: {
				sm: ['btn-sm'],
				lg: ['btn-lg']
			},
			underline: { true: ['underline'], false: [] }
		},
		defaultVariants: {
			intent: 'primary',
			size: 'lg'
		}
	});

	interface ButtonProps {
		intent?: 'primary' | 'secondary';
		size?: 'sm' | 'lg';
		underline?: boolean;
		href?: string;
		children?: Snippet;
		class?: string;
	}

	let {
		intent,
		size,
		underline,
		href,
		children,
		class: className,
		...props
	}: ButtonProps = $props();
</script>

{#if href}
	<a {href} class={twMerge(button({ intent, size, class: className, underline }))} {...props}>
		{@render children?.()}
	</a>
{:else}
	<button class={twMerge(button({ intent, size, class: className, underline }))} {...props}>
		{@render children?.()}
	</button>
{/if}
