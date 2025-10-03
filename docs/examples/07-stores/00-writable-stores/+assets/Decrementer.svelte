<script>
	import { count } from './stores.js';

	function decrement() {
		count.update((n) => n - 1);
	}
</script>

<button onclick={decrement}> - </button>
