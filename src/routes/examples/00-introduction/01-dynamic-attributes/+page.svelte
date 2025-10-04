<script>
	let src = $state('/tutorial/image.gif');
	let name = $state('Rick Astley');
</script>

<!-- {src} is short for src={src} -->
<img {src} alt="{name} dancing" data-testid="dynamic-image" />

<div class="controls">
	<label>
		Image URL:
		<input bind:value={src} data-testid="src-input" />
	</label>
	<label>
		Alt text name:
		<input bind:value={name} data-testid="name-input" />
	</label>
</div>

<style>
	.controls {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
