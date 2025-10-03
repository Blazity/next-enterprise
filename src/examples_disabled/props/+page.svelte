<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Declaring',
			path: '/examples/props/declaring',
			description: 'Example: Declaring'
		},
		{
			title: 'Declaring Props',
			path: '/examples/props/declaring-props',
			description: 'Example: Declaring Props'
		},
		{
			title: 'Default Values',
			path: '/examples/props/default-values',
			description: 'Example: Default Values'
		},
		{
			title: 'Spread Props',
			path: '/examples/props/spread-props',
			description: 'Example: Spread Props'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Props Examples</h1>

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
