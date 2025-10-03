<script>
	let { name, address, email } = $props();
</script>

<article class="contact-card">
	<h2>
		{#if name}
			<span>{@render name()}</span>
		{:else}
			<span class="missing">Unknown name</span>
		{/if}
	</h2>

	<div class="address">
		{#if address}
			<span>{@render address()}</span>
		{:else}
			<span class="missing">Unknown address</span>
		{/if}
	</div>

	<div class="email">
		{#if email}
			<span>{@render email()}</span>
		{:else}
			<span class="missing">Unknown email</span>
		{/if}
	</div>
</article>

<style>
	.contact-card {
		width: 300px;
		border: 1px solid #aaa;
		border-radius: 2px;
		box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
		padding: 1em;
	}

	h2 {
		padding: 0 0 0.2em 0;
		margin: 0 0 1em 0;
		border-bottom: 1px solid #ff3e00;
	}

	.address,
	.email {
		padding: 0 0 0 1.5em;
		background: 0 0 no-repeat;
		background-size: 20px 20px;
		margin: 0 0 0.5em 0;
		line-height: 1.2;
	}

	.address {
		background-image: url(/tutorial/icons/map-marker.svg);
	}
	.email {
		background-image: url(/tutorial/icons/email.svg);
	}
	.missing {
		color: #999;
	}
</style>
