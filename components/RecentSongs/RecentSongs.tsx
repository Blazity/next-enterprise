"use client"

import Image from "next/image"

import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Clock, Music2, Pause, Play, X } from "lucide-react"

import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

/**
 * RecentSongs — Spotify-style horizontal scroll of recently played song cards.
 * Renders inline on the search page when the user has recent songs cached.
 */
export function RecentSongs() {
  const { user } = useUser()
  const { recentSongs, removeRecentSong, currentlyPlaying, playState, setPlayingTrack, togglePlay } = useMusicStore()
  const isPlaying = playState === PLAY_STATE.PLAYING

  if (!user || !recentSongs || recentSongs.length === 0) return null

  const handlePlay = (song: typeof recentSongs[0]) => {
    if (currentlyPlaying?.id === song.id) {
      togglePlay()
    } else {
      setPlayingTrack(song)
    }
  }

  const handleDelete = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation()
    removeRecentSong(user.id, songId)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-white/[0.06]">
          <Clock size={13} className="text-white/50" />
        </div>
        <h2 className="text-sm font-semibold tracking-wide text-white/60 uppercase">
          Recent Searches
        </h2>
      </div>

      {/* Horizontal scrollable card row */}
      <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {recentSongs.map((song, i) => (
          <motion.button
            key={song.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            type="button"
            onClick={() => handlePlay(song)}
            className="group flex w-[140px] shrink-0 flex-col gap-2 rounded-xl border border-transparent bg-white/[0.04] p-2.5 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.08] hover:shadow-lg hover:shadow-black/20 active:scale-[0.97]"
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

              {/* Top-right delete button overlay */}
              <button
                type="button"
                aria-label="Remove from recent searches"
                onClick={(e) => handleDelete(e, song.id)}
                className="absolute top-1 right-1 z-10 flex size-6 items-center justify-center rounded-full bg-black/40 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/60 hover:text-white group-hover:opacity-100"
              >
                <X size={14} />
              </button>

              {/* Play/Pause button overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/30">
                <div className="flex size-10 translate-y-2 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-xl shadow-accent/30 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  {currentlyPlaying?.id === song.id && isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} className="ml-0.5" fill="currentColor" />
                  )}
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
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}
