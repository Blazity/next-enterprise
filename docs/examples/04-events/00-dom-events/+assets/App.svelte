<script>
	let m = $state({ x: 0, y: 0 });

	function handleMousemove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmousemove={handleMousemove}>
	The mouse position is {m.x} x {m.y}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
