import { writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join } from 'path';

interface CategoryInfo {
	name: string;
	title: string;
	description: string;
	examples: Array<{ name: string; title: string; description: string }>;
}

const categories: Record<string, CategoryInfo> = {
	introduction: {
		name: 'introduction',
		title: 'Introduction',
		description: 'Basic Svelte concepts and syntax',
		examples: []
	},
	reactivity: {
		name: 'reactivity',
		title: 'Reactivity',
		description: 'Reactive assignments, declarations, and statements',
		examples: []
	},
	props: {
		name: 'props',
		title: 'Props',
		description: 'Component properties and prop spreading',
		examples: []
	},
	logic: {
		name: 'logic',
		title: 'Logic',
		description: 'Control flow with if, each, and await blocks',
		examples: []
	},
	events: {
		name: 'events',
		title: 'Events',
		description: 'DOM and component event handling',
		examples: []
	},
	bindings: {
		name: 'bindings',
		title: 'Bindings',
		description: 'Two-way data binding for inputs and components',
		examples: []
	},
	lifecycle: {
		name: 'lifecycle',
		title: 'Lifecycle',
		description: 'Component lifecycle hooks',
		examples: []
	},
	stores: {
		name: 'stores',
		title: 'Stores',
		description: 'State management with Svelte stores',
		examples: []
	},
	motion: {
		name: 'motion',
		title: 'Motion',
		description: 'Tweened and spring animations',
		examples: []
	},
	transitions: {
		name: 'transitions',
		title: 'Transitions',
		description: 'Element transitions and animations',
		examples: []
	},
	animations: {
		name: 'animations',
		title: 'Animations',
		description: 'Animate directive for list animations',
		examples: []
	},
	easing: {
		name: 'easing',
		title: 'Easing',
		description: 'Easing functions for smooth animations',
		examples: []
	},
	svg: {
		name: 'svg',
		title: 'SVG',
		description: 'Working with SVG elements',
		examples: []
	},
	actions: {
		name: 'actions',
		title: 'Actions',
		description: 'Reusable element behaviors',
		examples: []
	},
	classes: {
		name: 'classes',
		title: 'Classes',
		description: 'Dynamic class binding',
		examples: []
	},
	composition: {
		name: 'composition',
		title: 'Composition',
		description: 'Component composition patterns',
		examples: []
	},
	context: {
		name: 'context',
		title: 'Context',
		description: 'Context API for component communication',
		examples: []
	},
	'special-elements': {
		name: 'special-elements',
		title: 'Special Elements',
		description: 'Special Svelte elements like svelte:window',
		examples: []
	},
	'module-context': {
		name: 'module-context',
		title: 'Module Context',
		description: 'Module-level script context',
		examples: []
	},
	debugging: {
		name: 'debugging',
		title: 'Debugging',
		description: 'Debug tag for inspecting values',
		examples: []
	},
	'7guis': {
		name: '7guis',
		title: '7 GUIs',
		description: 'Classic GUI programming challenges',
		examples: []
	},
	miscellaneous: {
		name: 'miscellaneous',
		title: 'Miscellaneous',
		description: 'Advanced patterns and techniques',
		examples: []
	}
};

function titleCase(str: string): string {
	return str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function scanExamples(): void {
	const basePath = 'src/routes/examples';

	for (const categoryKey in categories) {
		const categoryPath = join(basePath, categoryKey);
		try {
			const items = readdirSync(categoryPath);

			for (const item of items) {
				const itemPath = join(categoryPath, item);
				if (statSync(itemPath).isDirectory()) {
					categories[categoryKey].examples.push({
						name: item,
						title: titleCase(item),
						description: `Example: ${titleCase(item)}`
					});
				}
			}
		} catch (e) {
			console.log(`Category ${categoryKey} not found, skipping...`);
		}
	}
}

function generateCategoryIndex(category: CategoryInfo): string {
	return `<script lang="ts">
	interface Example {
		title: string;
		path: string;
		description: string;
	}

	const examples: Example[] = [
${category.examples
	.map(
		(ex) => `		{
			title: '${ex.title}',
			path: '/examples/${category.name}/${ex.name}',
			description: '${ex.description}'
		}`
	)
	.join(',\n')}
	];
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">${category.title} Examples</h1>

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
`;
}

scanExamples();

for (const categoryKey in categories) {
	const category = categories[categoryKey];
	if (category.examples.length > 0) {
		const indexPath = `src/routes/examples/${categoryKey}/+page.svelte`;
		const content = generateCategoryIndex(category);
		writeFileSync(indexPath, content);
		console.log(`✓ Created ${indexPath} (${category.examples.length} examples)`);
	}
}

console.log('\n✅ All category indexes created!');
