"use client"

import { useEffect, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { Music2, RefreshCw, WifiOff } from "lucide-react"
import { useTranslation } from "react-i18next"

import { SongCard } from "@/components/SongCard/SongCard"
import { Spotlight } from "@/components/ui/spotlight"
import { fetchSongsBrowse } from "@/lib/services/itunesService"
import { useMusicStore } from "@/store/musicStore"
import type { Song } from "@/types/music"
import { PLAY_STATE } from "@/types/music"

const stagger = {
  show: { transition: { staggerChildren: 0.03 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function SongsPageContent() {
  const { t } = useTranslation()
  const { currentlyPlaying, playState, setPlayingTrack, togglePlay } = useMusicStore()

  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchSongsBrowse()
      setSongs(data)
    } catch {
      setError("Failed to load")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handlePlay = (songId: string) => {
    const song = songs.find((s) => s.id === songId)
    if (!song) return
    if (currentlyPlaying?.id === songId) {
      togglePlay()
    } else {
      setPlayingTrack(song, songs)
    }
  }

  return (
    <div className="relative space-y-6">
      <div className="absolute inset-x-0 top-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(6, 182, 212, 0.07)" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="from-accent to-accent-hover relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-cyan-500/20">
          <div className="from-accent/20 to-accent-hover/20 absolute inset-0 animate-pulse rounded-xl bg-gradient-to-br blur-md" />
          <Music2 size={20} className="relative z-10 text-white" />
        </div>
        <div>
          <h1 className="text-text-primary text-2xl font-bold">{t("songs.title")}</h1>
          <p className="text-text-tertiary text-sm">{t("songs.subtitle", { count: songs.length })}</p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && songs.length === 0 ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-5 py-20 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-white/[0.06]">
              <WifiOff size={24} className="text-text-tertiary" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-white">{t("hero.errorTitle")}</h2>
              <p className="text-text-tertiary max-w-xs text-sm">{t("hero.errorDescription")}</p>
            </div>
            <button
              onClick={load}
              className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:shadow-accent/30"
            >
              <RefreshCw size={14} />
              {t("hero.retry")}
            </button>
          </motion.div>
        ) : isLoading && songs.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
            role="status"
            aria-label={t("hero.loading")}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                <div className="h-4 w-5 animate-pulse rounded bg-white/10" />
                <div className="size-11 animate-pulse rounded-lg bg-white/10" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                </div>
                <div className="h-3 w-10 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={stagger}
            initial="hidden"
            animate="show"
            className="bg-surface-list overflow-hidden rounded-xl border border-white/[0.08] backdrop-blur-sm shadow-lg shadow-black/20"
          >
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                variants={fadeUp}
                className={index < songs.length - 1 ? "border-b border-white/[0.06]" : ""}
              >
                <SongCard
                  song={song}
                  variant="trending"
                  rank={index + 1}
                  isPlaying={currentlyPlaying?.id === song.id && playState === PLAY_STATE.PLAYING}
                  onPlay={() => handlePlay(song.id)}
                  showAddToPlaylist
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
