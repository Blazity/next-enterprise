<script lang="ts">
	let count = $state(0);
</script>

<input type="number" bind:value={count} />
<button type="button" onclick={() => (count += 1)}>count</button>
