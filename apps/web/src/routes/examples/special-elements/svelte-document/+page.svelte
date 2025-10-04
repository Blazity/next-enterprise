<script lang="ts">
	let selection = $state('');

	const handleSelectionChange = (e: Event) =>
		(selection = document.getSelection()?.toString() || '');
</script>

<svelte:document onselectionchange={handleSelectionChange} />

<p>Select this text to fire events</p>
<p>Selection: {selection}</p>
