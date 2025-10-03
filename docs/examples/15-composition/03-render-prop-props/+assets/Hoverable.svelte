<script>
	let { children } = $props();
	let hovering = $state();

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmouseenter={enter} onmouseleave={leave}>
	{@render children(hovering)}
</div>
