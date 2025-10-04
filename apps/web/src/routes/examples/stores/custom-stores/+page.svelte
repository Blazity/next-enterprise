<script lang="ts">
	import { customCount as count } from '$stores';
</script>

<h1>The count is {$count}</h1>

<button type="button" onclick={count.increment}>+</button>
<button type="button" onclick={count.decrement}>-</button>
<button type="button" onclick={count.reset}>reset</button>
