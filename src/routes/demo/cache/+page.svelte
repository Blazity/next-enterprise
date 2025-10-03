<script lang="ts">
	let key = $state('');
	let value = $state('');
	let ttl = $state(600);
	let result = $state('');
	let error = $state('');

	async function setCache(): Promise<void> {
		if (!key || !value) {
			error = 'Key and value are required';
			return;
		}

		error = '';
		result = '';

		try {
			const response = await fetch('/api/cache', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key, value, ttl })
			});

			const data = await response.json();

			if (data.success) {
				result = `Successfully cached: ${key}`;
				key = '';
				value = '';
			} else {
				error = data.error || 'Failed to set cache';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Request failed';
		}
	}

	async function getCache(): Promise<void> {
		if (!key) {
			error = 'Key is required';
			return;
		}

		error = '';
		result = '';

		try {
			const response = await fetch(`/api/cache?key=${encodeURIComponent(key)}`);
			const data = await response.json();

			if (data.success) {
				result = `Value: ${JSON.stringify(data.value)}`;
			} else {
				error = data.error || 'Key not found';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Request failed';
		}
	}

	async function deleteCache(): Promise<void> {
		if (!key) {
			error = 'Key is required';
			return;
		}

		error = '';
		result = '';

		try {
			const response = await fetch(`/api/cache?key=${encodeURIComponent(key)}`, {
				method: 'DELETE'
			});

			const data = await response.json();

			if (data.success) {
				result = `Successfully deleted: ${key}`;
				key = '';
			} else {
				error = 'Failed to delete key';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Request failed';
		}
	}
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Cache Demo</h1>

	<div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
		<h2 class="mb-4 text-xl font-semibold">Cache Operations</h2>

		<div class="mb-4">
			<label for="key" class="mb-1 block text-sm font-medium">Key</label>
			<input
				id="key"
				type="text"
				bind:value={key}
				placeholder="Enter cache key"
				class="w-full rounded-lg border border-gray-300 px-4 py-2"
			/>
		</div>

		<div class="mb-4">
			<label for="value" class="mb-1 block text-sm font-medium">Value</label>
			<input
				id="value"
				type="text"
				bind:value
				placeholder="Enter value to cache"
				class="w-full rounded-lg border border-gray-300 px-4 py-2"
			/>
		</div>

		<div class="mb-4">
			<label for="ttl" class="mb-1 block text-sm font-medium">TTL (seconds)</label>
			<input
				id="ttl"
				type="number"
				bind:value={ttl}
				class="w-full rounded-lg border border-gray-300 px-4 py-2"
			/>
		</div>

		<div class="flex gap-2">
			<button
				type="button"
				onclick={setCache}
				class="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
			>
				Set
			</button>
			<button
				type="button"
				onclick={getCache}
				class="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600"
			>
				Get
			</button>
			<button
				type="button"
				onclick={deleteCache}
				class="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
			>
				Delete
			</button>
		</div>

		{#if result}
			<div class="mt-4 rounded-lg bg-green-50 p-4 text-green-800">{result}</div>
		{/if}

		{#if error}
			<div class="mt-4 rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
		{/if}
	</div>

	<div class="rounded-lg bg-purple-50 p-4">
		<h2 class="mb-2 font-semibold">Features:</h2>
		<ul class="list-inside list-disc space-y-1 text-sm">
			<li>In-memory caching with node-cache</li>
			<li>Configurable TTL (Time To Live)</li>
			<li>Get, Set, and Delete operations</li>
			<li>No external Redis/KV service required</li>
		</ul>
	</div>
</div>
