<script lang="ts">
	import Inner from './Inner.svelte';

	let { onMessage } = $props();
</script>

<Inner {onMessage} />
