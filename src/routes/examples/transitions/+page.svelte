<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Adding Parameters To Transitions',
			path: '/examples/transitions/adding-parameters-to-transitions',
			description: 'Example: Adding Parameters To Transitions'
		},
		{
			title: 'Custom Css Transitions',
			path: '/examples/transitions/custom-css-transitions',
			description: 'Example: Custom Css Transitions'
		},
		{
			title: 'Custom Js Transitions',
			path: '/examples/transitions/custom-js-transitions',
			description: 'Example: Custom Js Transitions'
		},
		{
			title: 'Deferred Transitions',
			path: '/examples/transitions/deferred-transitions',
			description: 'Example: Deferred Transitions'
		},
		{
			title: 'In And Out',
			path: '/examples/transitions/in-and-out',
			description: 'Example: In And Out'
		},
		{
			title: 'Transition',
			path: '/examples/transitions/transition',
			description: 'Example: Transition'
		},
		{
			title: 'Transition Events',
			path: '/examples/transitions/transition-events',
			description: 'Example: Transition Events'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Transitions Examples</h1>

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
