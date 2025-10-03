<script>
	let count = $state(0);

	$effect(() => {
		if (count >= 10) {
			alert(`count is dangerously high!`);
			count = 9;
		}
	});

	function handleClick() {
		count += 1;
	}
</script>

<button onclick={handleClick}>
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>
