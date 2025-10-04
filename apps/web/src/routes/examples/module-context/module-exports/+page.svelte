<script lang="ts">
	import AudioPlayer, { stopAll } from './AudioPlayer.svelte';
</script>

<button type="button" on:click={stopAll}> stop all audio </button>

<AudioPlayer
	src="about:blank"
	title="The Blue Danube Waltz"
	composer="Johann Strauss"
	performer="European Archive"
/>

<AudioPlayer
	src="about:blank"
	title="Mars, the Bringer of War"
	composer="Gustav Holst"
	performer="USAF Heritage of America Band"
/>

<AudioPlayer
	src="about:blank"
	title="Gymnopédie no. 1"
	composer="Erik Satie"
	performer="Prodigal Procrastinator"
/>

<AudioPlayer
	src="about:blank"
	title="Symphony no. 5 in Cm, Op. 67 - I. Allegro con brio"
	composer="Ludwig van Beethoven"
	performer="European Archive"
/>

<AudioPlayer
	src="about:blank"
	title="Requiem in D minor, K. 626 - III. Sequence - Lacrymosa"
	composer="Wolfgang Amadeus Mozart"
	performer="Markus Staab"
/>
