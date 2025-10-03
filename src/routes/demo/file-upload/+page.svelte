<script lang="ts">
	let files = $state<File[]>([]);
	let uploading = $state(false);
	let uploadedFiles = $state<string[]>([]);
	let error = $state('');

	async function handleFileChange(event: Event): Promise<void> {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			files = Array.from(target.files);
		}
	}

	async function uploadFiles(): Promise<void> {
		if (files.length === 0) return;

		uploading = true;
		error = '';

		try {
			for (const file of files) {
				const formData = new FormData();
				formData.append('file', file);

				const response = await fetch('/api/storage/upload', {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					throw new Error(`Upload failed for ${file.name}`);
				}

				const result = await response.json();
				uploadedFiles = [...uploadedFiles, result.file.name];
			}

			files = [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload failed';
		} finally {
			uploading = false;
		}
	}

	async function loadFiles(): Promise<void> {
		try {
			const response = await fetch('/api/storage/upload');
			const result = await response.json();
			uploadedFiles = result.files || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load files';
		}
	}

	$effect(() => {
		loadFiles();
	});
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">File Upload Demo</h1>

	<div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
		<h2 class="mb-4 text-xl font-semibold">Upload Files</h2>

		<div class="mb-4">
			<input
				type="file"
				multiple
				onchange={handleFileChange}
				class="block w-full rounded-lg border border-gray-300 px-3 py-2"
			/>
		</div>

		{#if files.length > 0}
			<div class="mb-4">
				<p class="mb-2 text-sm font-medium">Selected files:</p>
				<ul class="list-inside list-disc space-y-1 text-sm">
					{#each files as file}
						<li>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
					{/each}
				</ul>
			</div>
		{/if}

		<button
			type="button"
			onclick={uploadFiles}
			disabled={uploading || files.length === 0}
			class="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
		>
			{uploading ? 'Uploading...' : 'Upload'}
		</button>

		{#if error}
			<p class="mt-4 text-red-600">{error}</p>
		{/if}
	</div>

	<div class="rounded-lg border border-gray-200 bg-white p-6">
		<h2 class="mb-4 text-xl font-semibold">Uploaded Files</h2>

		{#if uploadedFiles.length === 0}
			<p class="text-gray-500">No files uploaded yet</p>
		{:else}
			<ul class="space-y-2">
				{#each uploadedFiles as fileName}
					<li class="rounded-lg bg-gray-50 px-4 py-2">{fileName}</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="mt-4 rounded-lg bg-green-50 p-4">
		<h2 class="mb-2 font-semibold">Features:</h2>
		<ul class="list-inside list-disc space-y-1 text-sm">
			<li>Local filesystem storage (no cloud required)</li>
			<li>Multiple file upload support</li>
			<li>File listing and management</li>
			<li>Easy to swap with cloud storage later</li>
		</ul>
	</div>
</div>
