<script lang="ts">
	import { onDestroy, setContext } from 'svelte';
	import type { Map } from 'mapbox-gl';
	import { mapbox, key } from '$lib/utils';

	let { lat, lon, zoom, children } = $props<{
		lat: number;
		lon: number;
		zoom: number;
		children?: () => void;
	}>();

	let container = $state<HTMLElement>();
	let map = $state<Map>();

	setContext(key, {
		getMap: () => map
	});

	$effect(() => {
		if (container) {
			load();
		}
	});

	function load() {
		if (container) {
			map = new mapbox.Map({
				container,
				style: 'mapbox://styles/mapbox/streets-v12',
				center: [lon, lat],
				zoom
			});
		}
	}

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css" />
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
