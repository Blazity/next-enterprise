<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
		{
			title: 'Bind This',
			path: '/examples/bindings/bind-this',
			description: 'Example: Bind This'
		},
		{
			title: 'Checkbox Inputs',
			path: '/examples/bindings/checkbox-inputs',
			description: 'Example: Checkbox Inputs'
		},
		{
			title: 'Component Bindings',
			path: '/examples/bindings/component-bindings',
			description: 'Example: Component Bindings'
		},
		{
			title: 'Dimensions',
			path: '/examples/bindings/dimensions',
			description: 'Example: Dimensions'
		},
		{
			title: 'Each Block Bindings',
			path: '/examples/bindings/each-block-bindings',
			description: 'Example: Each Block Bindings'
		},
		{
			title: 'File Inputs',
			path: '/examples/bindings/file-inputs',
			description: 'Example: File Inputs'
		},
		{
			title: 'Group Inputs',
			path: '/examples/bindings/group-inputs',
			description: 'Example: Group Inputs'
		},
		{
			title: 'Media Elements',
			path: '/examples/bindings/media-elements',
			description: 'Example: Media Elements'
		},
		{
			title: 'Multiple Select Bindings',
			path: '/examples/bindings/multiple-select-bindings',
			description: 'Example: Multiple Select Bindings'
		},
		{
			title: 'Numeric Inputs',
			path: '/examples/bindings/numeric-inputs',
			description: 'Example: Numeric Inputs'
		},
		{
			title: 'Select Bindings',
			path: '/examples/bindings/select-bindings',
			description: 'Example: Select Bindings'
		},
		{
			title: 'Text Inputs',
			path: '/examples/bindings/text-inputs',
			description: 'Example: Text Inputs'
		},
		{
			title: 'Textarea Inputs',
			path: '/examples/bindings/textarea-inputs',
			description: 'Example: Textarea Inputs'
		}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Bindings Examples</h1>

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
