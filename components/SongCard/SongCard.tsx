"use client"

// SongCard — wednesday-design: dark surface card, green glow on active, hover lift
// wednesday-dev: formatDuration helper, handlePlay event handler

import Image from "next/image"

import type { ItunesTrack } from "lib/itunes/types"
import { cn } from "lib/cn"

import { usePlayerStore } from "store/usePlayerStore"

interface SongCardProps {
  track: ItunesTrack
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function SongCard({ track }: SongCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore()
  const isCurrentTrack = currentTrack?.trackId === track.trackId
  const isActiveAndPlaying = isCurrentTrack && isPlaying

  function handlePlay() {
    if (!track.previewUrl) return
    if (isCurrentTrack) {
      togglePlay()
    } else {
      playTrack(track)
    }
  }

  const artworkUrl = track.artworkUrl100.replace("100x100", "300x300")

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 border",
        isCurrentTrack
          ? "bg-surface-elevated border-primary/20"
          : "border-transparent hover:bg-surface-elevated"
      )}
    >
      {/* Artwork */}
      <div className="relative shrink-0">
        <Image
          src={artworkUrl}
          alt={track.collectionName}
          width={48}
          height={48}
          className="rounded-lg block"
        />
        {isCurrentTrack && (
          <div className="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center">
            <div
              className={cn(
                "size-1.5 rounded-full bg-primary shadow-glow-sm",
                isActiveAndPlaying && "animate-pulse-glow"
              )}
            />
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate m-0", isCurrentTrack ? "text-primary" : "text-white")}>
          {track.trackName}
        </p>
        <p className="text-xs text-muted truncate mt-0.5 m-0">
          {track.artistName} · {track.collectionName}
        </p>
      </div>

      {/* Duration */}
      <span className="text-xs text-muted shrink-0 mr-2">
        {formatDuration(track.trackTimeMillis)}
      </span>

      {/* Play button */}
      <button
        onClick={handlePlay}
        disabled={!track.previewUrl}
        aria-label={isActiveAndPlaying ? "Pause" : "Play preview"}
        className={cn(
          "size-8 rounded-full border-0 flex items-center justify-center shrink-0 transition-all",
          isActiveAndPlaying ? "bg-gradient-brand shadow-glow-sm" : "bg-surface-elevated",
          !track.previewUrl && "cursor-not-allowed opacity-40"
        )}
      >
        {isActiveAndPlaying ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={isCurrentTrack ? "#4ade80" : "#a7a7a7"}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>
    </div>
  )
}
