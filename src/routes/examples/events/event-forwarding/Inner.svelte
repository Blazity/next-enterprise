<script lang="ts">
	let { onMessage } = $props();

	function sayHello() {
		onMessage({ text: 'Hello!' });
	}
</script>

<button type="button" onclick={sayHello}> Click to say hello </button>
