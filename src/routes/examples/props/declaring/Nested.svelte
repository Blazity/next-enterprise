<script lang="ts">
	interface Props {
		answer: number;
	}

	let { answer }: Props = $props();
</script>

<p>The answer is {answer}</p>
