<script lang="ts">
	import ComplexUserProfileForm from '$components/ComplexUserProfileForm.svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let data: any;

	function handleFormSubmit(event: CustomEvent) {
		console.log('Form submitted:', event.detail);

		alert('Profile updated successfully!');
	}
</script>

<svelte:head>
	<title>User Profile - My App</title>
	<meta name="description" content="Manage your user profile and view external data analysis" />
</svelte:head>

<div class="page-container">
	<ComplexUserProfileForm {data} userId={data.userId} on:submit={handleFormSubmit} />
</div>

<style>
	.page-container {
		min-height: 100vh;
		background: #f8fafc;
		padding: 1rem;
	}

	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
