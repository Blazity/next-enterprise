<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zod } from 'sveltekit-superforms/adapters';
	import { createEventDispatcher } from 'svelte';
	import type { PageData } from './$types';

	// Import our schemas and types
	import {
		userProfileFormSchema,
		externalUserDataSchema,
		completeUserProfileFormSchema,
		type UserProfileFormData,
		type ExternalUserData,
		type CompleteUserProfileFormData,
		defaultUserProfileFormValues,
		defaultExternalUserData
	} from '$schemas/user-profile';

	// Import database functions
	// NOTE: These should be called via API routes, not directly
	// import {
	// 	getUserProfile,
	// 	createUserProfile,
	// 	updateUserProfile,
	// 	fetchExternalUserData
	// } from '$db/queries';

	// Props
	export let data: PageData;
	export let userId: string;

	// Form state
	let loading = false;
	let externalDataLoading = false;
	let formData: CompleteUserProfileFormData = {
		profile: defaultUserProfileFormValues,
		externalData: defaultExternalUserData
	};

	// Initialize form with Superforms
	const { form, errors, enhance, submitting } = superForm(data.form, {
		validators: zod(completeUserProfileFormSchema),
		onSubmit: async (event) => {
			// Handle form submission
			loading = true;
			try {
				// TODO: Call API route to update user profile
				// await fetch('/api/profile', {
				// 	method: 'POST',
				// 	body: JSON.stringify(event.data.profile)
				// });

				// Show success message or redirect
				console.log('Profile updated successfully');
			} catch (error) {
				console.error('Failed to update profile:', error);
			} finally {
				loading = false;
			}
		}
	});

	// Load existing profile data
	let existingProfile: any = null;

	$: if (userId) {
		loadUserProfile();
	}

	async function loadUserProfile() {
		try {
			// TODO: Call API route to get user profile
			// const response = await fetch(`/api/profile/${userId}`);
			// existingProfile = await response.json();
			console.log('Load user profile for:', userId);
		} catch (error) {
			console.error('Failed to load user profile:', error);
		}
	}

	// Fetch external data based on profile
	async function fetchExternalData() {
		if (!existingProfile) return;

		externalDataLoading = true;
		try {
			// TODO: Call API route to fetch external data
			// const response = await fetch(`/api/profile/${userId}/external`);
			// const externalData = await response.json();
			console.log('Fetch external data');
		} catch (error) {
			console.error('Failed to fetch external data:', error);
		} finally {
			externalDataLoading = false;
		}
	}

	// Watch for profile changes to trigger external API call
	$: if (existingProfile && formData.profile.firstName && formData.profile.lastName) {
		fetchExternalData();
	}

	// Event dispatcher for parent components
	const dispatch = createEventDispatcher();

	function handleFormSubmit() {
		dispatch('submit', formData);
	}
</script>

