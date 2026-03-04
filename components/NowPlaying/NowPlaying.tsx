"use client"

import Image from "next/image"

import { AnimatePresence, motion } from "framer-motion"
import { Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { PlayButton } from "@/components/PlayButton/PlayButton"
import { useMusicStore } from "@/store/musicStore"

export function NowPlaying() {
  const { t } = useTranslation()
  const { currentlyPlaying, playState, togglePlay } = useMusicStore()

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
          <div className="flex items-center justify-between px-4 py-2">
            {/* Left: playback controls */}
            <div className="flex items-center gap-2">
              <button className="text-text-tertiary p-1.5 transition-colors hover:text-white" aria-label={t("player.shuffle")}>
                <Shuffle size={14} />
              </button>
              <button className="text-text-secondary p-1.5 transition-colors hover:text-white" aria-label={t("player.previous")}>
                <SkipBack size={16} fill="currentColor" />
              </button>
              <PlayButton isPlaying={playState === "playing"} onToggle={togglePlay} size="sm" />
              <button className="text-text-secondary p-1.5 transition-colors hover:text-white" aria-label={t("player.next")}>
                <SkipForward size={16} fill="currentColor" />
              </button>
              <button className="text-text-tertiary p-1.5 transition-colors hover:text-white" aria-label={t("player.repeat")}>
                <Repeat size={14} />
              </button>
            </div>

            {/* Center: song info */}
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-md shadow-md">
                <Image
                  src={currentlyPlaying.albumArt}
                  alt={`${currentlyPlaying.title} album art`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">{currentlyPlaying.title}</p>
                <p className="text-text-secondary text-xs">{currentlyPlaying.artist.name}</p>
              </div>
            </div>

            {/* Right: volume */}
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-text-tertiary" />
              <div className="h-1 w-20 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-white/40" />
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-[2px] w-full bg-white/5">
            <motion.div
              className="bg-accent h-full"
              initial={{ width: "0%" }}
              animate={{ width: playState === "playing" ? "100%" : "35%" }}
              transition={playState === "playing" ? { duration: 30, ease: "linear" } : { duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
