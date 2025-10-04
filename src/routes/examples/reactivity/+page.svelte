<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Assignments',
			path: '/examples/reactivity/assignments',
			description: 'Example: Assignments'
		},
		{
			title: 'Declarations',
			path: '/examples/reactivity/declarations',
			description: 'Example: Declarations'
		},
		{
			title: 'Reactive Assignments',
			path: '/examples/reactivity/reactive-assignments',
			description: 'Example: Reactive Assignments'
		},
		{
			title: 'Reactive Declarations',
			path: '/examples/reactivity/reactive-declarations',
			description: 'Example: Reactive Declarations'
		},
		{
			title: 'Reactive Statements',
			path: '/examples/reactivity/reactive-statements',
			description: 'Example: Reactive Statements'
		},
		{
			title: 'Statements',
			path: '/examples/reactivity/statements',
			description: 'Example: Statements'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Reactivity Examples</h1>

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
