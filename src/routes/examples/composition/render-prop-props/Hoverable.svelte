<script lang="ts">
	let { children } = $props<{
		children: (hovering: boolean) => void;
	}>();
	let hovering = $state(false);

	function enter() {
		hovering = true;
	}

	function leave() {
		hovering = false;
	}
</script>

<div role="button" tabindex="0" onmouseenter={enter} onmouseleave={leave}>
	{@render children(hovering)}
</div>
