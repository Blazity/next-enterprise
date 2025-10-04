<script lang="ts">
	let user = $state({
		firstname: 'Ada',
		lastname: 'Lovelace'
	});
</script>

<input bind:value={user.firstname} />
<input bind:value={user.lastname} />

<h1>Hello {user.firstname}!</h1>

<p>Open the browser console to see the debug output.</p>
<pre>{JSON.stringify(user, null, 2)}</pre>
