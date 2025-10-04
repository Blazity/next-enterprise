<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Svelte Body',
			path: '/examples/special-elements/svelte-body',
			description: 'Example: Svelte Body'
		},
		{
			title: 'Svelte Document',
			path: '/examples/special-elements/svelte-document',
			description: 'Example: Svelte Document'
		},
		{
			title: 'Svelte Element',
			path: '/examples/special-elements/svelte-element',
			description: 'Example: Svelte Element'
		},
		{
			title: 'Svelte Head',
			path: '/examples/special-elements/svelte-head',
			description: 'Example: Svelte Head'
		},
		{
			title: 'Svelte Window',
			path: '/examples/special-elements/svelte-window',
			description: 'Example: Svelte Window'
		},
		{
			title: 'Svelte Window Bindings',
			path: '/examples/special-elements/svelte-window-bindings',
			description: 'Example: Svelte Window Bindings'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Special Elements Examples</h1>

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
