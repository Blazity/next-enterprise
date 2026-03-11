import { SignUp } from "@clerk/nextjs"

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>
}) {
  const { redirect_url } = await searchParams
  return (
    <SignUp
      fallbackRedirectUrl={redirect_url || "/"}
      signInFallbackRedirectUrl={redirect_url || "/"}
    />
  )
}
