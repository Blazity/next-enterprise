<script lang="ts">
	let c = $state(0);
	let f = $state(32);

	function setBothFromC(value: string) {
		c = +value;
		f = +(32 + (9 / 5) * c).toFixed(1);
	}

	function setBothFromF(value: string) {
		f = +value;
		c = +((5 / 9) * (f - 32)).toFixed(1);
	}
</script>

<input
	value={c}
	oninput={(e) => setBothFromC((e.target as HTMLInputElement).value)}
	type="number"
/>
°C =
<input
	value={f}
	oninput={(e) => setBothFromF((e.target as HTMLInputElement).value)}
	type="number"
/> °F

<style>
	input {
		width: 5em;
	}
</style>
