<script lang="ts">
	import { fade } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import type { TransitionConfig } from '$lib/types';

	let visible = $state(true);

	function spin(node: Element, { duration }: { duration: number }): TransitionConfig {
		return {
			duration,
			css: (t: number) => {
				const eased = elasticOut(t);

				return `
					transform: scale(${eased}) rotate(${eased * 1080}deg);
					color: hsl(
						${~~(t * 360)},
						${Math.min(100, 1000 - 1000 * t)}%,
						${Math.min(50, 500 - 500 * t)}%
					);`;
			}
		};
	}
</script>

<label>
	<input type="checkbox" bind:checked={visible} />
	visible
</label>

{#if visible}
	<div class="centered" in:spin={{ duration: 8000 }} out:fade>
		<span>transitions!</span>
	</div>
{/if}

<style>
	.centered {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	span {
		position: absolute;
		transform: translate(-50%, -50%);
		font-size: 4em;
	}
</style>
