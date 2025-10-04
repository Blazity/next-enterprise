<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Area Chart',
			path: '/examples/svg/area-chart',
			description: 'Example: Area Chart'
		},
		{
			title: 'Bar Chart',
			path: '/examples/svg/bar-chart',
			description: 'Example: Bar Chart'
		},
		{
			title: 'Clock',
			path: '/examples/svg/clock',
			description: 'Example: Clock'
		},
		{
			title: 'Scatterplot',
			path: '/examples/svg/scatterplot',
			description: 'Example: Scatterplot'
		},
		{
			title: 'Svg Transitions',
			path: '/examples/svg/svg-transitions',
			description: 'Example: Svg Transitions'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">SVG Examples</h1>

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
