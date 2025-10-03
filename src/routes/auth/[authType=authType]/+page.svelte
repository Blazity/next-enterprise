<script lang="ts">
	import AuthForm from '$lib/components/auth-form.svelte';
	import SubmitButton from '$lib/components/submit-button.svelte';
	import { page } from '$app/state';

	let { form } = $props();

	const signInSignUp = $derived(page.params.authType === 'signup' ? 'Sign up' : 'Sign in');
</script>

<div
	class="bg-background flex h-dvh w-screen items-start justify-center pt-12 md:items-center md:pt-0"
>
	<div class="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
		<div class="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
			<h3 class="text-xl font-semibold dark:text-zinc-50">{signInSignUp}</h3>
			<p class="text-sm text-gray-500 dark:text-zinc-400">
				Use your email and password to {signInSignUp.toLowerCase()}
			</p>
		</div>
		<AuthForm form={form ?? undefined}>
			{#snippet submitButton({ pending, success })}
				<SubmitButton {pending} {success}>{signInSignUp}</SubmitButton>
			{/snippet}

			{#if page.params.authType === 'signup'}
				{@render switchAuthType({
					question: 'Already have an account? ',
					href: '/signin',
					cta: 'Sign in',
					postscript: ' instead.'
				})}
			{:else}
				{@render switchAuthType({
					question: "Don't have an account? ",
					href: '/signup',
					cta: 'Sign up',
					postscript: ' for free.'
				})}
			{/if}
		</AuthForm>
	</div>
</div>

{#snippet switchAuthType({
	question,
	href,
	cta,
	postscript
}: {
	question: string;
	href: string;
	cta: string;
	postscript: string;
})}
	<p class="mt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
		{question}
		<a {href} class="font-semibold text-gray-800 hover:underline dark:text-zinc-200">
			{cta}
		</a>
		{postscript}
	</p>
{/snippet}
