"use client"

import { useEffect, useMemo } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { Loader2, SearchX, TrendingUp } from "lucide-react"
import { useTranslation } from "react-i18next"

import { SongCard } from "@/components/SongCard/SongCard"
import { renderFirst } from "@/lib/utils"
import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

const stagger = {
  show: { transition: { staggerChildren: 0.03 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function TrendingList() {
  const { t } = useTranslation()
  const {
    trendingSongs,
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    currentlyPlaying,
    playState,
    setPlayingTrack,
    togglePlay,
    isLoadingHome,
    homeError,
    fetchPopularContent,
  } = useMusicStore()

  useEffect(() => {
    if (trendingSongs.length === 0 && !isLoadingHome && !homeError) {
      fetchPopularContent()
    }
  }, [trendingSongs.length, isLoadingHome, homeError, fetchPopularContent])

  const displayedSongs = useMemo(() => {
    if (searchQuery.trim()) return searchResults
    return trendingSongs
  }, [searchQuery, searchResults, trendingSongs])

  const handlePlay = (songId: string) => {
    const song = displayedSongs.find((s) => s.id === songId)
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
          <div className="from-accent to-accent-hover flex size-7 items-center justify-center rounded-md bg-gradient-to-br shadow-md shadow-red-500/15">
            <TrendingUp size={14} className="text-white" />
          </div>
        )}
        <h2 className="text-text-primary text-lg font-bold">{heading}</h2>
      </div>

      <AnimatePresence mode="wait">
        {renderFirst(
          [
            isSearching || (isLoadingHome && !searchQuery.trim() && displayedSongs.length === 0),
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-surface-list flex items-center justify-center rounded-xl border border-white/[0.08] py-14 backdrop-blur-sm"
            >
              <div className="text-text-tertiary flex items-center gap-2 text-sm">
                <Loader2 size={16} className="animate-spin" />
                {t("trending.searching")}
              </div>
            </motion.div>,
          ],
          [
            !!searchError,
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-surface-list flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] py-14 text-center backdrop-blur-sm"
            >
              <p className="text-text-tertiary text-sm">{t("trending.error")}</p>
            </motion.div>,
          ],
          [
            displayedSongs.length === 0,
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-surface-list flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] py-14 text-center backdrop-blur-sm"
            >
              <SearchX size={32} className="text-text-tertiary" />
              <p className="text-text-tertiary text-sm">{t("trending.noResults")}</p>
            </motion.div>,
          ],
          [
            true,
            <motion.div
              key="list"
              variants={stagger}
              initial="hidden"
              animate="show"
              className="bg-surface-list overflow-hidden rounded-xl border border-white/[0.08] backdrop-blur-sm shadow-lg shadow-black/20"
            >
              {displayedSongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  variants={fadeUp}
                  className={index < displayedSongs.length - 1 ? "border-border border-b" : ""}
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
            </motion.div>,
          ]
        )}
      </AnimatePresence>
    </section>
  )
}
