<script>
	let c = $state(0);
	let f = $state(32);

	function setBothFromC(value) {
		c = +value;
		f = +(32 + (9 / 5) * c).toFixed(1);
	}

	function setBothFromF(value) {
		f = +value;
		c = +((5 / 9) * (f - 32)).toFixed(1);
	}
</script>

<!-- https://eugenkiss.github.io/7guis/tasks/#temp -->
<input value={c} oninput={(e) => setBothFromC(e.target.value)} type="number" /> °C =
<input value={f} oninput={(e) => setBothFromF(e.target.value)} type="number" /> °F

<style>
	input {
		width: 5em;
	}
</style>
