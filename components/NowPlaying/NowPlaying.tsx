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
  const progressContainerRef = useRef<HTMLDivElement>(null)
  const volumeContainerRef = useRef<HTMLDivElement>(null)
  const isDraggingProgress = useRef(false)
  const isDraggingVolume = useRef(false)

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

  const seekFromClientX = useCallback(
    (clientX: number) => {
      if (!progressContainerRef.current || duration <= 0) return
      const rect = progressContainerRef.current.getBoundingClientRect()
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      seekAudio(fraction * duration)
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${fraction * 100}%`
      }
    },
    [duration]
  )

  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      isDraggingProgress.current = true
      seekFromClientX(e.clientX)
      const onMove = (ev: MouseEvent) => { if (isDraggingProgress.current) seekFromClientX(ev.clientX) }
      const onUp = () => {
        isDraggingProgress.current = false
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
      }
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    },
    [seekFromClientX]
  )

  const handleProgressKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (duration <= 0) return
      const step = 5
      let newTime: number | null = null
      if (e.key === "ArrowRight") newTime = Math.min(duration, currentTime + step)
      else if (e.key === "ArrowLeft") newTime = Math.max(0, currentTime - step)
      if (newTime !== null) {
        seekAudio(newTime)
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${(newTime / duration) * 100}%`
        }
      }
    },
    [duration, currentTime]
  )

  const handleVolumeMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      isDraggingVolume.current = true
      const update = (clientX: number) => {
        if (!volumeContainerRef.current) return
        const rect = volumeContainerRef.current.getBoundingClientRect()
        const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        setVolume(frac)
        if (frac > 0 && isMuted) toggleMute()
      }
      update(e.clientX)
      const onMove = (ev: MouseEvent) => { if (isDraggingVolume.current) update(ev.clientX) }
      const onUp = () => {
        isDraggingVolume.current = false
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
      }
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    },
    [isMuted, setVolume, toggleMute]
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
              ref={progressContainerRef}
              className="absolute bottom-0 translate-y-[1px] inset-x-0 group h-[2px] hover:h-[4px] w-full cursor-pointer transition-[height] bg-white/[0.06] z-[65] overflow-visible"
              role="slider"
              aria-label={t("player.progress")}
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(currentTime)}
              tabIndex={0}
              onMouseDown={handleProgressMouseDown}
              onKeyDown={(e) => { e.stopPropagation(); handleProgressKeyDown(e) }}
            >
              <div
                ref={progressBarRef}
                className="bg-accent h-full relative shadow-[4px_0_10px_3px_rgba(6,182,212,0.45)]"
                style={{ width: `${progress}%` }}
              >
                {/* Glow dot at progress head */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-2 px-3 py-2 md:px-4 relative z-10">

              {/* LEFT — Song info */}
              <div className="flex min-w-0 items-center gap-2.5">
                <motion.div
                  key={currentlyPlaying.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative size-9 shrink-0 overflow-hidden rounded-md shadow-lg shadow-black/30"
                >
                  <Image
                    src={currentlyPlaying.albumArt}
                    alt={`${currentlyPlaying.title} album art`}
                    fill
                    className="object-cover"
                    sizes="36px"
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
                <div className="hidden shrink-0 items-center gap-1 md:flex">
                  <span className="text-text-tertiary text-[10px] tabular-nums">{formatTime(currentTime)}</span>
                  <span className="text-white/20 text-[10px]">/</span>
                  <span className="text-white/35 text-[10px] tabular-nums">{formatTime(duration)}</span>
                </div>
              </div>

              {/* CENTER — Playback controls */}
              <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  className={`hidden cursor-pointer rounded-full p-2 transition-all duration-200 md:block ${
                    isShuffled ? "text-accent bg-accent/10 ring-1 ring-accent/30" : "text-white/40 hover:text-white hover:bg-white/[0.06]"
                  }`}
                  aria-label={t("player.shuffle")}
                  onClick={toggleShuffle}
                  type="button"
                >
                  <Shuffle size={14} />
                </button>
                <button
                  className={`hidden cursor-pointer rounded-full p-2 transition-all duration-200 md:block ${
                    history.length === 0 ? "text-white/20 cursor-not-allowed" : "text-white/40 hover:text-white hover:bg-white/[0.06] active:scale-95"
                  }`}
                  aria-label={t("player.previous")}
                  onClick={playPrevious}
                  disabled={history.length === 0}
                  type="button"
                >
                  <SkipBack size={16} fill="currentColor" />
                </button>
                <PlayButton isPlaying={playState === PLAY_STATE.PLAYING} onToggle={togglePlay} size="sm" />
                <button
                  className="cursor-pointer rounded-full p-2 text-white/40 transition-all duration-200 hover:text-white hover:bg-white/[0.06] active:scale-95"
                  aria-label={t("player.next")}
                  onClick={playNext}
                  type="button"
                >
                  <SkipForward size={16} fill="currentColor" />
                </button>
                <button
                  className={`hidden cursor-pointer rounded-full p-2 transition-all duration-200 md:block ${
                    isRepeating ? "text-accent bg-accent/10 ring-1 ring-accent/30" : "text-white/40 hover:text-white hover:bg-white/[0.06]"
                  }`}
                  aria-label={t("player.repeat")}
                  onClick={toggleRepeat}
                  type="button"
                >
                  <Repeat size={14} />
                </button>
              </div>

              {/* RIGHT — Volume */}
              <div className="hidden items-center justify-end gap-2 md:flex" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={toggleMute}
                  aria-label={t(isMuted ? "player.unmute" : "player.mute")}
                  className="shrink-0 text-white/50 rounded-full p-1.5 transition-all duration-200 hover:text-white hover:bg-white/[0.06]"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <div
                  ref={volumeContainerRef}
                  className="group relative flex h-8 w-28 cursor-pointer items-center"
                  onMouseDown={handleVolumeMouseDown}
                >
                  {/* Track */}
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20 group-hover:h-1.5 transition-[height] duration-150">
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-75"
                      style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    />
                  </div>
                  {/* Thumb dot */}
                  <div
                    className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ left: `${isMuted ? 0 : volume * 100}%` }}
                  />
                </div>
                <span className="w-7 shrink-0 text-right text-[10px] tabular-nums text-white/35">
                  {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
                </span>
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
