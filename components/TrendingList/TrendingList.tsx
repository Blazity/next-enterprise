"use client"

import { AnimatePresence, motion } from "framer-motion"
import { SearchX, TrendingUp } from "lucide-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { SongCard } from "@/components/SongCard/SongCard"
import { useMusicStore } from "@/store/musicStore"

const stagger = {
  show: { transition: { staggerChildren: 0.03 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function TrendingList() {
  const { t } = useTranslation()
  const { trendingSongs, searchQuery, currentlyPlaying, playState, setPlayingTrack, togglePlay } = useMusicStore()

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return trendingSongs

    const query = searchQuery.toLowerCase()
    return trendingSongs.filter(
      (song) => song.title.toLowerCase().includes(query) || song.artist.name.toLowerCase().includes(query)
    )
  }, [trendingSongs, searchQuery])

  const handlePlay = (songId: string) => {
    const song = trendingSongs.find((s) => s.id === songId)
    if (!song) return

    if (currentlyPlaying?.id === songId) {
      togglePlay()
    } else {
      setPlayingTrack(song)
    }
  }

  const heading = searchQuery.trim() ? t("trending.resultsFor", { query: searchQuery }) : t("trending.title")

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        {!searchQuery.trim() && (
          <div className="bg-accent flex size-7 items-center justify-center rounded-md">
            <TrendingUp size={14} className="text-white" />
          </div>
        )}
        <h2 className="text-text-primary text-lg font-bold">{heading}</h2>
      </div>

      <AnimatePresence mode="wait">
        {filteredSongs.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface-elevated flex flex-col items-center gap-3 rounded-xl py-14 text-center"
          >
            <SearchX size={32} className="text-text-tertiary" />
            <p className="text-text-tertiary text-sm">{t("trending.noResults")}</p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={stagger}
            initial="hidden"
            animate="show"
            className="bg-surface-elevated rounded-xl"
          >
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                variants={fadeUp}
                className={index < filteredSongs.length - 1 ? "border-border border-b" : ""}
              >
                <SongCard
                  song={song}
                  variant="trending"
                  rank={index + 1}
                  isPlaying={currentlyPlaying?.id === song.id && playState === "playing"}
                  onPlay={() => handlePlay(song.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
