<script lang="ts">
	let count = $state(0);
	let message = $state('');
	let color = $state('normal');

	$effect(() => {
		if (count >= 10) {
			message = 'Count is dangerously high!';
			color = 'danger';
			count = 9;
		} else if (count >= 7) {
			message = 'Count is getting high';
			color = 'warning';
		} else if (count >= 4) {
			message = 'Count is moderate';
			color = 'caution';
		} else if (count > 0) {
			message = 'Count is low';
			color = 'normal';
		} else {
			message = 'Click to start counting';
			color = 'normal';
		}
	});

	function handleClick() {
		count += 1;
	}

	function reset() {
		count = 0;
	}

	function setCount(newCount: number) {
		count = newCount;
	}
</script>

<h2>Reactive Statements ($effect)</h2>

<div class="counter" data-testid="counter-section">
	<button onclick={handleClick} data-testid="click-button" class="click-button">
		Clicked {count}
		{count === 1 ? 'time' : 'times'}
	</button>
	<button onclick={reset} data-testid="reset-button" class="reset-button">Reset</button>
</div>

<div class="status" data-testid="status-section" data-color={color}>
	<div class="message" data-testid="message-display">{message}</div>
	<div class="count-display" data-testid="count-display">Current count: {count}</div>
</div>

<div class="effects-demo">
	<h3>Try different values:</h3>
	<div class="preset-buttons">
		<button onclick={() => setCount(3)} data-testid="set-3-button">Set to 3</button>
		<button onclick={() => setCount(5)} data-testid="set-5-button">Set to 5</button>
		<button onclick={() => setCount(8)} data-testid="set-8-button">Set to 8</button>
		<button onclick={() => setCount(12)} data-testid="set-12-button">Try to set to 12</button>
	</div>
</div>

<style>
	.counter {
		margin-bottom: 2rem;
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.click-button {
		padding: 1rem 2rem;
		font-size: 1.2rem;
		font-weight: bold;
		border: 2px solid #007acc;
		border-radius: 8px;
		background: #007acc;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.click-button:hover {
		background: #005999;
		transform: translateY(-2px);
	}

	.reset-button {
		padding: 0.75rem 1.5rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		background: white;
		cursor: pointer;
	}

	.reset-button:hover {
		background: #f5f5f5;
	}

	.status {
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
		transition: all 0.3s;
	}

	.status[data-color='normal'] {
		background: #f0f8ff;
		border: 1px solid #b0d4ff;
	}

	.status[data-color='caution'] {
		background: #fff8e1;
		border: 1px solid #ffcc02;
	}

	.status[data-color='warning'] {
		background: #fff3e0;
		border: 1px solid #ff9800;
	}

	.status[data-color='danger'] {
		background: #ffebee;
		border: 1px solid #f44336;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
		100% {
			transform: scale(1);
		}
	}

	.message {
		font-size: 1.1rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.count-display {
		font-family: monospace;
		font-size: 1rem;
		color: #666;
	}

	.effects-demo {
		padding: 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background: #fafafa;
	}

	.effects-demo h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #333;
	}

	.preset-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.preset-buttons button {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: pointer;
	}

	.preset-buttons button:hover {
		background: #f0f0f0;
	}
</style>
