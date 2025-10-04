<script lang="ts">
	import Outer from './Outer.svelte';

	function handleMessage(payload: { text: string }) {
		alert(payload.text);
	}
</script>

<Outer onMessage={handleMessage} />
