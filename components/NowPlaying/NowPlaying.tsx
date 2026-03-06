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
  const { currentlyPlaying, playState, togglePlay, currentTime, duration, volume, isMuted, setVolume, toggleMute } =
    useMusicStore()
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
          className="border-border bg-surface-sidebar/95 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 px-3 py-2 md:justify-between md:px-4">
            {/* Playback controls */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                className="text-text-tertiary hidden cursor-not-allowed p-1.5 opacity-40 md:block"
                aria-label={t("player.shuffle")}
                title={t("player.comingSoon")}
                disabled
              >
                <Shuffle size={14} />
              </button>
              <button
                className="text-text-secondary hidden cursor-not-allowed p-1.5 opacity-40 md:block"
                aria-label={t("player.previous")}
                title={t("player.comingSoon")}
                disabled
              >
                <SkipBack size={16} fill="currentColor" />
              </button>
              <PlayButton isPlaying={playState === PLAY_STATE.PLAYING} onToggle={togglePlay} size="sm" />
              <button
                className="text-text-secondary hidden cursor-not-allowed p-1.5 opacity-40 md:block"
                aria-label={t("player.next")}
                title={t("player.comingSoon")}
                disabled
              >
                <SkipForward size={16} fill="currentColor" />
              </button>
              <button
                className="text-text-tertiary hidden cursor-not-allowed p-1.5 opacity-40 md:block"
                aria-label={t("player.repeat")}
                title={t("player.comingSoon")}
                disabled
              >
                <Repeat size={14} />
              </button>
            </div>

            {/* Song info */}
            <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-initial md:justify-center">
              <span className="text-text-tertiary hidden text-[10px] tabular-nums sm:inline">
                {formatTime(currentTime)}
              </span>
              <div className="relative size-10 shrink-0 overflow-hidden rounded-md shadow-md">
                <Image
                  src={currentlyPlaying.albumArt}
                  alt={`${currentlyPlaying.title} album art`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{currentlyPlaying.title}</p>
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
                className="text-text-tertiary p-1 transition-colors hover:text-white"
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
            className="group h-[3px] w-full cursor-pointer bg-white/5 transition-[height] hover:h-[5px]"
            role="slider"
            aria-label={t("player.progress")}
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            tabIndex={0}
            onClick={handleSeek}
            onKeyDown={handleProgressKeyDown}
          >
            <div className="bg-accent h-full transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
