<script>
	import Profile from './Profile.svelte';
</script>

<Profile>
	{#snippet name()}Bob{/snippet}
	{#snippet email()}bob@email.com{/snippet}
</Profile>

<Profile>
	{#snippet name()}Alice{/snippet}
	{#snippet phone()}12345678{/snippet}
</Profile>
