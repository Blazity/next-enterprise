import { SignIn } from "@clerk/nextjs"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>
}) {
  const { redirect_url } = await searchParams
  return (
    <SignIn
      fallbackRedirectUrl={redirect_url || "/"}
      signUpFallbackRedirectUrl={redirect_url || "/"}
    />
  )
}