<div class="complex-user-profile-form">
	<h1>User Profile Management</h1>

	<div class="form-container">
		<form method="POST" use:enhance onsubmit={handleFormSubmit}>
			<!-- Basic Information Section -->
			<section class="form-section">
				<h2>Basic Information</h2>

				<div class="form-grid">
					<div class="form-field">
						<label for="firstName">First Name *</label>
						<input
							type="text"
							id="firstName"
							name="profile.firstName"
							bind:value={$form.profile.firstName}
							class:error={$errors.profile?.firstName}
							required
						/>
						{#if $errors.profile?.firstName}
							<span class="error-message">{$errors.profile.firstName}</span>
						{/if}
					</div>

					<div class="form-field">
						<label for="lastName">Last Name *</label>
						<input
							type="text"
							id="lastName"
							name="profile.lastName"
							bind:value={$form.profile.lastName}
							class:error={$errors.profile?.lastName}
							required
						/>
						{#if $errors.profile?.lastName}
							<span class="error-message">{$errors.profile.lastName}</span>
						{/if}
					</div>
				</div>

				<div class="form-grid">
					<div class="form-field">
						<label for="dateOfBirth">Date of Birth</label>
						<input
							type="date"
							id="dateOfBirth"
							name="profile.dateOfBirth"
							bind:value={$form.profile.dateOfBirth}
						/>
					</div>

					<div class="form-field">
						<label for="phoneNumber">Phone Number</label>
						<input
							type="tel"
							id="phoneNumber"
							name="profile.phoneNumber"
							bind:value={$form.profile.phoneNumber}
							class:error={$errors.profile?.phoneNumber}
						/>
						{#if $errors.profile?.phoneNumber}
							<span class="error-message">{$errors.profile.phoneNumber}</span>
						{/if}
					</div>
				</div>
			</section>

			<!-- Address Section -->
			<section class="form-section">
				<h2>Address Information</h2>

				<div class="form-grid">
					<div class="form-field">
						<label for="street">Street Address</label>
						<input
							type="text"
							id="street"
							name="profile.address.street"
							value={$form.profile.address?.street || ''}
							oninput={(e) => {
								if ($form.profile.address) {
									$form.profile.address.street = e.currentTarget.value;
								}
							}}
						/>
					</div>

					<div class="form-field">
						<label for="city">City</label>
						<input
							type="text"
							id="city"
							name="profile.address.city"
							value={$form.profile.address?.city || ''}
							oninput={(e) => {
								if ($form.profile.address) {
									$form.profile.address.city = e.currentTarget.value;
								}
							}}
						/>
					</div>

					<div class="form-field">
						<label for="state">State/Province</label>
						<input
							type="text"
							id="state"
							name="profile.address.state"
							value={$form.profile.address?.state || ''}
							oninput={(e) => {
								if ($form.profile.address) {
									$form.profile.address.state = e.currentTarget.value;
								}
							}}
						/>
					</div>

					<div class="form-field">
						<label for="zipCode">ZIP/Postal Code</label>
						<input
							type="text"
							id="zipCode"
							name="profile.address.zipCode"
							value={$form.profile.address?.zipCode || ''}
							oninput={(e) => {
								if ($form.profile.address) {
									$form.profile.address.zipCode = e.currentTarget.value;
								}
							}}
						/>
					</div>
				</div>
			</section>

			<!-- Professional Information -->
			<section class="form-section">
				<h2>Professional Information</h2>

				<div class="form-field">
					<label for="experienceLevel">Experience Level</label>
					<select
						id="experienceLevel"
						name="profile.experienceLevel"
						bind:value={$form.profile.experienceLevel}
						class:error={$errors.profile?.experienceLevel}
					>
						<option value="entry">Entry Level</option>
						<option value="mid">Mid Level</option>
						<option value="senior">Senior Level</option>
						<option value="lead">Lead/Principal</option>
						<option value="executive">Executive</option>
					</select>
					{#if $errors.profile?.experienceLevel}
						<span class="error-message">{$errors.profile.experienceLevel}</span>
					{/if}
				</div>

				<div class="form-grid">
					<div class="form-field">
						<label for="industry">Industry</label>
						<input
							type="text"
							id="industry"
							name="profile.industry"
							bind:value={$form.profile.industry}
						/>
					</div>

					<div class="form-field">
						<label for="company">Company</label>
						<input
							type="text"
							id="company"
							name="profile.company"
							bind:value={$form.profile.company}
						/>
					</div>

					<div class="form-field">
						<label for="jobTitle">Job Title</label>
						<input
							type="text"
							id="jobTitle"
							name="profile.jobTitle"
							bind:value={$form.profile.jobTitle}
						/>
					</div>

					<div class="form-field">
						<label for="yearsOfExperience">Years of Experience</label>
						<input
							type="number"
							id="yearsOfExperience"
							name="profile.yearsOfExperience"
							bind:value={$form.profile.yearsOfExperience}
							min="0"
							max="50"
							class:error={$errors.profile?.yearsOfExperience}
						/>
						{#if $errors.profile?.yearsOfExperience}
							<span class="error-message">{$errors.profile.yearsOfExperience}</span>
						{/if}
					</div>
				</div>
			</section>

			<!-- Online Presence -->
			<section class="form-section">
				<h2>Online Presence</h2>

				<div class="form-field">
					<label for="linkedinUrl">LinkedIn URL</label>
					<input
						type="url"
						id="linkedinUrl"
						name="profile.linkedinUrl"
						bind:value={$form.profile.linkedinUrl}
						placeholder="https://linkedin.com/in/yourprofile"
						class:error={$errors.profile?.linkedinUrl}
					/>
					{#if $errors.profile?.linkedinUrl}
						<span class="error-message">{$errors.profile.linkedinUrl}</span>
					{/if}
				</div>

				<div class="form-field">
					<label for="githubUrl">GitHub URL</label>
					<input
						type="url"
						id="githubUrl"
						name="profile.githubUrl"
						bind:value={$form.profile.githubUrl}
						placeholder="https://github.com/yourusername"
						class:error={$errors.profile?.githubUrl}
					/>
					{#if $errors.profile?.githubUrl}
						<span class="error-message">{$errors.profile.githubUrl}</span>
					{/if}
				</div>

				<div class="form-field">
					<label for="portfolioUrl">Portfolio URL</label>
					<input
						type="url"
						id="portfolioUrl"
						name="profile.portfolioUrl"
						bind:value={$form.profile.portfolioUrl}
						placeholder="https://yourportfolio.com"
						class:error={$errors.profile?.portfolioUrl}
					/>
					{#if $errors.profile?.portfolioUrl}
						<span class="error-message">{$errors.profile.portfolioUrl}</span>
					{/if}
				</div>
			</section>

			<!-- External Data Display -->
			<section class="form-section external-data">
				<h2>External Data Analysis</h2>

				{#if externalDataLoading}
					<div class="loading-spinner">
						<p>Loading external data...</p>
					</div>
				{:else}
					<div class="external-data-grid">
						<div class="data-card">
							<h3>Credit Score</h3>
							<p class="score">{$form.externalData.creditScore}</p>
							<p class="status">
								{#if $form.externalData.creditScore >= 700}
									<span class="good">Excellent</span>
								{:else if $form.externalData.creditScore >= 650}
									<span class="fair">Good</span>
								{:else}
									<span class="poor">Needs Improvement</span>
								{/if}
							</p>
						</div>

						<div class="data-card">
							<h3>Employment Status</h3>
							<p class="status-value">{$form.externalData.employmentStatus}</p>
						</div>

						<div class="data-card">
							<h3>Income Range</h3>
							<p class="status-value">{$form.externalData.incomeRange}</p>
						</div>

						<div class="data-card">
							<h3>Risk Profile</h3>
							<p class="status-value">{$form.externalData.riskProfile}</p>
						</div>
					</div>

					{#if $form.externalData.recommendations.length > 0}
						<div class="recommendations">
							<h3>Financial Recommendations</h3>
							<ul>
								{#each $form.externalData.recommendations as recommendation}
									<li>{recommendation}</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/if}
			</section>

			<!-- Form Actions -->
			<div class="form-actions">
				<button type="submit" class="btn-primary" disabled={loading || $submitting}>
					{#if loading || $submitting}
						<span class="spinner"></span>
						Saving...
					{:else}
						Save Profile
					{/if}
				</button>

				<button type="button" class="btn-secondary" onclick={() => window.history.back()}>
					Cancel
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.complex-user-profile-form {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.form-container {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	.form-section {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.form-section:last-child {
		border-bottom: none;
	}

	.form-section h2 {
		margin-bottom: 1.5rem;
		color: #1f2937;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
	}

	.form-field label {
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #374151;
	}

	.form-field input,
	.form-field select,
	.form-field textarea {
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 1rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.form-field input:focus,
	.form-field select:focus,
	.form-field textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-field input.error,
	.form-field select.error,
	.form-field textarea.error {
		border-color: #ef4444;
	}

	.error-message {
		color: #ef4444;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.external-data {
		background: #f8fafc;
		border-radius: 8px;
		padding: 1.5rem;
	}

	.external-data-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.data-card {
		background: white;
		padding: 1rem;
		border-radius: 6px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.data-card h3 {
		margin-bottom: 0.5rem;
		color: #6b7280;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.data-card .score {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 0.25rem;
	}

	.data-card .status-value {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.good {
		color: #10b981;
	}

	.fair {
		color: #f59e0b;
	}

	.poor {
		color: #ef4444;
	}

	.recommendations {
		background: white;
		padding: 1rem;
		border-radius: 6px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.recommendations h3 {
		margin-bottom: 1rem;
		color: #374151;
	}

	.recommendations ul {
		list-style: none;
		padding: 0;
	}

	.recommendations li {
		padding: 0.5rem 0;
		padding-left: 1rem;
		position: relative;
	}

	.recommendations li::before {
		content: '•';
		color: #3b82f6;
		position: absolute;
		left: 0;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		padding-top: 2rem;
		border-top: 1px solid #e5e7eb;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: #f3f4f6;
		color: #374151;
		padding: 0.75rem 2rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-secondary:hover {
		background: #e5e7eb;
	}

	.loading-spinner {
		text-align: center;
		padding: 2rem;
	}

	.spinner {
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 2px solid #f3f4f6;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-right: 0.5rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
