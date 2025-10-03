<script lang="ts">
	let user = $state({ loggedIn: false });

	function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>

{#if user.loggedIn}
	<button type="button" onclick={toggle}> Log out </button>
{/if}

{#if !user.loggedIn}
	<button type="button" onclick={toggle}> Log in </button>
{/if}
