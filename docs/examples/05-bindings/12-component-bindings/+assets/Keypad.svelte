<script>
	let { value = $bindable(), onSubmit } = $props();

	const select = (num) => () => (value += num);
	const clear = () => (value = '');
</script>

<div class="keypad">
	<button onclick={select(1)}>1</button>
	<button onclick={select(2)}>2</button>
	<button onclick={select(3)}>3</button>
	<button onclick={select(4)}>4</button>
	<button onclick={select(5)}>5</button>
	<button onclick={select(6)}>6</button>
	<button onclick={select(7)}>7</button>
	<button onclick={select(8)}>8</button>
	<button onclick={select(9)}>9</button>

	<button disabled={!value} onclick={clear}>clear</button>
	<button onclick={select(0)}>0</button>
	<button disabled={!value} onclick={onSubmit}>submit</button>
</div>

<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(3, 5em);
		grid-template-rows: repeat(4, 3em);
		grid-gap: 0.5em;
	}

	button {
		margin: 0;
	}
</style>
