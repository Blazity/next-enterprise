"use client"

// MiniPlayer — floating glass-dark player for 30-second iTunes previews
// Audio handled via native HTMLAudioElement (no library needed)
// wednesday-design: glassmorphism, green primary controls
// wednesday-dev: audioRef suffix, useEffect for side effects

import { useEffect, useRef, useState } from "react"

import Image from "next/image"

import { CloseIcon, PauseIcon, PlayIcon } from "components/icons"
import { cn } from "lib/cn"
import { formatDuration } from "lib/itunes/utils"
import { usePlayerStore } from "store/usePlayerStore"

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, stop } = usePlayerStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Load and play new track when currentTrack changes
  useEffect(() => {
    if (!currentTrack?.previewUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.addEventListener("timeupdate", () => {
        const audio = audioRef.current
        if (!audio || !audio.duration) return
        setProgress(audio.currentTime / audio.duration)
        setCurrentTime(audio.currentTime * 1000)
        setDuration(audio.duration * 1000)
      })
      audioRef.current.addEventListener("ended", () => {
        usePlayerStore.getState().stop()
        setProgress(0)
        setCurrentTime(0)
      })
    }

    audioRef.current.src = currentTrack.previewUrl
    audioRef.current.play().catch(() => {})
    setProgress(0)
    setCurrentTime(0)
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

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
    setProgress(ratio)
  }

  return (
    <footer
      role="region"
      aria-label="Now playing"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl h-20 rounded-[40px] z-50 bg-[rgba(12,12,12,0.75)] border border-white/[0.05] backdrop-blur-2xl backdrop-saturate-150 px-8 flex items-center justify-between shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] animate-slide-up"
    >
      {/* Track info */}
      <div className="flex items-center gap-4 w-[30%] min-w-0">
        <div className={cn(
          "size-12 rounded-full overflow-hidden shadow-2xl border border-white/10 shrink-0",
          
        )}>
          <Image
            src={artworkUrl}
            alt={currentTrack.collectionName}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-white truncate">
            {currentTrack.trackName}
          </span>
          <span className="text-xs text-muted truncate">
            {currentTrack.artistName}
          </span>
        </div>
      </div>

      {/* Player controls — center */}
      <div className="flex flex-col items-center gap-3 max-w-[40%] w-full">
        <div className="flex items-center gap-8">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="size-11 bg-gradient-brand text-white rounded-full border-0 cursor-pointer flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-glow-sm"
          >
            {isPlaying ? (
              <PauseIcon width={14} height={14} className="text-white" />
            ) : (
              <PlayIcon width={14} height={14} className="text-white ml-0.5" />
            )}
          </button>

          {/* Stop / close */}
          <button
            onClick={stop}
            aria-label="Close player"
            className="size-7 rounded-full border-0 cursor-pointer bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
          >
            <CloseIcon width={12} height={12} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] text-muted font-medium tabular-nums w-8 text-right">
            {formatDuration(currentTime)}
          </span>
          <div
            className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary group-hover:bg-primary-hover rounded-full transition-[width] duration-300 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-muted font-medium tabular-nums w-8">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Right side — badge */}
      <div className="flex items-center justify-end w-[30%]">
        <span className="text-[10px] text-muted/60 uppercase tracking-[0.08em] font-medium border border-white/10 rounded-full px-3 py-1">
          30s preview
        </span>
      </div>
    </footer>
  )
}
