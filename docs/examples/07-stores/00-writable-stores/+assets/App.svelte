<script>
	import { onDestroy } from 'svelte';
	import { count } from './stores.js';
	import Incrementer from './Incrementer.svelte';
	import Decrementer from './Decrementer.svelte';
	import Resetter from './Resetter.svelte';

	let countValue = $state();

	const unsubscribe = count.subscribe((value) => {
		countValue = value;
	});

	onDestroy(unsubscribe);
</script>

<h1>The count is {countValue}</h1>

<Incrementer />
<Decrementer />
<Resetter />
