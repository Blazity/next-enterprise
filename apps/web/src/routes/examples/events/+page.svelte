<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Component Events',
			path: '/examples/events/component-events',
			description: 'Example: Component Events'
		},
		{
			title: 'Dom Event Forwarding',
			path: '/examples/events/dom-event-forwarding',
			description: 'Example: Dom Event Forwarding'
		},
		{
			title: 'Dom Events',
			path: '/examples/events/dom-events',
			description: 'Example: Dom Events'
		},
		{
			title: 'Event Forwarding',
			path: '/examples/events/event-forwarding',
			description: 'Example: Event Forwarding'
		},
		{
			title: 'Inline Handlers',
			path: '/examples/events/inline-handlers',
			description: 'Example: Inline Handlers'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Events Examples</h1>

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
