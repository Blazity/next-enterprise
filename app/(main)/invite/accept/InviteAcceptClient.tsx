"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import { useClerk, useSignIn, useSignUp, useUser } from "@clerk/nextjs"
import { Loader2, Music } from "lucide-react"

import { resolveInvitation, syncUser } from "@/lib/services/playlistService"

type PageState = "loading" | "authenticating" | "resolving" | "redirecting" | "error"

export default function InviteAcceptClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setActive } = useClerk()
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser()
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
  const { signIn, isLoaded: isSignInLoaded } = useSignIn()

  const [state, setState] = useState<PageState>("loading")
  const [errorMsg, setErrorMsg] = useState("")
  const processedRef = useRef(false)

  const ticket = searchParams.get("__clerk_ticket")
  const status = searchParams.get("__clerk_status")

  // After authentication completes, resolve the invitation and redirect to the playlist
  const resolveAndRedirect = useCallback(
    async (clerkId: string, clerkUser?: typeof user) => {
      setState("resolving")
      try {
        // Sync user to our DB first
        if (clerkUser) {
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
        }

        // Clerk puts the publicMetadata on the user after invitation acceptance.
        const metadata = clerkUser?.publicMetadata as
          | { playlistInvitationPlaylistId?: number; playlistInvitationSharedBy?: string }
          | undefined

        if (metadata?.playlistInvitationPlaylistId) {
          // We have the playlist ID directly from metadata — resolve via backend
          // to create the share record
          const invitationId = searchParams.get("__clerk_invitation_id")
          if (invitationId) {
            await resolveInvitation(invitationId, clerkId)
          }
          setState("redirecting")
          router.replace(`/playlist/${metadata.playlistInvitationPlaylistId}`)
          return
        }

        // Fallback: redirect to playlists page
        setState("redirecting")
        router.replace("/playlists")
      } catch (err) {
        console.error("Failed to resolve invitation:", err)
        setState("error")
        setErrorMsg("Failed to process the invitation. The link may have expired.")
      }
    },
    [router, searchParams]
  )

  useEffect(() => {
    if (processedRef.current) return
    if (!isUserLoaded || !isSignUpLoaded || !isSignInLoaded) return

    // If already signed in and no ticket, just resolve
    if (isSignedIn && !ticket) {
      processedRef.current = true
      resolveAndRedirect(user!.id, user!)
      return
    }

    if (!ticket) {
      setState("error")
      setErrorMsg("Invalid invitation link. No ticket found.")
      return
    }

    processedRef.current = true

    const processTicket = async () => {
      setState("authenticating")

      try {
        if (status === "sign_up" || !status) {
          // New user — create account via ticket
          const result = await signUp!.create({ strategy: "ticket", ticket })

          if (result.status === "complete" && result.createdSessionId) {
            // Set the session as active so the user is logged in
            await setActive({ session: result.createdSessionId })
            // Give Clerk a moment to propagate the session, then redirect
            setTimeout(() => {
              window.location.href = `/invite/accept?resolved=1`
            }, 500)
          } else {
            setState("error")
            setErrorMsg("Account creation did not complete. Please try signing up manually.")
          }
        } else if (status === "sign_in") {
          // Existing user — sign in via ticket
          const result = await signIn!.create({ strategy: "ticket", ticket })

          if (result.status === "complete" && result.createdSessionId) {
            // Set the session as active so the user is logged in
            await setActive({ session: result.createdSessionId })
            setTimeout(() => {
              window.location.href = `/invite/accept?resolved=1`
            }, 500)
          } else {
            setState("error")
            setErrorMsg("Sign-in did not complete. Please try signing in manually.")
          }
        } else if (status === "complete") {
          if (isSignedIn && user) {
            resolveAndRedirect(user.id, user)
          } else {
            setState("loading")
          }
        }
      } catch (err) {
        console.error("Ticket auth error:", err)
        setState("error")
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Failed to process invitation. The link may have expired or already been used."
        )
      }
    }

    processTicket()
  }, [
    isUserLoaded,
    isSignUpLoaded,
    isSignInLoaded,
    isSignedIn,
    user,
    ticket,
    status,
    signUp,
    signIn,
    resolveAndRedirect,
  ])

  // Handle the "resolved=1" redirect after sign-in
  useEffect(() => {
    if (searchParams.get("resolved") === "1" && isUserLoaded && isSignedIn && user) {
      resolveAndRedirect(user.id, user)
    }
  }, [searchParams, isUserLoaded, isSignedIn, user, resolveAndRedirect])

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
              {state === "authenticating" && "Setting up your account..."}
              {state === "resolving" && "Finding your playlist..."}
              {state === "redirecting" && "Taking you to your playlist..."}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
