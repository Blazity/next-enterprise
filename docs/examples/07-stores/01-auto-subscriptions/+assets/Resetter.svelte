<script>
	import { count } from './stores.js';

	function reset() {
		count.set(0);
	}
</script>

<button onclick={reset}> reset </button>
