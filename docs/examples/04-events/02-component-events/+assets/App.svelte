<script>
	import Inner from './Inner.svelte';

	function handleMessage(payload) {
		alert(payload.text);
	}
</script>

<Inner onMessage={handleMessage} />
