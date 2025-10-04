<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Await Blocks',
			path: '/examples/logic/await-blocks',
			description: 'Example: Await Blocks'
		},
		{
			title: 'Each Blocks',
			path: '/examples/logic/each-blocks',
			description: 'Example: Each Blocks'
		},
		{
			title: 'Else Blocks',
			path: '/examples/logic/else-blocks',
			description: 'Example: Else Blocks'
		},
		{
			title: 'Else If Blocks',
			path: '/examples/logic/else-if-blocks',
			description: 'Example: Else If Blocks'
		},
		{
			title: 'If Blocks',
			path: '/examples/logic/if-blocks',
			description: 'Example: If Blocks'
		},
		{
			title: 'Keyed Each Blocks',
			path: '/examples/logic/keyed-each-blocks',
			description: 'Example: Keyed Each Blocks'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Logic Examples</h1>

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
