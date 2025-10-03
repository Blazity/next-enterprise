<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});
</script>

<progress value={$progress}></progress>

<button onclick={() => progress.set(0)}> 0% </button>

<button onclick={() => progress.set(0.25)}> 25% </button>

<button onclick={() => progress.set(0.5)}> 50% </button>

<button onclick={() => progress.set(0.75)}> 75% </button>

<button onclick={() => progress.set(1)}> 100% </button>

<style>
	progress {
		display: block;
		width: 100%;
	}
</style>
