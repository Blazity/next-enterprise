<script lang="ts">
	interface Demo {
		title: string;
		path: string;
		description: string;
		technology: string;
	}

	const demos: Demo[] = [
		{
			title: 'AI Chat',
			path: '/demo/ai-chat',
			description: 'Real-time AI chat powered by OpenRouter and AI SDK 5',
			technology: 'AI SDK 5 + OpenRouter'
		},
		{
			title: 'File Upload',
			path: '/demo/file-upload',
			description: 'Local filesystem storage for file uploads',
			technology: 'Node.js fs/promises'
		},
		{
			title: 'Cache',
			path: '/demo/cache',
			description: 'In-memory key-value caching',
			technology: 'node-cache'
		},
		{
			title: 'Lucia Auth',
			path: '/demo/lucia',
			description: 'Authentication with Lucia',
			technology: 'Lucia + SQLite'
		}
	];
</script>

<div class="container mx-auto max-w-6xl px-4 py-8">
	<div class="mb-8">
		<h1 class="mb-4 text-4xl font-bold">Local Development Demos</h1>
		<p class="text-lg text-gray-600">
			Explore working examples of local alternatives to cloud services
		</p>
	</div>

	<div class="mb-8 rounded-lg bg-blue-50 p-6">
		<h2 class="mb-4 text-2xl font-semibold">Technology Stack</h2>
		<div class="grid gap-4 md:grid-cols-3">
			<div class="rounded-lg bg-white p-4">
				<h3 class="mb-2 font-semibold text-blue-600">Database</h3>
				<p class="text-sm text-gray-600">SQLite with better-sqlite3</p>
				<p class="mt-2 text-xs text-gray-500">Replaces: PostgreSQL, Vercel Postgres</p>
			</div>
			<div class="rounded-lg bg-white p-4">
				<h3 class="mb-2 font-semibold text-green-600">File Storage</h3>
				<p class="text-sm text-gray-600">Local filesystem (fs/promises)</p>
				<p class="mt-2 text-xs text-gray-500">Replaces: Vercel Blob, S3, GCS</p>
			</div>
			<div class="rounded-lg bg-white p-4">
				<h3 class="mb-2 font-semibold text-purple-600">Cache/KV</h3>
				<p class="text-sm text-gray-600">node-cache (in-memory)</p>
				<p class="mt-2 text-xs text-gray-500">Replaces: Redis, Vercel KV, Upstash</p>
			</div>
		</div>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each demos as demo}
			<a
				href={demo.path}
				class="block rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
			>
				<h2 class="mb-2 text-xl font-semibold">{demo.title}</h2>
				<p class="mb-3 text-gray-600">{demo.description}</p>
				<div class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
					{demo.technology}
				</div>
			</a>
		{/each}
	</div>

	<div class="mt-8 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
		<h2 class="mb-2 text-xl font-semibold">Benefits of Local Development</h2>
		<ul class="list-inside list-disc space-y-2 text-sm">
			<li>No cloud service dependencies during development</li>
			<li>Faster iteration and testing</li>
			<li>Works offline</li>
			<li>Easy to swap with production cloud services later</li>
			<li>Consistent development environment across team</li>
			<li>Lower costs for development and testing</li>
		</ul>
	</div>
</div>
