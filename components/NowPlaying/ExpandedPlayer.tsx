"use client"

import { useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronDown, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react"
import { useTranslation } from "react-i18next"

import { PlayButton } from "@/components/PlayButton/PlayButton"
import { seekAudio } from "@/hooks/useAudioPlayer"
import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function ExpandedPlayer() {
  const { t } = useTranslation()
  const progressBarRef = useRef<HTMLDivElement>(null)
  
  const {
    currentlyPlaying,
    playState,
    togglePlay,
    currentTime,
    duration,
    isShuffled,
    toggleShuffle,
    isRepeating,
    toggleRepeat,
    playNext,
    playPrevious,
    history,
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
      (state) => state.currentTime,
      (time: number) => {
        if (progressBarRef.current && duration > 0) {
          const prog = (time / duration) * 100
          progressBarRef.current.style.width = `${prog}%`
        }
      }
    )
    return () => unsubscribe()
  }, [duration])

  if (!currentlyPlaying) return null

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-start overflow-hidden bg-black md:justify-center"
    >
      {/* Blurred Album Art Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentlyPlaying.albumArt}
          alt="Background blur"
          fill
          className="object-cover opacity-60 blur-3xl saturate-200 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
      </div>

      <div className="relative z-10 flex h-full w-full max-w-lg flex-col px-6 pb-8 pt-12 md:h-auto md:max-h-[90vh] md:rounded-3xl md:px-10 md:py-10 md:shadow-2xl">
        
        {/* Header - Close Button (chevron down) */}
        <div className="flex w-full shrink-0 items-center justify-between mb-4 md:mb-8">
          <button
            onClick={() => setExpanded(false)}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={t("player.closeExpanded")}
          >
            <ChevronDown size={28} />
          </button>
          <div className="text-xs font-medium uppercase tracking-widest text-white/50">
            {t("player.nowPlaying", "NOW PLAYING")}
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Large Album Art (Dynamically sizing to fit screen) */}
        <div className="relative mb-6 flex-1 min-h-[0px] w-full flex items-center justify-center">
          <motion.div 
            animate={{ scale: playState === PLAY_STATE.PLAYING ? 1 : 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative shrink-0 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:rounded-2xl overflow-hidden"
            style={{ 
              width: "100%",
              maxWidth: "400px",
              aspectRatio: "1 / 1",
              maxHeight: "100%"
            }}
          >
          <Image
            src={currentlyPlaying.albumArt}
            alt={currentlyPlaying.title}
            fill
            className="object-cover"
            priority
          />
          </motion.div>
        </div>

        {/* Track Info */}
        <div className="mb-6 flex w-full shrink-0 flex-col">
          <h2 className="truncate text-3xl font-bold text-white md:text-4xl">
            {currentlyPlaying.title}
          </h2>
          <p className="truncate text-base text-white/70 md:text-lg">
            {currentlyPlaying.artist.name}
          </p>
        </div>

        {/* Dedicated Progress Scrubber */}
        <div className="mb-4 w-full shrink-0">
          <div
            className="group relative h-1.5 w-full cursor-pointer rounded-full bg-white/20 transition-all hover:h-2"
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
              ref={progressBarRef}
              className="absolute left-0 top-0 h-full rounded-full bg-white transition-none"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100" />
            </div>
          </div>
          <div className="mt-2 flex w-full justify-between text-xs font-medium text-white/50 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(duration - currentTime)}</span>
          </div>
        </div>

        {/* Main Playback Controls */}
        <div className="flex w-full shrink-0 items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`p-3 transition-colors ${
              isShuffled ? "text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" : "text-white/50 hover:text-white"
            }`}
            aria-label={t("player.shuffle")}
          >
            <Shuffle size={24} />
          </button>

          <button
            onClick={playPrevious}
            disabled={history.length === 0}
            className={`p-3 transition-colors ${
              history.length === 0 ? "text-white/20 cursor-not-allowed" : "text-white hover:text-white/80 active:scale-95"
            }`}
            aria-label={t("player.previous")}
          >
            <SkipBack size={36} fill="currentColor" />
          </button>

          <div className="scale-125 md:scale-150 transition-transform hover:scale-[1.3] md:hover:scale-[1.6]">
            <PlayButton isPlaying={playState === PLAY_STATE.PLAYING} onToggle={togglePlay} size="lg" />
          </div>

          <button
            onClick={playNext}
            className="p-3 text-white transition-all hover:text-white/80 active:scale-95"
            aria-label={t("player.next")}
          >
            <SkipForward size={36} fill="currentColor" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-3 transition-colors ${
              isRepeating ? "text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" : "text-white/50 hover:text-white"
            }`}
            aria-label={t("player.repeat")}
          >
            <Repeat size={24} />
          </button>
        </div>

      </div>
    </motion.div>
  )
}
