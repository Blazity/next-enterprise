"use client"

import { useEffect } from "react"

import Image from "next/image"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { SongCard } from "@/components/SongCard/SongCard"
import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

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
  const {
    featuredSongs,
    trendingSongs,
    currentlyPlaying,
    playState,
    setPlayingTrack,
    togglePlay,
    fetchPopularContent,
    isLoadingHome,
  } = useMusicStore()

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

  if (isLoadingHome && featuredSongs.length === 0) {
    return (
      <div className="space-y-10" aria-label={t("hero.loading")} role="status">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-white/10" />
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square w-full animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-36 shrink-0 space-y-2">
                <div className="aspect-square w-full animate-pulse rounded-lg bg-white/5" />
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-10">
      {/* Page title */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <h1 className="text-text-primary text-3xl font-bold tracking-tight">{t("hero.home")}</h1>
      </motion.div>

      {/* Top Picks for You */}
      <motion.section variants={fadeUp} aria-labelledby="top-picks-heading" className="space-y-4">
        <div>
          <h2 id="top-picks-heading" className="text-text-primary text-xl font-bold">
            {t("hero.topPicks")}
          </h2>
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
                isPlaying={currentlyPlaying?.id === song.id && playState === PLAY_STATE.PLAYING}
                onPlay={() => handlePlay(song.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recently Played */}
      <motion.section variants={fadeUp} aria-labelledby="recently-played-heading" className="space-y-4">
        <div className="flex items-center gap-1">
          <h2 id="recently-played-heading" className="text-text-primary text-xl font-bold">
            {t("hero.recentlyPlayed")}
          </h2>
          <ChevronRight size={20} className="text-text-tertiary" aria-hidden="true" />
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
              <div
                className="group cursor-pointer"
                onClick={() => handlePlay(song.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handlePlay(song.id)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={t("songCard.playSong", { title: song.title, artist: song.artist.name })}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={song.albumArt}
                    alt={`${song.title} album art`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="144px"
                  />
                  {currentlyPlaying?.id === song.id && playState === PLAY_STATE.PLAYING && (
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
