<script>
	import { longpress } from './longpress.js';

	let pressed = $state(false);
	let duration = $state(2000);
</script>

<label>
	<input type="range" bind:value={duration} max={2000} step={100} />
	{duration}ms
</label>

<button
	use:longpress={duration}
	onlongpress={() => (pressed = true)}
	onmouseenter={() => (pressed = false)}>press and hold</button
>

{#if pressed}
	<p>congratulations, you pressed and held for {duration}ms</p>
{/if}
