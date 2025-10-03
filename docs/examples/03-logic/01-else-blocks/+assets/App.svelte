<script>
	let user = $state({ loggedIn: false });

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>

{#if user.loggedIn}
	<button onclick={toggle}> Log out </button>
{:else}
	<button onclick={toggle}> Log in </button>
{/if}
