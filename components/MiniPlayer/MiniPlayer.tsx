"use client"

// MiniPlayer — sticky bottom player for 30-second iTunes previews
// Audio handled via native HTMLAudioElement (no library needed)
// wednesday-design: dark surface, green primary controls, inset highlight
// wednesday-dev: audioRef suffix, useEffect for side effects

import Image from "next/image"

import { useEffect, useRef, useState } from "react"

import { usePlayerStore } from "store/usePlayerStore"

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, stop } = usePlayerStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [progress, setProgress] = useState(0)

  // Load and play new track when currentTrack changes
  useEffect(() => {
    if (!currentTrack?.previewUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.addEventListener("timeupdate", () => {
        const audio = audioRef.current
        if (!audio || !audio.duration) return
        setProgress(audio.currentTime / audio.duration)
      })
      audioRef.current.addEventListener("ended", () => {
        usePlayerStore.getState().stop()
        setProgress(0)
      })
    }

    audioRef.current.src = currentTrack.previewUrl
    audioRef.current.play().catch(() => {})
    setProgress(0)
  }, [currentTrack?.previewUrl])

  // Sync play/pause state with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  if (!currentTrack) return null

  const artworkUrl = currentTrack.artworkUrl100.replace("100x100", "300x300")

  return (
    <div
      role="region"
      aria-label="Now playing"
      className="fixed bottom-0 inset-x-0 z-50 bg-surface-elevated border-t border-border backdrop-blur-md px-6 h-[72px] flex items-center gap-4 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
    >
      {/* Progress bar — top edge */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-border">
        <div
          className="h-full bg-gradient-brand transition-[width] duration-500 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Artwork */}
      <Image
        src={artworkUrl}
        alt={currentTrack.collectionName}
        width={44}
        height={44}
        className="rounded-lg shrink-0"
      />

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate m-0">
          {currentTrack.trackName}
        </p>
        <p className="text-xs text-muted truncate mt-0.5 m-0">
          {currentTrack.artistName}
        </p>
      </div>

      {/* Preview badge */}
      <span className="text-[11px] text-muted bg-surface px-2.5 py-1 rounded-full border border-border shrink-0 uppercase tracking-[0.05em]">
        30s preview
      </span>

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="size-10 rounded-full border-0 cursor-pointer bg-gradient-btn flex items-center justify-center shrink-0 shadow-glow-sm transition-all"
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      {/* Stop / close */}
      <button
        onClick={stop}
        aria-label="Close player"
        className="size-8 rounded-full border-0 cursor-pointer bg-transparent flex items-center justify-center shrink-0 text-muted hover:text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
