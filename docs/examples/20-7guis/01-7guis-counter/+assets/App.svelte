<!-- https://eugenkiss.github.io/7guis/tasks#counter -->
<script>
	let count = $state(0);
</script>

<input type="number" bind:value={count} />
<button onclick={() => (count += 1)}>count</button>
