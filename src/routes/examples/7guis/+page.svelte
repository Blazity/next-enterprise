<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: '7guis Circles',
			path: '/examples/7guis/7guis-circles',
			description: 'Example: 7guis Circles'
		},
		{
			title: '7guis Counter',
			path: '/examples/7guis/7guis-counter',
			description: 'Example: 7guis Counter'
		},
		{
			title: '7guis Crud',
			path: '/examples/7guis/7guis-crud',
			description: 'Example: 7guis Crud'
		},
		{
			title: '7guis Flight Booker',
			path: '/examples/7guis/7guis-flight-booker',
			description: 'Example: 7guis Flight Booker'
		},
		{
			title: '7guis Temperature',
			path: '/examples/7guis/7guis-temperature',
			description: 'Example: 7guis Temperature'
		},
		{
			title: '7guis Timer',
			path: '/examples/7guis/7guis-timer',
			description: 'Example: 7guis Timer'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">7 GUIs Examples</h1>

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
