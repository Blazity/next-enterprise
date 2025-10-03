<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Dynamic Components',
			path: '/examples/miscellaneous/dynamic-components',
			description: 'Example: Dynamic Components'
		},
		{
			title: 'Hacker News',
			path: '/examples/miscellaneous/hacker-news',
			description: 'Example: Hacker News'
		},
		{
			title: 'Recursive Components',
			path: '/examples/miscellaneous/recursive-components',
			description: 'Example: Recursive Components'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Miscellaneous Examples</h1>

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
