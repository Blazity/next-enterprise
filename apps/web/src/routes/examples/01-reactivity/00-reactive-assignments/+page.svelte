<script lang="ts">
	let count = $state(0);

	function handleClick() {
		count += 1;
	}

	function reset() {
		count = 0;
	}

	function incrementBy(amount: number) {
		count += amount;
	}
</script>

<h2>Reactive Assignments</h2>

<button onclick={handleClick} data-testid="click-button">
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>

<div class="controls">
	<button onclick={reset} data-testid="reset-button">Reset</button>
	<button onclick={() => incrementBy(5)} data-testid="increment-5-button">+5</button>
	<button onclick={() => incrementBy(10)} data-testid="increment-10-button">+10</button>
</div>

<div class="info" data-testid="count-display">
	Current count: <strong>{count}</strong>
</div>

<style>
	.controls {
		margin: 1rem 0;
		display: flex;
		gap: 0.5rem;
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

	.info {
		margin-top: 1rem;
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 4px;
	}
</style>
