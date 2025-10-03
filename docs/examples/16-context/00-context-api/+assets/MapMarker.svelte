<script>
	import { getContext } from 'svelte';
	import { mapbox, key } from './mapbox.js';

	const { getMap } = getContext(key);
	const map = getMap();

	let { lat, lon, label } = $props();

	const popup = new mapbox.Popup({ offset: 25 }).setText(label);

	const marker = new mapbox.Marker().setLngLat([lon, lat]).setPopup(popup).addTo(map);
</script>
