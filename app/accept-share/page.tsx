"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"

import { DashboardShell } from "components/DashboardShell/DashboardShell"
import { ChevronRightIcon, SpinnerIcon } from "components/icons"
import { claimShare } from "lib/api/playlists"

export default function AcceptSharePage() {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser()
  const { getToken, isLoaded: isAuthLoaded } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "nothing">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const hasClaimed = useRef(false)

  // Dummy state for DashboardShell
  const [query, setQuery] = useState("")
  const handleNavClick = (view: string) => router.push(`/?view=${view}`)

  useEffect(() => {
    async function handleClaim() {
      if (!isUserLoaded || !isAuthLoaded) return

      if (!isSignedIn) {
        const search = typeof window !== "undefined" ? window.location.search : ""
        router.replace(`/sign-up${search}${search ? '&' : '?'}redirect_url=/accept-share`)
        return
      }

      if (hasClaimed.current) return

      try {
        await user.reload()
      } catch (e) {
        console.error("[AcceptShare] reload failed", e)
      }

      const publicMetadata = user.publicMetadata as { pendingPlaylistId?: string; sharedBy?: string }
      const pendingPlaylistId = publicMetadata?.pendingPlaylistId
      const sharedBy = publicMetadata?.sharedBy

      if (!pendingPlaylistId || !sharedBy) {
        setStatus("nothing")
        setTimeout(() => {
          router.replace("/")
        }, 1500)
        return
      }

      hasClaimed.current = true
      setStatus("loading")

      try {
        const token = await getToken()
        const result = await claimShare(token, pendingPlaylistId, sharedBy)

        if (result.error) {
          setStatus("error")
          setErrorMsg(result.error)
        } else {
          setStatus("success")
        }
      } catch (err: unknown) {
        setStatus("error")
        setErrorMsg(err instanceof Error ? err.message : "Network error")
      }
    }

    handleClaim()
  }, [isUserLoaded, isAuthLoaded, isSignedIn, user, getToken, router])

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-10 animate-fade-in">
      {children}
    </div>
  )

  return (
    <DashboardShell 
      activeView="home" 
      onNavClick={handleNavClick} 
      query={query} 
      onQueryChange={setQuery}
    >
      <ContentWrapper>
        {(!isUserLoaded || !isAuthLoaded || (isSignedIn && (status === "idle" || status === "loading"))) && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
                <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full" />
                <SpinnerIcon className="animate-spin text-primary relative" width={48} height={48} />
            </div>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-primary">
                {!isSignedIn ? "Verifying Session" : "Claiming Your Playlist"}
                </h1>
                <p className="text-muted text-sm italic">Synchronizing with your library...</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-10 animate-fade-in max-w-md mx-auto relative">
            <div className="absolute -top-20 inset-x-0 flex justify-center opacity-30 pointer-events-none">
                <div className="size-64 bg-primary blur-[100px] rounded-full" />
            </div>

            <div className="relative size-32 rounded-3xl bg-surface-elevated border border-white/5 flex items-center justify-center shadow-2xl rotate-3">
                <span className="text-6xl -rotate-3">🎵</span>
                <div className="absolute -bottom-2 -right-2 size-10 rounded-full bg-primary flex items-center justify-center text-bg text-xl font-bold border-4 border-bg">
                    ✓
                </div>
            </div>
            
            <div className="space-y-3 relative">
              <h1 className="text-4xl font-black text-primary tracking-tight">Playlist Claimed!</h1>
              <p className="text-muted text-lg leading-relaxed px-4">
                We've successfully added the shared tracks to your collection. Your musical journey continues.
              </p>
            </div>

            <button 
              onClick={() => router.push("/")} 
              className="group w-full py-4 px-6 rounded-2xl bg-surface-elevated text-primary font-bold text-lg border border-white/10 hover:bg-primary/5 hover:border-white/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span>Go to My Library</span>
              <ChevronRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-8 animate-fade-in max-w-sm">
            <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-5xl">
                ✕
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary">Share Link Expired</h1>
              <p className="text-muted leading-relaxed">
                {errorMsg || "We couldn't process this claim. Please ask the owner to share the playlist with you again."}
              </p>
            </div>
            <button 
              onClick={() => router.push("/")} 
              className="px-10 py-3 rounded-xl bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-all cursor-pointer border border-white/10"
            >
              Back to Sonara
            </button>
          </div>
        )}

        {status === "nothing" && (
          <div className="flex flex-col items-center gap-4">
             <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center">
                 <SpinnerIcon className="animate-spin text-muted" width={32} height={32} />
             </div>
             <p className="text-muted">No pending playlist found. Redirecting...</p>
          </div>
        )}
      </ContentWrapper>
    </DashboardShell>
  )
}
