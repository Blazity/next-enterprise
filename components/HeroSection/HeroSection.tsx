"use client"

import Image from "next/image"
import { useEffect } from "react"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { SongCard } from "@/components/SongCard/SongCard"
import { useMusicStore } from "@/store/musicStore"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function HeroSection() {
  const { t } = useTranslation()
  const { featuredSongs, trendingSongs, currentlyPlaying, playState, setPlayingTrack, togglePlay, fetchPopularContent } =
    useMusicStore()

  useEffect(() => {
    fetchPopularContent()
  }, [fetchPopularContent])

  const handlePlay = (songId: string) => {
    const song = [...featuredSongs, ...trendingSongs].find((s) => s.id === songId)
    if (!song) return

    if (currentlyPlaying?.id === songId) {
      togglePlay()
    } else {
      setPlayingTrack(song)
    }
  }

  const topPicks = featuredSongs.slice(0, 3)
  const recentlyPlayed = trendingSongs.slice(0, 6)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-10">
      {/* Page title */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <h1 className="text-text-primary text-3xl font-bold tracking-tight">{t("hero.home")}</h1>
        <div className="bg-surface-elevated size-9 overflow-hidden rounded-full">
          <div className="text-text-secondary flex size-full items-center justify-center text-sm font-semibold">U</div>
        </div>
      </motion.div>

      {/* Top Picks for You */}
      <motion.section variants={fadeUp} className="space-y-4">
        <div>
          <h2 className="text-text-primary text-xl font-bold">{t("hero.topPicks")}</h2>
          <p className="text-text-tertiary text-sm">{t("hero.madeForYou")}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
            >
              <SongCard
                song={song}
                variant="featured"
                subtitle={i === 0 ? t("hero.featuredStation") : undefined}
                isPlaying={currentlyPlaying?.id === song.id && playState === "playing"}
                onPlay={() => handlePlay(song.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recently Played */}
      <motion.section variants={fadeUp} className="space-y-4">
        <div className="flex items-center gap-1">
          <h2 className="text-text-primary text-xl font-bold">{t("hero.recentlyPlayed")}</h2>
          <ChevronRight size={20} className="text-text-tertiary" />
        </div>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:-mx-0 md:px-0">
          {recentlyPlayed.map((song, i) => (
            <motion.div
              key={song.id}
              className="w-36 shrink-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.35 }}
            >
              <div className="group cursor-pointer" onClick={() => handlePlay(song.id)} role="button" tabIndex={0}>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={song.albumArt}
                    alt={`${song.title} album art`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="144px"
                  />
                  {currentlyPlaying?.id === song.id && playState === "playing" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex items-end gap-[2px]">
                        <span className="animate-eq-1 bg-accent inline-block w-[3px] rounded-full" />
                        <span className="animate-eq-2 bg-accent inline-block w-[3px] rounded-full" />
                        <span className="animate-eq-3 bg-accent inline-block w-[3px] rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 space-y-0.5">
                  <p className="text-text-primary truncate text-[13px] font-medium">{song.title}</p>
                  <p className="text-text-tertiary truncate text-[11px]">{song.artist.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
