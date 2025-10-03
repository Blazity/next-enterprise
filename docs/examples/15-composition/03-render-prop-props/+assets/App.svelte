<script>
	import Hoverable from './Hoverable.svelte';
</script>

<Hoverable>
	{#snippet children(active)}
		<div class:active>
			{#if active}
				<p>I am being hovered upon.</p>
			{:else}
				<p>Hover over me!</p>
			{/if}
		</div>
	{/snippet}
</Hoverable>

<Hoverable>
	{#snippet children(active)}
		<div class:active>
			{#if active}
				<p>I am being hovered upon.</p>
			{:else}
				<p>Hover over me!</p>
			{/if}
		</div>
	{/snippet}
</Hoverable>

<Hoverable>
	{#snippet children(active)}
		<div class:active>
			{#if active}
				<p>I am being hovered upon.</p>
			{:else}
				<p>Hover over me!</p>
			{/if}
		</div>
	{/snippet}
</Hoverable>

<style>
	div {
		padding: 1em;
		margin: 0 0 1em 0;
		background-color: #eee;
	}

	.active {
		background-color: #ff3e00;
		color: white;
	}

	p {
		pointer-events: none;
		color: black;
	}
</style>
