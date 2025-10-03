<script>
	let { name, email, phone } = $props();
</script>

<section>
	<div>Name</div>
	{@render name()}
	{#if email}
		<div>Email</div>
		{@render email()}
	{/if}
	{#if phone}
		<div>Phone</div>
		{@render phone()}
	{/if}
</section>

<style>
	section {
		width: 200px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 16px;
		box-shadow: 2px 2px 4px #dedede;
		border: 1px solid #888;
		margin-bottom: 16px;
	}
</style>
