<script lang="ts">
	interface ExampleCategory {
		title: string;
		path: string;
		description: string;
		count: number;
	}

	const categories: ExampleCategory[] = [
		{
			title: 'Introduction',
			path: '/examples/introduction',
			description: 'Basic Svelte concepts and syntax',
			count: 5
		},
		{
			title: 'Reactivity',
			path: '/examples/reactivity',
			description: 'Reactive assignments, declarations, and statements',
			count: 3
		},
		{
			title: 'Props',
			path: '/examples/props',
			description: 'Component properties and prop spreading',
			count: 3
		},
		{
			title: 'Logic',
			path: '/examples/logic',
			description: 'Control flow with if, each, and await blocks',
			count: 6
		},
		{
			title: 'Events',
			path: '/examples/events',
			description: 'DOM and component event handling',
			count: 5
		},
		{
			title: 'Bindings',
			path: '/examples/bindings',
			description: 'Two-way data binding for inputs and components',
			count: 13
		},
		{
			title: 'Lifecycle',
			path: '/examples/lifecycle',
			description: 'Component lifecycle hooks',
			count: 3
		},
		{
			title: 'Stores',
			path: '/examples/stores',
			description: 'State management with Svelte stores',
			count: 5
		},
		{
			title: 'Motion',
			path: '/examples/motion',
			description: 'Tweened and spring animations',
			count: 2
		},
		{
			title: 'Transitions',
			path: '/examples/transitions',
			description: 'Element transitions and animations',
			count: 7
		},
		{
			title: 'Animations',
			path: '/examples/animations',
			description: 'Animate directive for list animations',
			count: 1
		},
		{
			title: 'Easing',
			path: '/examples/easing',
			description: 'Easing functions for smooth animations',
			count: 1
		},
		{
			title: 'SVG',
			path: '/examples/svg',
			description: 'Working with SVG elements',
			count: 5
		},
		{
			title: 'Actions',
			path: '/examples/actions',
			description: 'Reusable element behaviors',
			count: 3
		},
		{
			title: 'Classes',
			path: '/examples/classes',
			description: 'Dynamic class binding',
			count: 2
		},
		{
			title: 'Composition',
			path: '/examples/composition',
			description: 'Component composition patterns',
			count: 6
		},
		{
			title: 'Context',
			path: '/examples/context',
			description: 'Context API for component communication',
			count: 1
		},
		{
			title: 'Special Elements',
			path: '/examples/special-elements',
			description: 'Special Svelte elements like svelte:window',
			count: 6
		},
		{
			title: 'Module Context',
			path: '/examples/module-context',
			description: 'Module-level script context',
			count: 1
		},
		{
			title: 'Debugging',
			path: '/examples/debugging',
			description: 'Debug tag for inspecting values',
			count: 1
		},
		{
			title: '7 GUIs',
			path: '/examples/7guis',
			description: 'Classic GUI programming challenges',
			count: 6
		},
		{
			title: 'Miscellaneous',
			path: '/examples/miscellaneous',
			description: 'Advanced patterns and techniques',
			count: 3
		}
	];

	const totalExamples = categories.reduce((sum, cat) => sum + cat.count, 0);
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="mb-4 text-4xl font-bold">Svelte 5 Examples</h1>
		<p class="text-lg text-gray-600">
			Explore {totalExamples} interactive examples across {categories.length} categories
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each categories as category}
			<a
				href={category.path}
				class="block rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
			>
				<div class="mb-2 flex items-center justify-between">
					<h2 class="text-xl font-semibold">{category.title}</h2>
					<span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
						{category.count}
					</span>
				</div>
				<p class="text-gray-600">{category.description}</p>
			</a>
		{/each}
	</div>
</div>
