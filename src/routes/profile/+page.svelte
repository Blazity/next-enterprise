<script lang="ts">
	import ComplexUserProfileForm from '$components/ComplexUserProfileForm.svelte';

	// Page data from server load function
	export let data;
	export let form;

	// Handle form submission success
	function handleFormSubmit(event: CustomEvent) {
		console.log('Form submitted:', event.detail);
		// In a real app, you might redirect or show a success message
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
