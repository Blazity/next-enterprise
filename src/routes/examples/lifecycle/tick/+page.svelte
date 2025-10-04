<script lang="ts">
	import { tick } from 'svelte';

	let text = $state(`Select some text and hit the tab key to toggle uppercase`);
	let textarea = $state<HTMLTextAreaElement>();

	async function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		event.preventDefault();

		if (!textarea) return;

		const { selectionStart, selectionEnd, value } = textarea;
		const selection = value.slice(selectionStart, selectionEnd);

		const replacement = /[a-z]/.test(selection) ? selection.toUpperCase() : selection.toLowerCase();

		text = value.slice(0, selectionStart) + replacement + value.slice(selectionEnd);

		await tick();
		textarea.selectionStart = selectionStart;
		textarea.selectionEnd = selectionEnd;
	}
</script>

<textarea bind:this={textarea} bind:value={text} onkeydown={handleKeydown}></textarea>

<style>
	textarea {
		width: 100%;
		height: 200px;
	}
</style>
