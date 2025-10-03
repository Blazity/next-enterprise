<script lang="ts">
	import Outer from './Outer.svelte';

	function handleMessage(payload) {
		alert(payload.text);
	}
</script>

<Outer onMessage={handleMessage} />
