"use client"

import { useEffect, useRef, useState } from "react"

import { useRouter } from "next/navigation"

import { useUser } from "@clerk/nextjs"
import { Loader2, Music } from "lucide-react"

import { syncUser } from "@/lib/services/playlistService"

/**
 * InviteAcceptClient — handles the post-signup redirect for Clerk invitations.
 *
 * Flow:
 * 1. User clicks invite email → Clerk hosted sign-up
 * 2. Clerk redirects to /invite/accept after sign-up
 * 3. This component syncs user (resolves pending shares) → redirects to /playlists
 * 4. Playlists page shows the shared playlist
 */
export default function InviteAcceptClient() {
  const router = useRouter()
  const { user, isLoaded, isSignedIn } = useUser()

  const [error, setError] = useState("")
  const processedRef = useRef(false)

  useEffect(() => {
    if (!isLoaded) return
    if (processedRef.current) return

    // User must be signed in (Clerk sends them here after sign-up/sign-in)
    if (!isSignedIn || !user) {
      // Not signed in — show error. This shouldn't happen in normal flow
      // because Clerk's invitation redirects here after authentication.
      setError("Please sign in first to accept this invitation.")
      return
    }

    processedRef.current = true

    // Sync user to our backend — this resolves pending playlist shares
    // by matching the user's email against pendingPlaylistShares table
    syncUser({
      id: user.id,
      username: user.username,
      emailAddresses: user.emailAddresses.map((e: { emailAddress: string }) => ({
        emailAddress: e.emailAddress,
      })),
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    })
      .then(() => {
        // Redirect to playlists — the shared playlist will be visible there
        // Feature flag (playlist-add-feature) only controls create/edit/delete
        // Viewing shared playlists works regardless of flag state
        router.replace("/playlists")
      })
      .catch((err) => {
        console.error("Failed to sync user:", err)
        // Still redirect even if sync fails — user can manually navigate
        router.replace("/playlists")
      })
  }, [isLoaded, isSignedIn, user, router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-500/10">
            <Music size={28} className="text-red-400" />
          </div>
          <p className="max-w-sm text-lg font-medium text-white/60">{error}</p>
          <button
            onClick={() => router.push("/sign-in")}
            className="mt-2 rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 size={40} className="animate-spin text-purple-400" />
        <p className="text-sm text-white/60">Setting up your playlist...</p>
      </div>
    </div>
  )
}
