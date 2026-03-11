"use client"

import { useEffect, useRef, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import { useUser } from "@clerk/nextjs"
import { Loader2, Music } from "lucide-react"

import { syncUser } from "@/lib/services/playlistService"

export default function InviteAcceptClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded, isSignedIn } = useUser()

  const [error, setError] = useState("")
  const processedRef = useRef(false)
  const redirectedRef = useRef(false)

  const ticket = searchParams.get("__clerk_ticket")

  useEffect(() => {
    if (!isLoaded) return
    if (processedRef.current) return

    // ✅ SIGNED IN → sync user and redirect to playlists
    if (isSignedIn && user) {
      processedRef.current = true

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
        .then(() => router.replace("/playlists"))
        .catch(() => router.replace("/playlists"))
      return
    }

    // ❌ NOT SIGNED IN + HAS TICKET → redirect to /sign-up with ticket
    // Clerk's <SignUp> component will process the __clerk_ticket automatically
    // After sign-up, redirect_url brings them back here
    if (ticket && !redirectedRef.current) {
      redirectedRef.current = true
      const params = new URLSearchParams()
      params.set("__clerk_ticket", ticket)
      params.set("redirect_url", "/invite/accept")
      const status = searchParams.get("__clerk_status")
      if (status) params.set("__clerk_status", status)
      window.location.href = `/sign-up?${params.toString()}`
      return
    }

    // ❌ NOT SIGNED IN + NO TICKET → invalid link
    if (!ticket) {
      setError("Invalid or expired invitation link.")
    }
  }, [isLoaded, isSignedIn, user, ticket, router, searchParams])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-500/10">
            <Music size={28} className="text-red-400" />
          </div>
          <p className="max-w-sm text-lg font-medium text-white/60">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            Go Home
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
