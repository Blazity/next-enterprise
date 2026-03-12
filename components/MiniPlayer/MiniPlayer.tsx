"use client"

// MiniPlayer — floating glass-dark player for 30-second iTunes previews
// Audio handled via native HTMLAudioElement (no library needed)
// wednesday-design: glassmorphism, green primary controls
// wednesday-dev: audioRef suffix, useEffect for side effects

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { CloseIcon, PauseIcon, PlayIcon } from "components/icons"
import { cn } from "lib/cn"
import { formatDuration } from "lib/itunes/utils"
import { usePlayerStore } from "store/usePlayerStore"

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, stop } = usePlayerStore()
  const router = useRouter()
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
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl h-auto min-h-[80px] py-3 rounded-3xl md:rounded-[40px] z-50 bg-[rgba(245,245,240,0.05)] border border-white/[0.05] backdrop-blur-2xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] animate-slide-up"
    >
      {/* Track info */}
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-[30%] min-w-0">
        <div className={cn(
          "size-10 md:size-12 rounded-full overflow-hidden shadow-2xl border border-white/10 shrink-0",
          
        )}>
          <Image
            src={artworkUrl}
            alt={currentTrack.collectionName}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium text-white truncate">
            {currentTrack.trackName}
          </span>
          <span 
            className="text-xs text-muted truncate hover:text-primary cursor-pointer transition-colors"
            onClick={() => router.push(`/?view=artist_detail&id=${currentTrack.artistId}`, { scroll: false })}
          >
            {currentTrack.artistName}
          </span>
        </div>
        
        {/* Mobile controls inside track info area to save space if needed */}
        <div className="flex md:hidden items-center gap-2">
           <button
            onClick={togglePlay}
            className="size-10 bg-gradient-brand text-[#111111] rounded-full flex items-center justify-center shadow-glow-sm border-0"
          >
            {isPlaying ? <PauseIcon width={12} height={12} /> : <PlayIcon width={12} height={12} className="ml-0.5" />}
          </button>
          <button onClick={stop} className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 border-0">
            <CloseIcon width={12} height={12} />
          </button>
        </div>
      </div>

      {/* Player controls — center (hidden on small mobile, using the ones in track info) */}
      <div className="hidden md:flex flex-col items-center gap-3 max-w-[40%] w-full">
        <div className="flex items-center gap-8">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="size-11 bg-gradient-brand text-[#111111] rounded-full border-0 cursor-pointer flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-glow-sm"
          >
            {isPlaying ? (
              <PauseIcon width={14} height={14} className="text-[#111111]" />
            ) : (
              <PlayIcon width={14} height={14} className="text-[#111111] ml-0.5" />
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

        {/* Progress bar — visible on all, but wider on mobile */}
        <div className="flex md:hidden items-center gap-3 w-full mt-1">
           <span className="text-[9px] text-muted tabular-nums">
            {formatDuration(currentTime)}
          </span>
          <div
            className="flex-1 h-1 bg-white/10 rounded-full relative cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[9px] text-muted tabular-nums">
            {formatDuration(duration)}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 w-full">
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

      {/* Right side — badge, hidden on mobile */}
      <div className="hidden md:flex items-center justify-end w-[30%]">
        <span className="text-[10px] text-muted/60 uppercase tracking-[0.08em] font-medium border border-white/10 rounded-full px-3 py-1">
          30s preview
        </span>
      </div>
    </footer>
  )
}
