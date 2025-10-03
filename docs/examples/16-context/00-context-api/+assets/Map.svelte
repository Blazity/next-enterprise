<script>
	import { onDestroy, setContext } from 'svelte';
	import { mapbox, key } from './mapbox.js';

	setContext(key, {
		getMap: () => map
	});

	let { lat, lon, zoom, children } = $props();

	let container = $state();
	let map = $state();

	function load() {
		map = new mapbox.Map({
			container,
			style: 'mapbox://styles/mapbox/streets-v9',
			center: [lon, lat],
			zoom
		});
	}

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css" onload={load} />
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
