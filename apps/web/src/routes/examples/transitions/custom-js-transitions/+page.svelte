<script lang="ts">
	import type { TransitionConfig } from '@repo/types';

	let visible = $state(false);

	function typewriter(node: Element, { speed = 1 }: { speed?: number } = {}): TransitionConfig {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent || '';
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t: number) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

<label>
	<input type="checkbox" bind:checked={visible} />
	visible
</label>

{#if visible}
	<p transition:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}
