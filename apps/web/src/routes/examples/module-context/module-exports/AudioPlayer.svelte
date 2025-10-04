<script module>
	const elements = new Set<HTMLAudioElement>();

	export function stopAll() {
		elements.forEach((element) => {
			element.pause();
		});
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let { src, title, composer, performer } = $props<{
		src: string;
		title: string;
		composer: string;
		performer: string;
	}>();

	let audio = $state<HTMLAudioElement>();
	let paused = $state(true);

	onMount(() => {
		return () => {
			if (audio) {
				elements.delete(audio);
			}
		};
	});

	function stopOthers() {
		elements.forEach((element) => {
			if (element !== audio) element.pause();
		});
	}
</script>

<article class:playing={!paused}>
	<h2>{title}</h2>
	<p><strong>{composer}</strong> / performed by {performer}</p>

	<audio bind:this={audio} bind:paused onplay={stopOthers} controls {src}></audio>
</article>

<style>
	article {
		margin: 0 0 1em 0;
		max-width: 800px;
	}
	h2,
	p {
		margin: 0 0 0.3em 0;
	}
	audio {
		width: 100%;
		margin: 0.5em 0 1em 0;
	}
	.playing {
		color: #ff3e00;
	}
</style>
