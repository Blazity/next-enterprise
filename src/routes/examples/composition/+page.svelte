<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Conditional Render Props',
			path: '/examples/composition/conditional-render-props',
			description: 'Example: Conditional Render Props'
		},
		{
			title: 'Modal',
			path: '/examples/composition/modal',
			description: 'Example: Modal'
		},
		{
			title: 'Named Render Props',
			path: '/examples/composition/named-render-props',
			description: 'Example: Named Render Props'
		},
		{
			title: 'Render Prop Fallbacks',
			path: '/examples/composition/render-prop-fallbacks',
			description: 'Example: Render Prop Fallbacks'
		},
		{
			title: 'Render Prop Props',
			path: '/examples/composition/render-prop-props',
			description: 'Example: Render Prop Props'
		},
		{
			title: 'Render Props',
			path: '/examples/composition/render-props',
			description: 'Example: Render Props'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Composition Examples</h1>

	<div class="grid gap-6 md:grid-cols-2">
		{#each examples as example}
			<a
				href={example.path}
				class="block rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
			>
				<h2 class="mb-2 text-xl font-semibold">{example.title}</h2>
				<p class="text-gray-600">{example.description}</p>
			</a>
		{/each}
	</div>
</div>
