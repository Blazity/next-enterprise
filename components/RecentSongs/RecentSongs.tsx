"use client"

import Image from "next/image"

import { useUser } from "@clerk/nextjs"
import { Clock, Music2, Play } from "lucide-react"

import { useMusicStore } from "@/store/musicStore"

/**
 * RecentSongs — Spotify-style horizontal scroll of recently played song cards.
 * Renders inline on the search page when the user has recent songs cached.
 */
export function RecentSongs() {
  const { user } = useUser()
  const { recentSongs, setPlayingTrack } = useMusicStore()

  if (!user || recentSongs.length === 0) return null

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-white/40" />
        <h2 className="text-sm font-semibold tracking-wide text-white/60 uppercase">
          Recent Searches
        </h2>
      </div>

      {/* Horizontal scrollable card row */}
      <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {recentSongs.map((song) => (
          <button
            key={song.id}
            type="button"
            onClick={() => setPlayingTrack(song)}
            className="group flex w-[140px] shrink-0 flex-col gap-2 rounded-xl bg-white/[0.04] p-2.5 transition-all duration-200 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-black/20 active:scale-[0.97]"
          >
            {/* Album Art */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
              {song.albumArt ? (
                <Image
                  src={song.albumArt}
                  alt={song.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="140px"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-white/5">
                  <Music2 size={28} className="text-white/20" />
                </div>
              )}

              {/* Play button overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/30">
                <div className="flex size-10 translate-y-2 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  <Play size={16} className="ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Song info */}
            <div className="min-w-0 space-y-0.5 text-left">
              <p className="truncate text-[13px] font-medium leading-tight text-white/90">
                {song.title}
              </p>
              <p className="truncate text-[11px] leading-tight text-white/45">
                {song.artist.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
