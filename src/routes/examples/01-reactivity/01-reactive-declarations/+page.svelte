<script lang="ts">
	let count = $state(1);

	let doubled = $derived(count * 2);
	let quadrupled = $derived(doubled * 2);
	let squared = $derived(count * count);
	let description = $derived(`Count is ${count}, doubled is ${doubled}`);

	function handleClick() {
		count += 1;
	}

	function reset() {
		count = 1;
	}

	function setCount(newCount: number) {
		count = newCount;
	}
</script>

<h2>Reactive Declarations ($derived)</h2>

<div class="counter">
	<button onclick={handleClick} data-testid="increment-button">
		Count: {count}
	</button>
	<button onclick={reset} data-testid="reset-button">Reset</button>
</div>

<div class="calculations">
	<p data-testid="doubled-display">{count} * 2 = {doubled}</p>
	<p data-testid="quadrupled-display">{doubled} * 2 = {quadrupled}</p>
	<p data-testid="squared-display">{count}² = {squared}</p>
	<p data-testid="description-display">{description}</p>
</div>

<div class="controls">
	<label>
		Set count manually:
		<input type="number" min="1" max="20" bind:value={count} data-testid="count-input" />
	</label>

	<div class="presets">
		<button onclick={() => setCount(5)} data-testid="set-5-button">Set to 5</button>
		<button onclick={() => setCount(10)} data-testid="set-10-button">Set to 10</button>
		<button onclick={() => setCount(15)} data-testid="set-15-button">Set to 15</button>
	</div>
</div>

<style>
	.counter {
		margin-bottom: 2rem;
	}

	.calculations {
		margin-bottom: 2rem;
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 8px;
	}

	.calculations p {
		margin: 0.5rem 0;
		font-family: monospace;
		font-size: 1.1rem;
	}

	.controls {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
	}

	label {
		display: block;
		margin-bottom: 1rem;
		font-weight: bold;
	}

	input {
		margin-left: 0.5rem;
		padding: 0.25rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 80px;
	}

	.presets {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	button {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: pointer;
	}

	button:hover {
		background: #f0f0f0;
	}

	.counter button:first-child {
		margin-right: 0.5rem;
		font-size: 1.2rem;
		font-weight: bold;
		padding: 0.75rem 1.5rem;
	}
</style>
