"use client"

import { useCallback } from "react"

import Image from "next/image"

import { AnimatePresence, motion } from "framer-motion"
import { Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { useTranslation } from "react-i18next"

import { PlayButton } from "@/components/PlayButton/PlayButton"
import { seekAudio, setAudioVolume } from "@/hooks/useAudioPlayer"
import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function NowPlaying() {
  const { t } = useTranslation()
  const {
    currentlyPlaying,
    playState,
    togglePlay,
    currentTime,
    duration,
    volume,
    isMuted,
    setVolume,
    toggleMute,
    isShuffled,
    toggleShuffle,
    isRepeating,
    toggleRepeat,
    playNext,
    playPrevious,
    history,
    isBuffering,
  } = useMusicStore()
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (duration <= 0) return
      const rect = e.currentTarget.getBoundingClientRect()
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      seekAudio(fraction * duration)
    },
    [duration]
  )

  const handleProgressKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (duration <= 0) return
      const step = 5
      if (e.key === "ArrowRight") seekAudio(Math.min(duration, currentTime + step))
      else if (e.key === "ArrowLeft") seekAudio(Math.max(0, currentTime - step))
    },
    [duration, currentTime]
  )

  return (
    <AnimatePresence>
      {currentlyPlaying && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed inset-x-0 top-0 z-[60] border-b border-white/[0.06] bg-[#0d0d0d]/90 backdrop-blur-2xl backdrop-saturate-150"
        >
          {/* Subtle top glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="flex items-center gap-3 px-3 py-2 md:justify-between md:px-4">
            {/* Playback controls */}
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                className={`hidden cursor-pointer rounded-full p-2 transition-all duration-200 md:block ${
                  isShuffled ? "text-accent bg-accent/10" : "text-text-tertiary hover:text-white hover:bg-white/[0.06]"
                }`}
                aria-label={t("player.shuffle")}
                onClick={toggleShuffle}
                type="button"
              >
                <Shuffle size={15} />
              </button>
              <button
                className={`hidden rounded-full p-2 transition-all duration-200 md:block ${
                  history.length > 0
                    ? "text-text-secondary cursor-pointer hover:text-white hover:bg-white/[0.06]"
                    : "text-text-secondary cursor-not-allowed opacity-40"
                }`}
                aria-label={t("player.previous")}
                onClick={playPrevious}
                disabled={history.length === 0}
                type="button"
              >
                <SkipBack size={15} fill="currentColor" />
              </button>
              <PlayButton isPlaying={playState === PLAY_STATE.PLAYING} onToggle={togglePlay} size="sm" />
              <button
                className="text-text-secondary hidden cursor-pointer rounded-full p-2 transition-all duration-200 hover:text-white hover:bg-white/[0.06] md:block"
                aria-label={t("player.next")}
                onClick={playNext}
                type="button"
              >
                <SkipForward size={15} fill="currentColor" />
              </button>
              <button
                className={`hidden cursor-pointer rounded-full p-2 transition-all duration-200 md:block ${
                  isRepeating ? "text-accent bg-accent/10" : "text-text-tertiary hover:text-white hover:bg-white/[0.06]"
                }`}
                aria-label={t("player.repeat")}
                onClick={toggleRepeat}
                type="button"
              >
                <Repeat size={14} />
              </button>
            </div>

            {/* Song info */}
            <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-initial md:justify-center">
              <span className="text-text-tertiary hidden text-[10px] tabular-nums sm:inline">
                {formatTime(currentTime)}
              </span>
              <motion.div
                key={currentlyPlaying.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative size-10 shrink-0 overflow-hidden rounded-md shadow-lg shadow-black/30"
              >
                <Image
                  src={currentlyPlaying.albumArt}
                  alt={`${currentlyPlaying.title} album art`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
                {/* Tiny glow ring when playing */}
                {playState === PLAY_STATE.PLAYING && (
                  <div className="absolute inset-0 rounded-md ring-1 ring-accent/40" />
                )}
              </motion.div>
              <div className="min-w-0">
                <motion.p
                  key={currentlyPlaying.title}
                  initial={{ y: 4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="truncate text-sm font-semibold text-white"
                >
                  {currentlyPlaying.title}
                </motion.p>
                <p className="text-text-secondary truncate text-xs">{currentlyPlaying.artist.name}</p>
              </div>
              <span className="text-text-tertiary hidden text-[10px] tabular-nums sm:inline">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume (desktop only) */}
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={toggleMute}
                aria-label={t(isMuted ? "player.unmute" : "player.mute")}
                className="text-text-tertiary rounded-full p-1.5 transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value)
                  setVolume(v)
                  setAudioVolume(v)
                }}
                aria-label={t("player.volume")}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/10 accent-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="group relative h-[3px] w-full cursor-pointer bg-white/[0.04] transition-[height] hover:h-[5px]"
            role="slider"
            aria-label={t("player.progress")}
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            tabIndex={0}
            onClick={handleSeek}
            onKeyDown={handleProgressKeyDown}
          >
            <div
              className="bg-gradient-to-r from-accent to-accent-hover h-full transition-[width] relative"
              style={{ width: `${progress}%` }}
            >
              {/* Glow dot at progress head */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-white opacity-0 shadow-[0_0_8px_rgba(252,60,68,0.8)] transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
