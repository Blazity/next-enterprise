<script>
	import Inner from './Inner.svelte';

	let { onMessage } = $props();
</script>

<Inner {onMessage} />
