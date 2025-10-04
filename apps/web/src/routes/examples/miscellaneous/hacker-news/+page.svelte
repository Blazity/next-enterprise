<script lang="ts">
	import { onMount } from 'svelte';
	import List from './List.svelte';
	import Item from './Item.svelte';

	let item = $state<unknown>();
	let page = $state<number>();

	async function hashchange() {
		const path = window.location.hash.slice(1);

		if (path.startsWith('/item')) {
			const id = path.slice(6);
			const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
			item = await response.json();

			window.scrollTo(0, 0);
		} else if (path.startsWith('/top')) {
			page = +path.slice(5);
			item = null;
		} else {
			window.location.hash = '/top/1';
		}
	}

	onMount(hashchange);
</script>

<svelte:window onhashchange={hashchange} />

<main>
	{#if item}
		<Item {item} returnTo="#/top/{page}" />
	{:else if page}
		<List {page} />
	{/if}
</main>

<style>
	main {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
		min-height: 101vh;
		padding: 1em;
	}

	main :global(.meta) {
		color: #999;
		font-size: 12px;
		margin: 0 0 1em 0;
	}
</style>
