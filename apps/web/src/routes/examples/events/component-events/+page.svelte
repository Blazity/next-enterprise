<script lang="ts">
	import Inner from './Inner.svelte';

	function handleMessage(payload: { text: string }) {
		alert(payload.text);
	}
</script>

<Inner onMessage={handleMessage} />
