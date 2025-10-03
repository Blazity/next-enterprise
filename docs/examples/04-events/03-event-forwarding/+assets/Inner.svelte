<script>
	let { onMessage } = $props();

	function sayHello() {
		onMessage({ text: 'Hello!' });
	}
</script>

<button onclick={sayHello}> Click to say hello </button>
