<script lang="ts">
	let m = $state({ x: 0, y: 0 });
</script>

<div
	role="button"
	tabindex="0"
	onmousemove={(e: MouseEvent) => (m = { x: e.clientX, y: e.clientY })}
>
	The mouse position is {m.x} x {m.y}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
