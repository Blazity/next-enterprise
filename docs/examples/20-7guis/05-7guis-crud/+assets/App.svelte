<!-- https://eugenkiss.github.io/7guis/tasks#crud -->

<script>
	let people = $state([
		{ first: 'Hans', last: 'Emil' },
		{ first: 'Max', last: 'Mustermann' },
		{ first: 'Roman', last: 'Tisch' }
	]);

	let prefix = $state('');
	let first = $state('');
	let last = $state('');
	let i = $state(0);

	let filteredPeople = $derived(
		prefix
			? people.filter((person) => {
					const name = `${person.last}, ${person.first}`;
					return name.toLowerCase().startsWith(prefix.toLowerCase());
				})
			: people
	);
	let selected = $derived(filteredPeople[i]);

	$effect(() => {
		reset_inputs(selected);
	});

	function create() {
		people = people.concat({ first, last });
		i = people.length - 1;
		first = last = '';
	}

	function update() {
		selected.first = first;
		selected.last = last;
		people = people;
	}

	function remove() {
		// Remove selected person from the source array (people), not the filtered array
		const index = people.indexOf(selected);
		people = [...people.slice(0, index), ...people.slice(index + 1)];

		first = last = '';
		i = Math.min(i, filteredPeople.length - 2);
	}

	function reset_inputs(person) {
		first = person ? person.first : '';
		last = person ? person.last : '';
	}
</script>

<input placeholder="filter prefix" bind:value={prefix} />

<select bind:value={i} size={5}>
	{#each filteredPeople as person, i}
		<option value={i}>{person.last}, {person.first}</option>
	{/each}
</select>

<label><input bind:value={first} placeholder="first" /></label>
<label><input bind:value={last} placeholder="last" /></label>

<div class="buttons">
	<button onclick={create} disabled={!first || !last}>create</button>
	<button onclick={update} disabled={!first || !last || !selected}>update</button>
	<button onclick={remove} disabled={!selected}>delete</button>
</div>

<style>
	* {
		font-family: inherit;
		font-size: inherit;
	}

	input {
		display: block;
		margin: 0 0 0.5em 0;
	}

	select {
		float: left;
		margin: 0 1em 1em 0;
		width: 14em;
	}

	.buttons {
		clear: both;
	}
</style>
