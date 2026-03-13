"use client"

import { useCallback, useEffect, useRef } from "react"

import Image from "next/image"

import { AnimatePresence, motion } from "framer-motion"
import { Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { useTranslation } from "react-i18next"

import { PlayButton } from "@/components/PlayButton/PlayButton"
import { seekAudio } from "@/hooks/useAudioPlayer"
import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

import { ExpandedPlayer } from "./ExpandedPlayer"

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function NowPlaying() {
  const { t } = useTranslation()
  const progressBarRef = useRef<HTMLDivElement>(null)
  
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
    isExpanded,
    setExpanded,
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

  useEffect(() => {
    const unsubscribe = useMusicStore.subscribe(
      (state) => {
        if (progressBarRef.current && duration > 0) {
          const prog = (state.currentTime / duration) * 100
          progressBarRef.current.style.width = `${prog}%`
        }
      }
    )
    return () => unsubscribe()
  }, [duration])

  return (
    <>
      <AnimatePresence>
        {currentlyPlaying && !isExpanded && (
          <motion.div
            key="mini-player"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-0 top-0 z-[60] bg-[#0d0d0d]/90 backdrop-blur-2xl backdrop-saturate-150 cursor-pointer shadow-xl shadow-black/20"
            onClick={() => setExpanded(true)}
          >
            {/* Subtle top glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            {/* Progress bar absolutely positioned at the bottom of the mini-player */}
            <div
              className="absolute bottom-0 translate-y-[1px] inset-x-0 group h-[2px] hover:h-[4px] w-full cursor-pointer transition-[height] bg-white/[0.06] z-[65]"
              role="slider"
              aria-label={t("player.progress")}
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(currentTime)}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                handleSeek(e)
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                handleProgressKeyDown(e)
              }}
            >
              <div
                ref={progressBarRef}
                className="bg-gradient-to-r from-accent to-accent-hover h-full relative"
                style={{ width: `${progress}%` }}
              >
                {/* Glow dot at progress head */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-white opacity-0 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-opacity group-hover:opacity-100" />
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 md:justify-between md:px-4 relative z-10">
              {/* Playback controls */}
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  className={`hidden cursor-pointer rounded-full p-2 transition-all duration-200 md:block ${
                    isShuffled ? "text-[#00e5ff] bg-[#00e5ff]/10 shadow-[0_0_15px_rgba(0,229,255,0.4)] ring-1 ring-[#00e5ff]/30" : "text-text-tertiary hover:text-white hover:bg-white/[0.06]"
                  }`}
                  aria-label={t("player.shuffle")}
                  onClick={(e) => { e.stopPropagation(); toggleShuffle(); }}
                  type="button"
                >
                  <Shuffle size={15} />
                </button>
                <button
                  className={`hidden cursor-pointer rounded-full p-2 transition-all duration-200 md:block ${
                    history.length === 0 ? "text-white/20 cursor-not-allowed" : "text-text-tertiary hover:text-white hover:bg-white/[0.06] active:scale-95"
                  }`}
                  aria-label={t("player.previous")}
                  onClick={(e) => { e.stopPropagation(); playPrevious(); }}
                  disabled={history.length === 0}
                  type="button"
                >
                  <SkipBack size={15} fill="currentColor" />
                </button>
                <div onClick={(e) => e.stopPropagation()}>
                  <PlayButton isPlaying={playState === PLAY_STATE.PLAYING} onToggle={togglePlay} size="sm" />
                </div>
                <button
                  className="cursor-pointer rounded-full p-2 text-text-tertiary transition-all duration-200 hover:text-white hover:bg-white/[0.06] active:scale-95"
                  aria-label={t("player.next")}
                  onClick={(e) => { e.stopPropagation(); playNext(); }}
                  type="button"
                >
                  <SkipForward size={15} fill="currentColor" />
                </button>
                <button
                  className={`hidden cursor-pointer rounded-full p-2 transition-all duration-200 md:block ${
                    isRepeating ? "text-[#00e5ff] bg-[#00e5ff]/10 shadow-[0_0_15px_rgba(0,229,255,0.4)] ring-1 ring-[#00e5ff]/30" : "text-text-tertiary hover:text-white hover:bg-white/[0.06]"
                  }`}
                  aria-label={t("player.repeat")}
                  onClick={(e) => { e.stopPropagation(); toggleRepeat(); }}
                  type="button"
                >
                  <Repeat size={14} />
                </button>
              </div>

              {/* Track info */}
              <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden md:flex-initial md:justify-center px-4">
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

              {/* Volume */}
              <div className="hidden items-center gap-2 md:flex" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={toggleMute}
                  aria-label={t(isMuted ? "player.unmute" : "player.mute")}
                  className="text-text-tertiary rounded-full p-1.5 transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div 
                  className="group relative flex h-full w-24 cursor-pointer items-center" 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                    setVolume(frac)
                    if (frac > 0 && isMuted) toggleMute()
                  }}
                >
                  <div className="absolute inset-y-0 left-0 flex w-full items-center">
                    <div className="h-1 w-full rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                      />
                    </div>
                    <div
                      className="absolute left-0 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)] opacity-0 group-hover:opacity-100"
                      style={{ left: `${isMuted ? 0 : volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && <ExpandedPlayer />}
      </AnimatePresence>
    </>
  )
}
