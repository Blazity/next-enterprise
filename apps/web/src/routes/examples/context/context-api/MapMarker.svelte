<script lang="ts">
	import { getContext } from 'svelte';
	import type { Map } from 'mapbox-gl';
	import { mapbox, key } from '$lib/utils';

	const { getMap } = getContext<{ getMap: () => Map }>(key);
	const map = getMap();

	let { lat, lon, label } = $props<{
		lat: number;
		lon: number;
		label: string;
	}>();

	const popup = new mapbox.Popup({ offset: 25 }).setText(label);

	const marker = new mapbox.Marker().setLngLat([lon, lat]).setPopup(popup).addTo(map);
</script>
