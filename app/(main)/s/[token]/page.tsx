"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { useUser } from "@clerk/nextjs"
import { ArrowLeft, BookmarkCheck, BookmarkPlus, Clock, ListMusic, Loader2, Music, User } from "lucide-react"
import { useTranslation } from "react-i18next"

import { claimPlaylistByToken, getPlaylistByToken, type Playlist } from "@/lib/services/playlistService"
import { useMusicStore } from "@/store/musicStore"
import { usePlaylistStore } from "@/store/playlistStore"
import { useShareLinkStore } from "@/store/shareLinkStore"
import { PLAY_STATE } from "@/types/music"

type PageState = "loading" | "preview" | "not-found"
type SaveState = "idle" | "saving" | "saved" | "already"

export default function ShareLinkPage() {
  const { t } = useTranslation()
  const { token } = useParams<{ token: string }>()
  const { user, isLoaded: isUserLoaded } = useUser()
  const router = useRouter()

  const [state, setState] = useState<PageState>("loading")
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [saveState, setSaveState] = useState<SaveState>("idle")

  const { currentlyPlaying, playState, setPlayingTrack, togglePlay } = useMusicStore()
  const { fetchPlaylists } = usePlaylistStore()
  const { setShareLink, clearShareLink } = useShareLinkStore()

  // Fetch the playlist metadata by token
  useEffect(() => {
    if (!token) return
    let cancelled = false

    getPlaylistByToken(token)
      .then((data) => {
        if (!cancelled) {
          setPlaylist(data)
          setState("preview")
          setShareLink(token, data.owner_name || null)
        }
      })
      .catch(() => {
        if (!cancelled) setState("not-found")
      })

    return () => {
      cancelled = true
      clearShareLink()
    }
  }, [token, setShareLink, clearShareLink])

  const handlePlaySong = useCallback(
    (song: NonNullable<Playlist["songs"]>[number]) => {
      if (!song) return
      const mapped = {
        id: song.track_id,
        title: song.title,
        artist: { id: song.artist_name, name: song.artist_name },
        albumArt: song.album_art || "/placeholder.png",
        duration: song.duration || 0,
        previewUrl: song.preview_url || undefined,
        collectionName: song.collection_name || undefined,
      }
      if (currentlyPlaying?.id === mapped.id) {
        togglePlay()
      } else {
        setPlayingTrack(mapped)
      }
    },
    [currentlyPlaying, togglePlay, setPlayingTrack]
  )

  const handleSave = useCallback(async () => {
    if (!user?.id || !token || saveState !== "idle") return
    setSaveState("saving")
    try {
      const { playlist_id } = await claimPlaylistByToken(token, user.id)
      setSaveState("saved")
      clearShareLink()
      await fetchPlaylists(user.id)
      router.push(`/playlist/${playlist_id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.toLowerCase().includes("already")) {
        setSaveState("already")
      } else {
        setSaveState("idle")
      }
    }
  }, [user?.id, token, saveState, fetchPlaylists, router, clearShareLink])

  // --- Loading state ---
  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-sm text-white/60">{t("share.preview.loading")}</p>
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

  const songs = playlist?.songs || []
  const isSignedIn = isUserLoaded && !!user

  // --- Signed-in: full inline playlist view ---
  if (isSignedIn && playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628] px-4 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Top nav: back + save */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => router.push("/playlists")}
              className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Playlists
            </button>
            <button
              onClick={handleSave}
              disabled={saveState !== "idle"}
              className="flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 text-sm text-white/70 transition-all hover:border-white/[0.2] hover:text-white disabled:opacity-60"
            >
              {saveState === "saving" && <><Loader2 size={15} className="animate-spin" /> Saving…</>}
              {saveState === "saved" && <><BookmarkCheck size={15} className="text-green-400" /> <span className="text-green-400">Saved to Library</span></>}
              {saveState === "already" && <><BookmarkCheck size={15} className="text-white/40" /> Already in Library</>}
              {saveState === "idle" && <><BookmarkPlus size={15} /> Save to Library</>}
            </button>
          </div>

          {/* Owner attribution */}
          <div className="mb-6 flex items-center gap-2 text-sm text-white/50">
            <User size={14} />
            <span>{playlist.owner_name ? `${playlist.owner_name}'s playlist` : "Shared playlist"}</span>
          </div>

          {/* Playlist header */}
          <div className="mb-8 flex items-start gap-5">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 shadow-lg shadow-purple-500/10">
              <ListMusic size={36} className="text-purple-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
              {playlist.description && (
                <p className="mt-1 text-sm text-white/50">{playlist.description}</p>
              )}
              <p className="mt-2 text-xs text-white/40">
                {t("playlist.songs", { count: songs.length })}
              </p>
            </div>
          </div>

          {/* Song list */}
          {songs.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/[0.04]">
                <Music size={28} className="text-white/20" />
              </div>
              <p className="text-lg font-medium text-white/60">{t("playlist.emptySongs")}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl bg-white/[0.03]">
              {songs.map((song, index) => {
                const isPlaying = currentlyPlaying?.id === song.track_id && playState === PLAY_STATE.PLAYING
                return (
                  <div
                    key={song.id}
                    className={`group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04] ${
                      index < songs.length - 1 ? "border-b border-white/[0.06]" : ""
                    }`}
                  >
                    <span
                      className={`w-5 text-center text-sm tabular-nums ${
                        isPlaying ? "font-bold text-purple-400" : "text-white/30"
                      }`}
                    >
                      {index + 1}
                    </span>

                    <button
                      onClick={() => handlePlaySong(song)}
                      className="relative size-11 shrink-0 overflow-hidden rounded-lg"
                    >
                      {song.album_art ? (
                        <Image
                          src={song.album_art}
                          alt={`${song.title} album art`}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-white/[0.06]">
                          <Music size={18} className="text-white/30" />
                        </div>
                      )}
                      {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="flex items-end gap-[2px]">
                            <span className="animate-eq-1 inline-block w-[3px] rounded-full bg-purple-400" />
                            <span className="animate-eq-2 inline-block w-[3px] rounded-full bg-purple-400" />
                            <span className="animate-eq-3 inline-block w-[3px] rounded-full bg-purple-400" />
                          </div>
                        </div>
                      )}
                    </button>

                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handlePlaySong(song)}>
                      <p className={`truncate text-[13px] font-medium ${isPlaying ? "text-purple-400" : "text-white/80"}`}>
                        {song.title}
                      </p>
                      <p className="truncate text-xs text-white/40">{song.artist_name}</p>
                    </div>

                    {song.duration != null && (
                      <span className="flex items-center gap-1 text-xs tabular-nums text-white/30">
                        <Clock size={12} />
                        {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // --- Not signed in: Preview card with sign-up CTA ---
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
                {playlist?.owner_name
                  ? `${playlist.owner_name}'s playlist`
                  : t("share.preview.title")}
              </p>
              <h1 className="text-2xl font-bold text-white">{playlist?.name}</h1>
              {playlist?.description && (
                <p className="mt-1 text-sm text-white/50">{playlist.description}</p>
              )}
            </div>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/60">
              {t("share.preview.songCount", { count: songs.length })}
            </span>
          </div>

          {/* Song preview list (first 5) */}
          {songs.length > 0 && (
            <div className="border-t border-white/[0.06] px-4 py-3">
              {songs.slice(0, 5).map((song, i) => (
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
              {songs.length > 5 && (
                <p className="px-2 py-1 text-xs text-white/30">
                  +{songs.length - 5} more
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
