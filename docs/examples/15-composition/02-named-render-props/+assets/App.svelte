<script>
	import ContactCard from './ContactCard.svelte';
</script>

<ContactCard>
	{#snippet name()}
		P. Sherman
	{/snippet}

	{#snippet address()}
		42 Wallaby Way<br />
		Sydney
	{/snippet}
</ContactCard>
