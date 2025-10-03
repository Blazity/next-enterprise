<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import { mapbox, key } from '$utils';

	setContext(key, {
		getMap: () => map
	});

	let { lat, lon, zoom, children } = $props();

	let container = $state();
	let map = $state();

	function load() {
		map = new mapbox.Map({
			container,
			style: 'mapbox:
			center: [lon, lat],
			zoom
		});
	}

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https:
</svelte:head>

<div bind:this={container}>
	{#if map}
		{@render children?.()}
	{/if}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
