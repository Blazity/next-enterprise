"use client"

import { useCallback, useEffect, useState } from "react"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { useUser } from "@clerk/nextjs"
import { ListMusic, Music } from "lucide-react"
import { useTranslation } from "react-i18next"

import { claimPlaylistByToken, getPlaylistByToken, type Playlist } from "@/lib/services/playlistService"

type PageState = "loading" | "preview" | "claiming" | "not-found"

export default function ShareLinkPage() {
  const { t } = useTranslation()
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()

  const [state, setState] = useState<PageState>("loading")
  const [playlist, setPlaylist] = useState<Playlist | null>(null)

  // Fetch the playlist metadata by token
  useEffect(() => {
    if (!token) return
    let cancelled = false

    getPlaylistByToken(token)
      .then((data) => {
        if (!cancelled) {
          setPlaylist(data)
          setState("preview")
        }
      })
      .catch(() => {
        if (!cancelled) setState("not-found")
      })

    return () => { cancelled = true }
  }, [token])

  // If user is signed in and playlist loaded, auto-claim
  const handleClaim = useCallback(async () => {
    if (!user?.id || !token) return
    setState("claiming")
    try {
      const result = await claimPlaylistByToken(token, user.id)
      router.push(`/shared-playlists/${result.playlist_id}`)
    } catch {
      setState("not-found")
    }
  }, [user?.id, token, router])

  useEffect(() => {
    if (isUserLoaded && user?.id && state === "preview") {
      handleClaim()
    }
  }, [isUserLoaded, user?.id, state, handleClaim])

  // --- Loading state ---
  if (state === "loading" || (state === "claiming")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-sm text-white/60">
            {state === "claiming" ? t("share.preview.claiming") : t("share.preview.loading")}
          </p>
        </div>
      </div>
    )
  }

  // --- Not found / expired ---
  if (state === "not-found") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-white/[0.06]">
            <Music size={28} className="text-white/30" />
          </div>
          <p className="text-lg font-medium text-white/60">{t("share.preview.notFound")}</p>
          <Link
            href="/sign-in"
            className="mt-2 rounded-full bg-white/[0.08] px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.12]"
          >
            {t("share.preview.signIn")}
          </Link>
        </div>
      </div>
    )
  }

  // --- Preview (user not signed in) ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-white/[0.06] to-transparent px-6 pb-6 pt-8">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fc3c44]/30 to-[#f472b6]/20 shadow-lg shadow-[#fc3c44]/10">
              <ListMusic size={36} className="text-[#fc3c44]" />
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
                {t("share.preview.title")}
              </p>
              <h1 className="text-2xl font-bold text-white">{playlist?.name}</h1>
              {playlist?.description && (
                <p className="mt-1 text-sm text-white/50">{playlist.description}</p>
              )}
            </div>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/60">
              {t("share.preview.songCount", { count: playlist?.song_count || 0 })}
            </span>
          </div>

          {/* Song preview list (first 5) */}
          {playlist?.songs && playlist.songs.length > 0 && (
            <div className="border-t border-white/[0.06] px-4 py-3">
              {playlist.songs.slice(0, 5).map((song, i) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2"
                >
                  <span className="w-4 text-center text-xs text-white/30">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/80">{song.title}</p>
                    <p className="truncate text-xs text-white/40">{song.artist_name}</p>
                  </div>
                </div>
              ))}
              {playlist.songs.length > 5 && (
                <p className="px-2 py-1 text-xs text-white/30">
                  +{playlist.songs.length - 5} more
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-white/[0.06] p-6">
            <Link
              href={`/sign-up?redirect_url=${encodeURIComponent(`/s/${token}`)}`}
              className="block w-full rounded-full bg-gradient-to-r from-[#fc3c44] to-[#f472b6] py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#fc3c44]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#fc3c44]/30"
            >
              {t("share.preview.signUp")}
            </Link>
            <Link
              href={`/sign-in?redirect_url=${encodeURIComponent(`/s/${token}`)}`}
              className="mt-3 block w-full rounded-full border border-white/[0.1] py-3 text-center text-sm font-medium text-white/70 transition-colors hover:border-white/[0.2] hover:text-white"
            >
              {t("share.preview.signIn")}
            </Link>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#fc3c44] to-[#f472b6]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="white" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white/40">Streamify</span>
        </div>
      </div>
    </div>
  )
}
