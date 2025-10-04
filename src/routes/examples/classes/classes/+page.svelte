<script lang="ts">
	let current = $state('foo');
</script>

<button type="button" class:active={current === 'foo'} onclick={() => (current = 'foo')}>foo</button
>

<button type="button" class:active={current === 'bar'} onclick={() => (current = 'bar')}>bar</button
>

<button type="button" class:active={current === 'baz'} onclick={() => (current = 'baz')}>baz</button
>

<style>
	button {
		display: block;
	}

	.active {
		background-color: #ff3e00;
		color: white;
	}
</style>
