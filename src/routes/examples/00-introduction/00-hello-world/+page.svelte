<script>
	let name = $state('world');
	let count = $state(0);
</script>

<h1>Hello {name}!</h1>

<input bind:value={name} data-testid="name-input" />
<button onclick={() => (count += 1)} data-testid="count-button">
	clicks: {count}
</button>
