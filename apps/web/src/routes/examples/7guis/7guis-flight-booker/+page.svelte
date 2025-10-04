<script lang="ts">
	const tomorrow = new Date(Date.now() + 86400000);

	const startValue = [
		tomorrow.getFullYear(),
		pad(tomorrow.getDate() + 1, 2),
		pad(tomorrow.getDate(), 2)
	].join('-');

	let start = $state(startValue);
	let end = $state(start);
	let isReturn = $state(false);

	let startDate = $derived(convertToDate(start));
	let endDate = $derived(convertToDate(end));

	function bookFlight() {
		const type = isReturn ? 'return' : 'one-way';

		let message = `You have booked a ${type} flight, leaving ${startDate.toDateString()}`;
		if (type === 'return') {
			message += ` and returning ${endDate.toDateString()}`;
		}

		alert(message);
	}

	function convertToDate(str: string) {
		const split = str.split('-');
		return new Date(+split[0], +split[1] - 1, +split[2]);
	}

	function pad(x: number, len: number) {
		let result = String(x);
		while (result.length < len) result = `0${result}`;
		return result;
	}
</script>

<select bind:value={isReturn}>
	<option value={false}>one-way flight</option>
	<option value={true}>return flight</option>
</select>

<input type="date" bind:value={start} />
<input type="date" bind:value={end} disabled={!isReturn} />

<button type="button" onclick={bookFlight} disabled={isReturn && startDate >= endDate}>book</button>

<style>
	select,
	input,
	button {
		display: block;
		margin: 0.5em 0;
		font-size: inherit;
	}
</style>
