<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { LP_GRID_ITEMS } from '$lib/data/lp-items';
</script>

<svelte:head>
	<title>SvelteKit Enterprise Boilerplate</title>
	<meta
		name="description"
		content="Jumpstart your enterprise project with our feature-packed, high-performance SvelteKit boilerplate! Experience rapid UI development, AI-powered code reviews, and an extensive suite of tools for a smooth and enjoyable development process."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:url" content="https://sveltekit-enterprise.vercel.app/" />
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png"
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<section class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">SvelteKit Enterprise Boilerplate</h1>
			<p class="py-6">
				Jumpstart your enterprise project with our feature-packed, high-performance SvelteKit
				boilerplate! Experience rapid UI development, AI-powered code reviews, and an extensive
				suite of tools for a smooth and enjoyable development process.
			</p>
			<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
				<Button href="https://github.com/Blazity/next-enterprise">Get started</Button>
				<Button
					href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
					intent="secondary"
				>
					Deploy Now
				</Button>
			</div>
		</div>
	</div>
</section>

<section class="bg-base-100 py-16">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each LP_GRID_ITEMS as item}
				<div class="card bg-base-100 shadow-xl transition-shadow hover:shadow-2xl">
					<div class="card-body items-center text-center">
						<div
							class="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full"
						>
							<div class="h-8 w-8">
								{@html item.icon}
							</div>
						</div>
						<h3 class="card-title justify-center text-lg font-semibold">{item.title}</h3>
						<p class="text-base-content/70 text-sm">{item.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
