"use client"

// MiniPlayer — floating glass player for 30-second iTunes previews
// Full redesign: theme-aware colors, working controls, clean layout

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { AddToPlaylistButton } from "components/AddToPlaylistButton/AddToPlaylistButton"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MaximizeIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
} from "components/icons"
import { cn } from "lib/cn"
import { formatDuration } from "lib/itunes/utils"
import { useAppStore } from "store/useAppStore"
import { usePlayerStore } from "store/usePlayerStore"

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, volume, setVolume } = usePlayerStore()
  const { isSidebarCollapsed, isFullPagePlayerOpen, setFullPagePlayerOpen } = useAppStore()
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isDragging] = useState(false)

  // Pop-out mini player state
  const [isPopped, setIsPopped] = useState(false)
  const [popPos, setPopPos] = useState({ x: 20, y: 80 })
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  
  const isDraggingRef = useRef(isDragging)
  useEffect(() => {
    isDraggingRef.current = isDragging
  }, [isDragging])

  // Load and play new track when currentTrack changes
  useEffect(() => {
    if (!currentTrack?.previewUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    audioRef.current.src = currentTrack.previewUrl
    audioRef.current.play().catch(() => {})
    setProgress(0)
    setCurrentTime(0)
  }, [currentTrack?.previewUrl])

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [isPlaying])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Sync repeat (re-attach ended listener whenever isRepeat changes)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      } else {
        usePlayerStore.getState().stop()
        setProgress(0)
        setCurrentTime(0)
      }
    }
    audio.addEventListener("ended", onEnded)
    return () => audio.removeEventListener("ended", onEnded)
  }, [isRepeat])

  // Butter-smooth progress updates via rAF
  useEffect(() => {
    let rafId: number
    const update = () => {
      const audio = audioRef.current
      if (audio && !audio.paused && !isDraggingRef.current) {
        if (audio.duration) {
          setProgress(audio.currentTime / audio.duration)
          setCurrentTime(audio.currentTime * 1000)
          setDuration(audio.duration * 1000)
        }
      }
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Cleanup
  useEffect(() => {
    return () => { audioRef.current?.pause() }
  }, [])

  if (!currentTrack) return null

  const artworkUrl = currentTrack.artworkUrl100.replace("100x100", "300x300")
  const fullArtworkUrl = currentTrack.artworkUrl100.replace("100x100", "800x800")

  // ─────── Seek helpers ───────
  function getRatioFromMouseEvent(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  }

  function seekTo(ratio: number) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = ratio * audio.duration
    setProgress(ratio)
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    seekTo(getRatioFromMouseEvent(e))
  }

  function handleSkipBack() {
    if (audioRef.current)
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5)
  }

  function handleSkipForward() {
    if (audioRef.current)
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5)
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(parseFloat(e.target.value))
  }

  // ─────── Pop-out drag ───────
  function startDrag(e: React.MouseEvent<HTMLDivElement>) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: popPos.x, origY: popPos.y }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      setPopPos({
        x: Math.max(0, dragRef.current.origX + ev.clientX - dragRef.current.startX),
        y: Math.max(0, dragRef.current.origY + ev.clientY - dragRef.current.startY),
      })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  // ─────── FULL PAGE PLAYER ───────
  const fullPagePlayerNode = isFullPagePlayerOpen ? (
      <div className="fixed inset-0 z-[200] flex flex-col bg-black animate-fade-in overflow-hidden">
        {/* Blurred art background */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={fullArtworkUrl}
            alt=""
            fill
            className="object-cover blur-[120px] scale-150 opacity-40 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Thin progress bar — very top edge */}
        <div
          className="absolute top-0 left-0 w-full h-1 bg-white/10 cursor-pointer group z-10"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-white relative"
            style={{ width: `${progress * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" />
          </div>
        </div>

        {/* Close button */}
        <div className="relative z-10 flex justify-between items-center px-8 pt-8 pb-4">
          <button
            onClick={() => setFullPagePlayerOpen(false)}
            className="size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronDownIcon width={22} height={22} />
          </button>
          <span className="text-white/60 text-sm font-medium tracking-widest uppercase">Now Playing</span>
          <AddToPlaylistButton trackId={currentTrack.trackId} />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center flex-1 px-8 pb-12 gap-6 justify-center max-w-md mx-auto w-full">
          {/* Artwork */}
          <div className={cn(
            "w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10",
            isPlaying && "animate-pulse-scale"
          )}>
            <Image
              src={fullArtworkUrl}
              alt={currentTrack.collectionName}
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Track info */}
          <div className="w-full flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-white truncate">{currentTrack.trackName}</h1>
            <button
              className="text-white/60 text-lg truncate text-left hover:text-white transition-colors"
              onClick={() => {
                setFullPagePlayerOpen(false)
                router.push(`/?view=artist_detail&id=${currentTrack.artistId}`, { scroll: false })
              }}
            >
              {currentTrack.artistName}
            </button>
          </div>

          {/* Seekbar */}
          <div className="w-full flex flex-col gap-2">
            <div
              className="w-full h-1 bg-white/20 rounded-full relative cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-white/50 tabular-nums">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={cn(
                "size-10 flex items-center justify-center rounded-full transition-colors",
                isRepeat ? "text-white bg-white/20" : "text-white/40 hover:text-white"
              )}
              title="Repeat"
            >
              <RepeatIcon width={22} height={22} />
            </button>

            <button
              onClick={handleSkipBack}
              className="size-12 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
              title="-5s"
            >
              <SkipBackIcon width={28} height={28} />
            </button>

            <button
              onClick={togglePlay}
              className="size-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl"
            >
              {isPlaying
                ? <PauseIcon width={28} height={28} />
                : <PlayIcon width={28} height={28} className="ml-1" />
              }
            </button>

            <button
              onClick={handleSkipForward}
              className="size-12 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
              title="+5s"
            >
              <SkipForwardIcon width={28} height={28} />
            </button>

            <div className="size-10" /> {/* spacer to balance repeat */}
          </div>

          {/* Volume */}
          <div className="w-full flex items-center gap-3">
            <VolumeIcon className="text-white/40 shrink-0" width={18} height={18} />
            <input
              type="range"
              min="0" max="1" step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 accent-white rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    )
  : null

  // ─────── POP-OUT MINI PLAYER ───────
  const poppedNode = isPopped ? (
      <div
        className="fixed z-[150] w-64 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        style={{ left: popPos.x, top: popPos.y }}
      >
        {/* Drag handle */}
        <div
          className="h-6 bg-surface-elevated cursor-grab active:cursor-grabbing flex items-center justify-between px-3"
          onMouseDown={startDrag}
        >
          <span className="text-[10px] font-semibold text-muted uppercase tracking-widest">Now Playing</span>
          <button
            className="text-muted hover:text-primary transition-colors"
            onClick={() => setIsPopped(false)}
          >
            ✕
          </button>
        </div>

        {/* Thin progress bar */}
        <div
          className="w-full h-[3px] bg-surface-elevated cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-3 flex items-center gap-3">
          <div className={cn(
            "size-10 rounded-lg overflow-hidden shrink-0 border border-border",
            isPlaying && "animate-pulse-scale"
          )}>
            <Image src={artworkUrl} alt={currentTrack.trackName} width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-primary truncate">{currentTrack.trackName}</span>
            <span className="text-[10px] text-muted truncate">{currentTrack.artistName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 pb-3 gap-1">
          <button onClick={handleSkipBack} className="size-8 flex items-center justify-center rounded-full text-muted hover:text-primary transition-colors">
            <SkipBackIcon width={16} height={16} />
          </button>
          <button
            onClick={togglePlay}
            className="size-9 bg-primary text-bg rounded-full flex items-center justify-center hover:opacity-90 transition-all"
          >
            {isPlaying ? <PauseIcon width={14} height={14} /> : <PlayIcon width={14} height={14} className="ml-0.5" />}
          </button>
          <button onClick={handleSkipForward} className="size-8 flex items-center justify-center rounded-full text-muted hover:text-primary transition-colors">
            <SkipForwardIcon width={16} height={16} />
          </button>
          <div className="flex items-center gap-1 flex-1 ml-1">
            <VolumeIcon className="text-muted shrink-0" width={12} height={12} />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}
              className="w-full h-0.5 accent-black dark:accent-white cursor-pointer" />
          </div>
        </div>
      </div>
    )
  : null

  // ─────── MAIN MINI PLAYER BAR ───────
  return (
    <>
      {fullPagePlayerNode}
      {poppedNode}
      <footer
        role="region"
        aria-label="Now playing"
        className={cn(
          "fixed bottom-5 z-50 bg-surface border border-border backdrop-blur-2xl shadow-card transition-all duration-300 animate-slide-up",
          "rounded-2xl",
          "left-1/2 -translate-x-1/2 w-[92%] max-w-5xl",
          "md:left-auto md:translate-x-0 md:right-5 md:max-w-none",
          isSidebarCollapsed ? "md:w-[calc(100%-120px)]" : "md:w-[calc(100%-320px)]"
        )}
      >
        {/* ── Main row ── */}
        <div className="flex items-center gap-2 px-4 py-2.5 md:px-5">

          {/* Left — artwork + info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-[28%]">
            <div className={cn(
              "size-9 md:size-10 rounded-lg overflow-hidden border border-border shrink-0",
              isPlaying && "animate-pulse-scale"
            )}>
              <Image
                src={artworkUrl}
                alt={currentTrack.collectionName}
                width={48} height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs md:text-sm font-semibold text-primary truncate flex items-center gap-1.5">
                {currentTrack.trackName}
                {isPlaying && (
                  <span className="flex items-end gap-[1.5px] h-3 shrink-0">
                    <span className="w-[2px] bg-primary animate-eq-bar-1 rounded-full" />
                    <span className="w-[2px] bg-primary animate-eq-bar-2 rounded-full" />
                    <span className="w-[2px] bg-primary animate-eq-bar-3 rounded-full" />
                  </span>
                )}
              </span>
              <button
                className="text-[11px] text-muted truncate text-left hover:text-primary transition-colors"
                onClick={() => router.push(`/?view=artist_detail&id=${currentTrack.artistId}`, { scroll: false })}
              >
                {currentTrack.artistName}
              </button>
            </div>
          </div>

          {/* Center — transport & progress (hidden on mobile) */}
          <div className="hidden md:flex flex-col items-center justify-center gap-1.5 flex-1 max-w-[40%]">
            <div className="flex items-center gap-4">
              {/* -5s */}
              <button
                onClick={handleSkipBack}
                title="-5s"
                className="size-8 flex items-center justify-center rounded-full text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
              >
                <SkipBackIcon width={18} height={18} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="size-10 bg-primary text-bg rounded-full flex items-center justify-center hover:opacity-80 transition-all shadow-sm"
              >
                {isPlaying
                  ? <PauseIcon width={14} height={14} />
                  : <PlayIcon width={14} height={14} className="ml-0.5" />
                }
              </button>

              {/* +5s */}
              <button
                onClick={handleSkipForward}
                title="+5s"
                className="size-8 flex items-center justify-center rounded-full text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
              >
                <SkipForwardIcon width={18} height={18} />
              </button>

              {/* Repeat */}
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                title={isRepeat ? "Repeat: On" : "Repeat: Off"}
                className={cn(
                  "size-8 flex items-center justify-center rounded-full transition-colors",
                  isRepeat ? "text-primary bg-primary/10" : "text-muted hover:text-primary hover:bg-surface-elevated"
                )}
              >
                <RepeatIcon width={16} height={16} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-[10px] text-muted tabular-nums">{formatDuration(currentTime)}</span>
              <div
                className="flex-1 h-1.5 bg-surface-elevated rounded-full relative cursor-pointer group"
                onClick={handleSeek}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  style={{ width: `${progress * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
                </div>
              </div>
              <span className="text-[10px] text-muted tabular-nums">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Mobile — play only */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <button
              onClick={togglePlay}
              className="size-9 bg-primary text-bg rounded-full flex items-center justify-center"
            >
              {isPlaying ? <PauseIcon width={12} height={12} /> : <PlayIcon width={12} height={12} className="ml-0.5" />}
            </button>
          </div>

          {/* Right — volume + utilities */}
          <div className="hidden md:flex items-center gap-2 md:w-[28%] justify-end">
            {/* Add to Playlist — uses the existing component, portal-rendered dropdown */}
            <AddToPlaylistButton trackId={currentTrack.trackId} />

            {/* Volume */}
            <div className="flex items-center gap-1.5 w-24 group">
              <VolumeIcon className="text-muted group-hover:text-primary shrink-0 transition-colors" width={14} height={14} />
              <input
                type="range" min="0" max="1" step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 accent-black dark:accent-white cursor-pointer rounded-full"
              />
            </div>

            <div className="w-px h-5 bg-border mx-1" />

            {/* Pop out */}
            <button
              onClick={() => setIsPopped(true)}
              title="Pop out player"
              className="size-7 flex items-center justify-center rounded-md text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
            >
              <MaximizeIcon width={15} height={15} />
            </button>

            {/* Expand to full page */}
            <button
              onClick={() => setFullPagePlayerOpen(true)}
              title="Full page player"
              className="size-7 flex items-center justify-center rounded-md text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
            >
              <ChevronUpIcon width={15} height={15} />
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
