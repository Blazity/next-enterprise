<script lang="ts">
	let name = $state('world');
	let count = $state(0);
</script>

<h1>Hello {name}!</h1>

<input bind:value={name} />
<button type="button" onclick={() => (count += 1)}>
	clicks: {count}
</button>
