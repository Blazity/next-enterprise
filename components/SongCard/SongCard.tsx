"use client"

// SongCard — wednesday-design: dark surface card, green glow on active, hover lift
// wednesday-dev: formatDuration helper, handlePlay event handler

import Image from "next/image"

import { AddToPlaylistButton } from "components/AddToPlaylistButton/AddToPlaylistButton"
import { EqualizerIcon, PauseIcon, PlayIcon } from "components/icons"
import { cn } from "lib/cn"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import type { ItunesTrack } from "lib/itunes/types"
import { formatDuration } from "lib/itunes/utils"
import { usePlayerStore } from "store/usePlayerStore"

interface SongCardProps {
  track: ItunesTrack
}

export function SongCard({ track }: SongCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore()
  const { requireAuth } = useRequireAuth()
  const isCurrentTrack = currentTrack?.trackId === track.trackId
  const isActiveAndPlaying = isCurrentTrack && isPlaying

  function handlePlay() {
    if (!track.previewUrl) return
    requireAuth(() => {
      if (isCurrentTrack) {
        togglePlay()
      } else {
        playTrack(track)
      }
    })
  }

  const artworkUrl = track.artworkUrl100.replace("100x100", "300x300")

  return (
    <div
      onClick={handlePlay}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border active:scale-[0.98]",
        isCurrentTrack
          ? "bg-surface-elevated border-primary/20"
          : "border-transparent hover:bg-surface-elevated/80"
      )}
    >
      {/* Artwork */}
      <div className="relative shrink-0">
        <Image
          src={artworkUrl}
          alt={track.collectionName}
          width={48}
          height={48}
          className="rounded-lg block transition-transform duration-200 group-hover:scale-105"
        />
        {isCurrentTrack ? (
          <div className="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center">
            {isActiveAndPlaying ? (
              <EqualizerIcon />
            ) : (
              <PlayIcon width={14} height={14} className="text-primary" />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <PlayIcon width={14} height={14} className="text-white" />
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

      {/* Add To Playlist button */}
      <AddToPlaylistButton trackId={track.trackId} />

      {/* Play button */}
      <button
        onClick={(e) => { e.stopPropagation(); handlePlay() }}
        disabled={!track.previewUrl}
        aria-label={isActiveAndPlaying ? "Pause" : "Play preview"}
        className={cn(
          "size-8 rounded-full border-0 flex items-center justify-center shrink-0 transition-all duration-200",
          isActiveAndPlaying
            ? "bg-gradient-brand shadow-glow-sm"
            : "bg-surface-elevated opacity-0 group-hover:opacity-100",
          !track.previewUrl && "cursor-not-allowed !opacity-40"
        )}
      >
        {isActiveAndPlaying ? (
          <PauseIcon width={12} height={12} className="text-white" />
        ) : (
          <PlayIcon width={12} height={12} className={isCurrentTrack ? "text-primary" : "text-muted"} />
        )}
      </button>
    </div>
  )
}
