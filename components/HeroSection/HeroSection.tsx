"use client"

import { useEffect, useMemo } from "react"

import Image from "next/image"
import Link from "next/link"

import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { ChevronRight, RefreshCw, WifiOff } from "lucide-react"
import { useTranslation } from "react-i18next"

import { PlayButton } from "@/components/PlayButton/PlayButton"
import { SongCard } from "@/components/SongCard/SongCard"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { Spotlight } from "@/components/ui/spotlight"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { cn } from "@/lib/utils"
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

function useGreeting() {
  const { t } = useTranslation()
  const { user } = useUser()

  return useMemo(() => {
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? t("hero.morning") : hour < 18 ? t("hero.afternoon") : t("hero.evening")
    if (user?.firstName) {
      return t("hero.greeting", { timeOfDay, name: user.firstName })
    }
    return t("hero.greetingDefault", { timeOfDay })
  }, [t, user?.firstName])
}

export function HeroSection() {
  const { t } = useTranslation()
  const greeting = useGreeting()
  const {
    featuredSongs,
    trendingSongs,
    currentlyPlaying,
    playState,
    setPlayingTrack,
    togglePlay,
    fetchPopularContent,
    isLoadingHome,
    homeError,
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
  const recentlyPlayed = trendingSongs.slice(0, 8)

  if (isLoadingHome && featuredSongs.length === 0) {
    return (
      <div className="space-y-10" aria-label={t("hero.loading")} role="status">
        <div className="space-y-2">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-white/10" />
          <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
        </div>
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
              <div key={i} className="w-40 shrink-0 space-y-2">
                <div className="aspect-square w-full animate-pulse rounded-xl bg-white/5" />
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (homeError && featuredSongs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-white/[0.06]">
          <WifiOff size={28} className="text-text-tertiary" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-white">{t("hero.errorTitle")}</h2>
          <p className="text-text-tertiary max-w-xs text-sm">{t("hero.errorDescription")}</p>
        </div>
        <button
          onClick={() => fetchPopularContent()}
          className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors"
        >
          <RefreshCw size={14} />
          {t("hero.retry")}
        </button>
      </div>
    )
  }

  return (
    <>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-10 relative">
      <div className="absolute inset-x-0 top-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      </div>
      
      {/* Greeting header */}
      <motion.header variants={fadeUp}>
        <TextGenerateEffect words={greeting} className="text-3xl font-bold tracking-tight" />
        <p className="text-text-tertiary mt-1 text-sm z-10 relative">{t("hero.madeForYou")}</p>
      </motion.header>

      {/* Top Picks for You */}
      <motion.section variants={fadeUp} aria-labelledby="top-picks-heading" className="space-y-4">
        <h2 id="top-picks-heading" className="text-text-primary text-xl font-bold">
          {t("hero.topPicks")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
            >
              <CardContainer containerClassName="py-0" className="w-full">
                <CardBody className="h-auto w-full">
                  <CardItem translateZ="20" className="w-full">
                    <SongCard
                      song={song}
                      variant="featured"
                      subtitle={i === 0 ? t("hero.featuredStation") : undefined}
                      isPlaying={currentlyPlaying?.id === song.id && playState === PLAY_STATE.PLAYING}
                      onPlay={() => handlePlay(song.id)}
                      showAddToPlaylist
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trending Now — horizontal scroll */}
      <motion.section variants={fadeUp} aria-labelledby="trending-heading" className="space-y-4">
        <Link href="/trending" className="group/link flex items-center gap-1 transition-opacity hover:opacity-80">
          <h2 id="trending-heading" className="text-text-primary text-xl font-bold">
            {t("hero.recentlyPlayed")}
          </h2>
          <ChevronRight
            size={20}
            className="text-text-tertiary transition-transform group-hover/link:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        <InfiniteMovingCards
          items={recentlyPlayed}
          direction="left"
          speed="normal"
          className=""
          renderItem={(song: typeof recentlyPlayed[0]) => {
            const isActive = currentlyPlaying?.id === song.id && playState === PLAY_STATE.PLAYING
            return (
              <div
                className="group cursor-pointer focus-visible:outline-none w-full transition-transform duration-300 hover:scale-[1.03] hover:z-30 relative"
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
                <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg shadow-black/20 transition-all duration-300 group-hover:shadow-black/40 group-hover:shadow-2xl">
                  <Image
                    src={song.albumArt}
                    alt=""
                    role="presentation"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="160px"
                  />
                  {/* Hover overlay with play button */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    )}
                  >
                    {isActive ? (
                      <div className="flex items-end gap-[2px]" aria-label={t("hero.nowPlaying")}>
                        <span className="animate-eq-1 bg-accent inline-block w-[3px] rounded-full" />
                        <span className="animate-eq-2 bg-accent inline-block w-[3px] rounded-full" />
                        <span className="animate-eq-3 bg-accent inline-block w-[3px] rounded-full" />
                      </div>
                    ) : (
                      <PlayButton isPlaying={false} onToggle={() => handlePlay(song.id)} size="sm" tabIndex={-1} />
                    )}
                  </div>
                  {/* Active ring indicator */}
                  {isActive && <div className="ring-accent pointer-events-none absolute inset-0 rounded-xl ring-2" />}
                </div>
                <div className="mt-2.5 space-y-0.5 px-0.5">
                  <p
                    className={cn(
                      "truncate text-[13px] font-semibold",
                      isActive ? "text-accent" : "text-text-primary"
                    )}
                  >
                    {song.title}
                  </p>
                  <p className="text-text-tertiary truncate text-[11px]">{song.artist.name}</p>
                </div>
              </div>
            )
          }}
        />
      </motion.section>
    </motion.div>
    </>
  )
}
