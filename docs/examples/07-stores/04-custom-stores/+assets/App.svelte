<script>
	import { count } from './stores.js';
</script>

<h1>The count is {$count}</h1>

<button onclick={count.increment}>+</button>
<button onclick={count.decrement}>-</button>
<button onclick={count.reset}>reset</button>
