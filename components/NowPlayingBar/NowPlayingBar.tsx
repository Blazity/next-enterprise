"use client"

import { Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
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
      className="bg-aura-bg border-t border-white/5 fixed right-0 bottom-0 left-0 z-[60] text-white shadow-[0_-20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
    >
      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="group relative h-1 w-full cursor-pointer bg-white/5"
        onClick={handleSeek}
      >
        <div
          className="bg-aura-primary absolute inset-y-0 left-0 z-10 shadow-[0_0_15px_#ef5b1e]"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Neon Knob */}
          <div className="absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-200 border-2 border-aura-primary shadow-[0_0_10px_#ef5b1e]" />
        </div>
      </div>

      <div className="mx-auto flex h-[96px] max-w-screen-2xl items-center justify-between px-6 py-4">
        {/* Track Info */}
        <div className="flex min-w-0 flex-1 items-center gap-5">
          <div className="relative h-[64px] w-[64px] flex-shrink-0 overflow-hidden rounded-xl border-2 border-white/5 shadow-2xl group cursor-pointer">
            {albumImage ? (
              <Image
                src={albumImage.replace("100x100bb.jpg", "600x600bb.jpg")}
                alt={`${track.trackName} album art`}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-aura-surface">
                <Music className="h-6 w-6 text-aura-primary/50" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <p className="truncate text-base font-black tracking-tight text-white hover:text-aura-primary transition-colors cursor-pointer">
              {track.trackName}
            </p>
            <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.15em] text-aura-secondary/80">
              {artistNames}
            </p>
          </div>
        </div>

        {/* Controls (Center) */}
        <div className="flex max-w-[400px] flex-1 flex-col items-center justify-center">
          <div className="flex items-center gap-8 mb-2">
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
              className="flex h-14 w-14 items-center justify-center rounded-full bg-aura-primary text-white shadow-lg shadow-aura-primary/40 transition-all hover:scale-110 hover:bg-aura-accent active:scale-95"
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

        {/* Extra Controls */}
        <div className="hidden lg:flex flex-1 items-center justify-end gap-6 pl-4">
          <div className="group flex w-40 items-center gap-3 bg-white/5 p-2 px-4 rounded-full border border-white/5">
            <button onClick={toggleMute} className="text-aura-secondary hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 accent-aura-primary cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
