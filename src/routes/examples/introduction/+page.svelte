<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Dynamic Attributes',
			path: '/examples/introduction/dynamic-attributes',
			description: 'Example: Dynamic Attributes'
		},
		{
			title: 'Hello World',
			path: '/examples/introduction/hello-world',
			description: 'Example: Hello World'
		},
		{
			title: 'Html Tags',
			path: '/examples/introduction/html-tags',
			description: 'Example: Html Tags'
		},
		{
			title: 'Nested Components',
			path: '/examples/introduction/nested-components',
			description: 'Example: Nested Components'
		},
		{
			title: 'Styling',
			path: '/examples/introduction/styling',
			description: 'Example: Styling'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Introduction Examples</h1>

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
