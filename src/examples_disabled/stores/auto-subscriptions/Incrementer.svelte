<script lang="ts">
	import { count } from '$stores';

	function increment() {
		count.update((n) => n + 1);
	}
</script>

<button type="button" onclick={increment}> + </button>
