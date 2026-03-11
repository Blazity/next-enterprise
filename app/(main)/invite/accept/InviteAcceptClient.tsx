"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import { useUser } from "@clerk/nextjs"
import { Loader2, Music } from "lucide-react"

import { syncUser } from "@/lib/services/playlistService"

type PageState = "loading" | "resolving" | "redirecting" | "error"

export default function InviteAcceptClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser()

  const [state, setState] = useState<PageState>("loading")
  const [errorMsg, setErrorMsg] = useState("")
  const processedRef = useRef(false)

  const ticket = searchParams.get("__clerk_ticket")

  // After the user is signed in, sync them and redirect to playlists
  const resolveAndRedirect = useCallback(
    async (clerkUser: NonNullable<typeof user>) => {
      if (processedRef.current) return
      processedRef.current = true
      setState("resolving")

      try {
        // Sync user to our backend DB
        await syncUser({
          id: clerkUser.id,
          username: clerkUser.username,
          emailAddresses: clerkUser.emailAddresses.map((e: { emailAddress: string }) => ({
            emailAddress: e.emailAddress,
          })),
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        })

        setState("redirecting")
        router.replace("/playlists")
      } catch (err) {
        console.error("Failed to resolve invitation:", err)
        setState("error")
        setErrorMsg("Failed to process the invitation.")
      }
    },
    [router]
  )

  useEffect(() => {
    if (!isUserLoaded) return

    if (isSignedIn && user) {
      // User is authenticated — resolve invitation and go to playlists
      resolveAndRedirect(user)
      return
    }

    // User is NOT signed in and has a ticket — redirect to Clerk sign-up
    // Clerk's <SignUp> component natively handles __clerk_ticket
    if (ticket) {
      const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent("/invite/accept")}&__clerk_ticket=${encodeURIComponent(ticket)}`
      window.location.href = signUpUrl
      return
    }

    // No ticket, not signed in — invalid link
    setState("error")
    setErrorMsg("Invalid invitation link.")
  }, [isUserLoaded, isSignedIn, user, ticket, resolveAndRedirect])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
      <div className="flex flex-col items-center gap-4 text-center">
        {state === "error" ? (
          <>
            <div className="flex size-16 items-center justify-center rounded-full bg-red-500/10">
              <Music size={28} className="text-red-400" />
            </div>
            <p className="max-w-sm text-lg font-medium text-white/60">{errorMsg}</p>
            <button
              onClick={() => router.push("/playlists")}
              className="mt-2 rounded-full bg-white/[0.08] px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.12]"
            >
              Go to Playlists
            </button>
          </>
        ) : (
          <>
            <Loader2 size={40} className="animate-spin text-purple-400" />
            <p className="text-sm text-white/60">
              {state === "loading" && "Loading..."}
              {state === "resolving" && "Setting up your playlist..."}
              {state === "redirecting" && "Taking you to your playlist..."}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
