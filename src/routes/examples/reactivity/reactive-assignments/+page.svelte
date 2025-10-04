<script lang="ts">
	let count = $state(0);

	function handleClick() {
		count += 1;
	}
</script>

<button type="button" onclick={handleClick}>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>
