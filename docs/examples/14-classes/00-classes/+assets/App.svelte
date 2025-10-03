<script>
	let current = $state('foo');
</script>

<button class:active={current === 'foo'} onclick={() => (current = 'foo')}>foo</button>

<button class:active={current === 'bar'} onclick={() => (current = 'bar')}>bar</button>

<button class:active={current === 'baz'} onclick={() => (current = 'baz')}>baz</button>

<style>
	button {
		display: block;
	}

	.active {
		background-color: #ff3e00;
		color: white;
	}
</style>
