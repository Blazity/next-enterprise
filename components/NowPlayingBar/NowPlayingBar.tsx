"use client"

import { Apple, Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { iTunesTrack } from "lib/itunes"

interface NowPlayingBarProps {
  track: iTunesTrack | null
  isPlaying: boolean
  audioRef: React.RefObject<HTMLAudioElement | null>
  onPlayPause: () => void
  onNext: () => void
  onPrev: () => void
  hasNext: boolean
  hasPrev: boolean
}

export function NowPlayingBar({
  track,
  isPlaying,
  audioRef,
  onPlayPause,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: NowPlayingBarProps) {
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setProgress(0)
      if (hasNext) {
        onNext()
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioRef, hasNext, onNext])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted, audioRef])

  if (!track) return null

  const albumImage = track.artworkUrl100
  const artistNames = track.artistName
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0

  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds || 0)
    return `0:${s.toString().padStart(2, "0")}`
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const targetTime = percent * duration
    audioRef.current.currentTime = targetTime
    setProgress(targetTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    if (newVol > 0) setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div
      id="now-playing-bar"
      className="bg-aura-darker/80 fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 text-white shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
    >
      {/* Progress Bar (Clickable) */}
      <div
        ref={progressBarRef}
        className="group relative h-1.5 w-full cursor-pointer bg-slate-800"
        onClick={handleSeek}
      >
        {/* Glow effect */}
        <div
          className="from-aura-primary to-aura-secondary absolute inset-y-0 left-0 hidden bg-gradient-to-r opacity-50 blur-[2px] transition-all duration-200 group-hover:block"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Main fill */}
        <div
          className="from-aura-primary to-aura-secondary absolute inset-y-0 left-0 z-10 bg-gradient-to-r"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Knob */}
          <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100" />
        </div>
      </div>

      <div className="mx-auto flex h-[88px] max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Track Info (Left) */}
        <div className="flex min-w-0 flex-1 items-center gap-4 pr-4">
          <div className="relative h-[56px] w-[56px] flex-shrink-0 overflow-hidden rounded-md border border-white/5 bg-slate-800 shadow-lg">
            {albumImage ? (
              <Image
                src={albumImage.replace("100x100bb.jpg", "600x600bb.jpg")}
                alt={`${track.collectionName} album art`}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600">
                <Music className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <p className="cursor-pointer truncate text-[15px] font-bold text-white hover:underline">
              {track.trackName}
            </p>
            <p className="mt-0.5 cursor-pointer truncate text-[12px] text-slate-400 transition-colors hover:text-white hover:underline">
              {artistNames}
            </p>
          </div>
        </div>

        {/* Controls (Center) */}
        <div className="flex max-w-[400px] flex-1 flex-col items-center justify-center">
          <div className="flex items-center gap-6">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="text-slate-400 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
              aria-label="Previous track"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>

            <button
              id="now-playing-play-pause"
              onClick={onPlayPause}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all hover:scale-105 hover:bg-slate-100 active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-1 h-5 w-5 fill-current" />}
            </button>

            <button
              onClick={onNext}
              disabled={!hasNext}
              className="text-slate-400 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
              aria-label="Next track"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
          </div>

          <div className="mt-2 flex w-full items-center justify-between gap-2 font-mono text-[11px] tracking-wider text-slate-400 tabular-nums">
            <span className="w-10 text-right">{formatTime(progress)}</span>
            <span className="w-10 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Extra Controls (Right) */}
        <div className="flex hidden flex-1 items-center justify-end gap-4 pl-4 sm:flex">
          {/* iTunes Link */}
          <a
            href={track.trackViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Apple className="h-3.5 w-3.5" />
            <span>Apple Music</span>
          </a>

          {/* Volume Control */}
          <div className="group flex w-32 items-center gap-2">
            <button onClick={toggleMute} className="text-slate-400 transition-colors hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <div className="relative flex h-1.5 flex-1 items-center overflow-hidden rounded-full bg-slate-700 pr-[2px] pl-[2px] transition-all group-hover:h-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div
                className="peer-hover:bg-aura-primary pointer-events-none h-1 rounded-full bg-white transition-all"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
