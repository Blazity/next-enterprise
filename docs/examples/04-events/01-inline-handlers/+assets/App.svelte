<script>
	let m = $state({ x: 0, y: 0 });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmousemove={(e) => (m = { x: e.clientX, y: e.clientY })}>
	The mouse position is {m.x} x {m.y}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
