<script lang="ts">
	let { children } = $props();
	let hovering = $state();

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<div onmouseenter={enter} onmouseleave={leave}>
	{@render children(hovering)}
</div>
