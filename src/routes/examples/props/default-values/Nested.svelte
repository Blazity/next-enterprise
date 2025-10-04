<script lang="ts">
	let { answer = 'a mystery' } = $props<{
		answer?: string;
	}>();
</script>

<p>The answer is {answer}</p>
