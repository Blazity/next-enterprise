<script lang="ts">
	import AudioPlayer, { stopAll } from './AudioPlayer.svelte';
</script>

<button type="button" onclick={stopAll}> stop all audio </button>


<AudioPlayer
	src="https:
	title="The Blue Danube Waltz"
	composer="Johann Strauss"
	performer="European Archive"
/>


<AudioPlayer
	src="https:
	title="Mars, the Bringer of War"
	composer="Gustav Holst"
	performer="USAF Heritage of America Band"
/>


<AudioPlayer
	src="https:
	title="Gymnopédie no. 1"
	composer="Erik Satie"
	performer="Prodigal Procrastinator"
/>


<AudioPlayer
	src="https:
	title="Symphony no. 5 in Cm, Op. 67 - I. Allegro con brio"
	composer="Ludwig van Beethoven"
	performer="European Archive"
/>


<AudioPlayer
	src="https:
	title="Requiem in D minor, K. 626 - III. Sequence - Lacrymosa"
	composer="Wolfgang Amadeus Mozart"
	performer="Markus Staab"
/>
