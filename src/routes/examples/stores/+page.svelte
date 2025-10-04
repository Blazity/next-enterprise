<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Auto Subscriptions',
			path: '/examples/stores/auto-subscriptions',
			description: 'Example: Auto Subscriptions'
		},
		{
			title: 'Custom Stores',
			path: '/examples/stores/custom-stores',
			description: 'Example: Custom Stores'
		},
		{
			title: 'Derived Stores',
			path: '/examples/stores/derived-stores',
			description: 'Example: Derived Stores'
		},
		{
			title: 'Readable Stores',
			path: '/examples/stores/readable-stores',
			description: 'Example: Readable Stores'
		},
		{
			title: 'Writable Stores',
			path: '/examples/stores/writable-stores',
			description: 'Example: Writable Stores'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Stores Examples</h1>

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
