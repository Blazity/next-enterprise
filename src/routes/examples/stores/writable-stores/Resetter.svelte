<script lang="ts">
	import { count } from '$stores';

	function reset() {
		count.set(0);
	}
</script>

<button type="button" onclick={reset}> reset </button>
