<script>
	import Keypad from './Keypad.svelte';

	let pin = $state('');
	let view = $derived(pin ? pin.replace(/\d(?!$)/g, '•') : 'enter your pin');

	function handleSubmit() {
		alert(`submitted ${pin}`);
	}
</script>

<h1 class:pin>{view}</h1>

<Keypad bind:value={pin} onSubmit={handleSubmit} />

<style>
	h1 {
		color: #ccc;
	}
	h1.pin {
		color: #333;
	}
	:global(body.dark) h1 {
		color: #444;
	}
	:global(body.dark) h1.pin {
		color: #fff;
	}
</style>
