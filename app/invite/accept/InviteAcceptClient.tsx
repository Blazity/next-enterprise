"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import { SignUp, useUser } from "@clerk/nextjs"
import { Loader2, Music, ListMusic } from "lucide-react"

import { syncUser } from "@/lib/services/playlistService"

type PageState = "loading" | "signup" | "resolving" | "redirecting" | "error"

export default function InviteAcceptClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser()

  const [state, setState] = useState<PageState>("loading")
  const [errorMsg, setErrorMsg] = useState("")
  const processedRef = useRef(false)

  const ticket = searchParams.get("__clerk_ticket")

  // After the user is signed in, sync them and redirect to the playlist
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

        // Check if public metadata has the playlist ID from the invitation
        const metadata = clerkUser.publicMetadata as
          | { playlistInvitationPlaylistId?: number }
          | undefined

        setState("redirecting")

        if (metadata?.playlistInvitationPlaylistId) {
          // Redirect to the specific shared playlist
          router.replace(`/playlist/${metadata.playlistInvitationPlaylistId}`)
        } else {
          // Fallback: redirect to home
          router.replace("/")
        }
      } catch (err) {
        console.error("Failed to resolve invitation:", err)
        // Even if sync fails, still redirect to home
        router.replace("/")
      }
    },
    [router]
  )

  useEffect(() => {
    if (!isUserLoaded) return

    if (isSignedIn && user) {
      // User is authenticated — resolve and redirect to the playlist
      resolveAndRedirect(user)
      return
    }

    // User is NOT signed in — show the inline sign-up form
    // Clerk's <SignUp> component reads __clerk_ticket from URL automatically
    if (ticket) {
      setState("signup")
      return
    }

    // No ticket, not signed in — invalid link
    setState("error")
    setErrorMsg("Invalid or expired invitation link.")
  }, [isUserLoaded, isSignedIn, user, ticket, resolveAndRedirect])

  // Error state
  if (state === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-500/10">
            <Music size={28} className="text-red-400" />
          </div>
          <p className="max-w-sm text-lg font-medium text-white/60">{errorMsg}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 rounded-full bg-white/[0.08] px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.12]"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Sign-up state — render Clerk's <SignUp> inline with playlist invitation context
  if (state === "signup") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628] p-4">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          {/* Invitation header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-purple-500/20">
              <ListMusic size={24} className="text-purple-400" />
            </div>
            <h1 className="text-xl font-bold text-white">You&apos;ve been invited!</h1>
            <p className="text-sm text-white/50">
              Someone shared a playlist with you. Sign up to start listening.
            </p>
          </div>

          {/* Clerk SignUp component — reads __clerk_ticket from URL automatically */}
          <SignUp
            afterSignUpUrl="/invite/accept"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/[0.08] border-white/[0.08] text-white hover:bg-white/[0.12]",
                formFieldInput: "bg-white/[0.06] border-white/[0.08] text-white",
                formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
                footerActionLink: "text-purple-400 hover:text-purple-300",
                formFieldLabel: "text-white/60",
                identityPreviewEditButton: "text-purple-400",
              },
            }}
          />
        </div>
      </div>
    )
  }

  // Loading / resolving / redirecting state
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 size={40} className="animate-spin text-purple-400" />
        <p className="text-sm text-white/60">
          {state === "loading" && "Loading..."}
          {state === "resolving" && "Setting up your playlist..."}
          {state === "redirecting" && "Taking you to your playlist..."}
        </p>
      </div>
    </div>
  )
}
