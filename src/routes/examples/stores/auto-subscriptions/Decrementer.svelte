<script lang="ts">
	import { count } from '$stores';

	function decrement() {
		count.update((n) => n - 1);
	}
</script>

<button type="button" onclick={decrement}> - </button>
