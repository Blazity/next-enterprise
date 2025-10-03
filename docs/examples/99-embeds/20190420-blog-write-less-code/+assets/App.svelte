<script>
	let a = $state(1);
	let b = $state(2);
</script>

<input type="number" bind:value={a} />
<input type="number" bind:value={b} />

<p>{a} + {b} = {a + b}</p>
