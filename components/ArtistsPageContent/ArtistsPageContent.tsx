"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import { AnimatePresence, motion } from "framer-motion"
import { Mic2, RefreshCw, WifiOff } from "lucide-react"
import { useTranslation } from "react-i18next"

import { SongCard } from "@/components/SongCard/SongCard"
import { type ArtistWithSongs, fetchArtistsBrowse } from "@/lib/services/itunesService"
import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

const stagger = {
  show: { transition: { staggerChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function ArtistsPageContent() {
  const { t } = useTranslation()
  const { currentlyPlaying, playState, setPlayingTrack, togglePlay } = useMusicStore()

  const [artists, setArtists] = useState<ArtistWithSongs[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchArtistsBrowse()
      setArtists(data)
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
    for (const artist of artists) {
      const song = artist.songs.find((s) => s.id === songId)
      if (song) {
        if (currentlyPlaying?.id === songId) {
          togglePlay()
        } else {
          setPlayingTrack(song)
        }
        return
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="from-accent to-accent-hover flex size-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-red-500/20">
          <Mic2 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-text-primary text-2xl font-bold">{t("artists.title")}</h1>
          <p className="text-text-tertiary text-sm">{t("artists.subtitle", { count: artists.length })}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && artists.length === 0 ? (
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
              className="bg-accent hover:bg-accent-hover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <RefreshCw size={14} />
              {t("hero.retry")}
            </button>
          </motion.div>
        ) : isLoading && artists.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
            role="status"
            aria-label={t("hero.loading")}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-3 px-1">
                  <div className="size-10 animate-pulse rounded-full bg-white/10" />
                  <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                </div>
                <div className="space-y-1 rounded-xl bg-white/[0.03] p-2">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                      <div className="size-11 animate-pulse rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-32 animate-pulse rounded bg-white/10" />
                        <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="list" variants={stagger} initial="hidden" animate="show" className="space-y-6">
            {artists.map((artist) => (
              <motion.div key={artist.id} variants={fadeUp}>
                <div className="mb-2 flex items-center gap-3 px-1">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-sm font-semibold text-white">{artist.name}</h2>
                    <p className="text-text-tertiary text-xs">
                      {t("artists.tracksCount", { count: artist.songs.length })}
                    </p>
                  </div>
                </div>
                <div className="bg-surface-elevated rounded-xl">
                  {artist.songs.map((song, index) => (
                    <div
                      key={song.id}
                      className={index < artist.songs.length - 1 ? "border-b border-white/[0.06]" : ""}
                    >
                      <SongCard
                        song={song}
                        variant="trending"
                        isPlaying={currentlyPlaying?.id === song.id && playState === PLAY_STATE.PLAYING}
                        onPlay={() => handlePlay(song.id)}
                        showAddToPlaylist
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
