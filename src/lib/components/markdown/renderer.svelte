<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import { cn } from '$lib/utils/shadcn';
	import CodeBlock from '../code-block.svelte';
	let { md }: { md: string } = $props();
</script>

<Markdown {md} plugins={[gfmPlugin()]}>
	{#snippet ol(props)}
		{@const { children, ...rest } = props}
		<ol {...rest} class={cn('ml-4 list-outside list-decimal', rest.class)}>
			{@render children?.()}
		</ol>
	{/snippet}
	{#snippet ul(props)}
		{@const { children, ...rest } = props}
		<ul {...rest} class={cn('ml-4 list-outside list-decimal', rest.class)}>
			{@render children?.()}
		</ul>
	{/snippet}
	{#snippet li(props)}
		{@const { children, ...rest } = props}
		<li {...rest} class={cn('py-1', rest.class)}>
			{@render children?.()}
		</li>
	{/snippet}

	{#snippet strong(props)}
		{@const { children, ...rest } = props}
		<span {...rest} class={cn('font-semibold', rest.class)}>
			{@render children?.()}
		</span>
	{/snippet}
	{#snippet a(props)}
		{@const { children, ...rest } = props}
		<a
			{...rest}
			class={cn('text-blue-500 hover:underline', rest.class)}
			target="_blank"
			rel="noopener noreferrer"
		>
			{@render children?.()}
		</a>
	{/snippet}

	{#snippet h1(props)}
		{@const { children, ...rest } = props}
		<h1 {...rest} class={cn('mb-2 mt-6 text-3xl font-semibold', rest.class)}>
			{@render children?.()}
		</h1>
	{/snippet}
	{#snippet h2(props)}
		{@const { children, ...rest } = props}
		<h2 {...rest} class={cn('mb-2 mt-6 text-2xl font-semibold', rest.class)}>
			{@render children?.()}
		</h2>
	{/snippet}
	{#snippet h3(props)}
		{@const { children, ...rest } = props}
		<h3 {...rest} class={cn('mb-2 mt-6 text-xl font-semibold', rest.class)}>
			{@render children?.()}
		</h3>
	{/snippet}
	{#snippet h4(props)}
		{@const { children, ...rest } = props}
		<h4 {...rest} class={cn('mb-2 mt-6 text-lg font-semibold', rest.class)}>
			{@render children?.()}
		</h4>
	{/snippet}
	{#snippet h5(props)}
		{@const { children, ...rest } = props}
		<h5 {...rest} class={cn('mb-2 mt-6 text-base font-semibold', rest.class)}>
			{@render children?.()}
		</h5>
	{/snippet}
	{#snippet h6(props)}
		{@const { children, ...rest } = props}
		<h6 {...rest} class={cn('mb-2 mt-6 text-sm font-semibold', rest.class)}>
			{@render children?.()}
		</h6>
	{/snippet}
	{#snippet code(props)}
		<CodeBlock {...props} class={props.class ?? undefined} />
	{/snippet}
</Markdown>
