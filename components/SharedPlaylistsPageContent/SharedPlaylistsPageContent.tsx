"use client"

import { useEffect } from "react"

import Link from "next/link"

import { useUser } from "@clerk/nextjs"
import { Share2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { usePlaylistStore } from "@/store/playlistStore"

export function SharedPlaylistsPageContent() {
  const { t } = useTranslation()
  const { user } = useUser()
  const { sharedPlaylists, isLoading, error, fetchSharedPlaylists } = usePlaylistStore()

  useEffect(() => {
    if (user?.id) {
      fetchSharedPlaylists(user.id)
    }
  }, [user?.id, fetchSharedPlaylists])

  if (isLoading && sharedPlaylists.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-accent size-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t("share.sharedWithMe")}</h1>
        <p className="text-text-tertiary mt-1 text-sm">Playlists that others have shared with you</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      {sharedPlaylists.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
          <Share2 size={48} className="mb-4 text-white/20" />
          <p className="text-lg font-medium text-white/60">Nothing shared yet</p>
          <p className="text-text-tertiary mt-1 text-sm">
            When someone shares a playlist with you, it will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sharedPlaylists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className="group relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5">
                <Share2 size={22} className="text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{playlist.name}</p>
                <p className="text-text-tertiary truncate text-xs">
                  Shared by: {playlist.shared_by_name?.trim() || playlist.shared_by_email || "Unknown"}
                </p>
              </div>
              <span className="text-text-tertiary text-xs">{playlist.song_count || 0} songs</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
