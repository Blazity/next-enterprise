<script>
	let string = $state(`here's some <strong>HTML!!!</strong>`);
	let safeString = $state(`This is <em>safe</em> text`);
	let dangerousString = $state(`Potentially dangerous script content`);
</script>

<h2>HTML Tags Example</h2>

<div data-testid="html-content">
	<p>{@html string}</p>
</div>

<div data-testid="safe-content">
	<p>{@html safeString}</p>
</div>

<div class="controls">
	<label>
		HTML String:
		<textarea bind:value={string} data-testid="html-input" rows="3"></textarea>
	</label>
	<label>
		Safe String:
		<textarea bind:value={safeString} data-testid="safe-input" rows="2"></textarea>
	</label>
</div>

<div class="warning" data-testid="warning">
	<strong>⚠️ Warning:</strong>
	{@html dangerousString} will be rendered as plain text for security
</div>

<style>
	.controls {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-weight: bold;
	}

	textarea {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: monospace;
	}

	.warning {
		margin-top: 2rem;
		padding: 1rem;
		background: #fff3cd;
		border: 1px solid #ffeaa7;
		border-radius: 4px;
		color: #856404;
	}
</style>
