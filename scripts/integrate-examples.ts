import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';

interface ExampleMapping {
	source: string;
	target: string;
	category: string;
	name: string;
}

const categoryMappings: Record<string, string> = {
	'00-introduction': 'introduction',
	'01-reactivity': 'reactivity',
	'02-props': 'props',
	'03-logic': 'logic',
	'04-events': 'events',
	'05-bindings': 'bindings',
	'06-lifecycle': 'lifecycle',
	'07-stores': 'stores',
	'08-motion': 'motion',
	'09-transitions': 'transitions',
	'10-animations': 'animations',
	'11-easing': 'easing',
	'12-svg': 'svg',
	'13-actions': 'actions',
	'14-classes': 'classes',
	'15-composition': 'composition',
	'16-context': 'context',
	'17-special-elements': 'special-elements',
	'18-module-context': 'module-context',
	'19-debugging': 'debugging',
	'20-7guis': '7guis',
	'21-miscellaneous': 'miscellaneous'
};

function processExample(sourcePath: string, targetPath: string): void {
	const content = readFileSync(sourcePath, 'utf-8');

	let processed = content;

	processed = processed.replace(/<script>/g, '<script lang="ts">');

	processed = processed.replace(/<button(?!\s+type=)/g, '<button type="button"');

	processed = processed.replace(/<!--.*?-->/gs, '');

	processed = processed.replace(/\/\/.*$/gm, '');

	processed = processed.replace(
		/import\s+(\w+)\s+from\s+['"]\.\/(\w+)\.svelte['"]/g,
		"import $1 from './$2.svelte'"
	);

	processed = processed.replace(/from\s+['"]\.\/stores\.js['"]/g, "from '$stores'");
	processed = processed.replace(/from\s+['"]\.\/utils\.js['"]/g, "from '$utils'");
	processed = processed.replace(/from\s+['"]\.\/click_outside\.js['"]/g, "from '$actions'");
	processed = processed.replace(/from\s+['"]\.\/longpress\.js['"]/g, "from '$actions'");
	processed = processed.replace(/from\s+['"]\.\/pannable\.js['"]/g, "from '$actions'");

	mkdirSync(dirname(targetPath), { recursive: true });
	writeFileSync(targetPath, processed.trim() + '\n');
}

function findExamples(): ExampleMapping[] {
	const examples: ExampleMapping[] = [];
	const docsPath = 'docs/examples';

	const categories = readdirSync(docsPath).filter((name) => {
		const fullPath = join(docsPath, name);
		return statSync(fullPath).isDirectory() && name in categoryMappings;
	});

	for (const category of categories) {
		const categoryPath = join(docsPath, category);
		const exampleDirs = readdirSync(categoryPath).filter((name) => {
			const fullPath = join(categoryPath, name);
			return statSync(fullPath).isDirectory();
		});

		for (const exampleDir of exampleDirs) {
			const assetsPath = join(categoryPath, exampleDir, '+assets');
			try {
				const files = readdirSync(assetsPath);
				const targetCategory = categoryMappings[category];
				const exampleName = exampleDir.replace(/^\d+-/, '').replace(/-/g, '-');

				examples.push({
					source: assetsPath,
					target: `src/routes/examples/${targetCategory}/${exampleName}`,
					category: targetCategory,
					name: exampleName
				});
			} catch (e) {}
		}
	}

	return examples;
}

const examples = findExamples();
console.log(`Found ${examples.length} examples to integrate`);

for (const example of examples) {
	try {
		const files = readdirSync(example.source);

		for (const file of files) {
			if (file.endsWith('.svelte')) {
				const sourcePath = join(example.source, file);
				const targetFile = file === 'App.svelte' ? '+page.svelte' : file;
				const targetPath = join(example.target, targetFile);

				processExample(sourcePath, targetPath);
				console.log(`✓ ${example.category}/${example.name}/${targetFile}`);
			}
		}
	} catch (error) {
		console.error(`✗ Failed to process ${example.category}/${example.name}:`, error);
	}
}

console.log(`\n✅ Integration complete!`);
