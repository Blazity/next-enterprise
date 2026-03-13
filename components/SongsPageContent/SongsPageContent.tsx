"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

import { useUser } from "@clerk/nextjs"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronUp, Headphones, LogIn, Music2, Pause, Play, RefreshCw, Search, TrendingUp, WifiOff, X } from "lucide-react"

import { SongCard } from "@/components/SongCard/SongCard"
import { Spotlight } from "@/components/ui/spotlight"
import { cn } from "@/lib/utils"
import { fetchSongsBrowse } from "@/lib/services/itunesService"
import { useMusicStore } from "@/store/musicStore"
import type { Song } from "@/types/music"
import { PLAY_STATE } from "@/types/music"

const TRENDING_PREVIEW = 10

const stagger = {
  show: { transition: { staggerChildren: 0.03 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

// ─── Mini Song Card ────────────────────────────────────────────────────────────

function SongMiniCard({
  song,
  isPlaying,
  onPlay,
  onRemove,
  badge,
}: {
  song: Song
  isPlaying: boolean
  onPlay: () => void
  onRemove?: () => void
  badge?: string
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      type="button"
      onClick={onPlay}
      className={cn(
        "group relative flex w-[160px] shrink-0 flex-col gap-2.5 rounded-2xl border p-3 text-left transition-all duration-200 active:scale-[0.96]",
        isPlaying
          ? "border-accent/30 bg-accent/[0.07] shadow-lg shadow-accent/10"
          : "border-transparent bg-white/[0.04] hover:border-white/[0.10] hover:bg-white/[0.08] hover:shadow-xl hover:shadow-black/25",
      )}
    >
      {/* Album art */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg">
        <Image
          src={song.albumArt}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="160px"
        />

        {/* Badge (play count) */}
        {badge && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-sm">
            <span className="text-[10px] font-semibold text-white/90">{badge}</span>
          </div>
        )}

        {/* Remove button */}
        {onRemove && (
          <button
            type="button"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full bg-black/50 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/70 hover:text-white group-hover:opacity-100"
          >
            <X size={12} />
          </button>
        )}

        {/* Play/pause overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/35">
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-full bg-accent text-white shadow-xl shadow-accent/40 transition-all duration-300",
              isPlaying ? "scale-100 opacity-100" : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100",
            )}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
          </div>
        </div>

        {/* Playing ring */}
        {isPlaying && <div className="absolute inset-0 rounded-xl ring-2 ring-inset ring-accent/40" />}
      </div>

      {/* Song info */}
      <div className="min-w-0 space-y-0.5">
        <p className={cn("truncate text-[13px] font-semibold leading-tight", isPlaying ? "text-accent" : "text-white/90")}>
          {song.title}
        </p>
        <p className="truncate text-[11px] leading-tight text-white/40">{song.artist.name}</p>
      </div>
    </motion.button>
  )
}

// ─── Section Header ────────────────────────────────────────────────────────────

type SectionColor = "red" | "violet" | "cyan"

const gradientMap: Record<SectionColor, string> = {
  red: "from-rose-500 to-orange-400 shadow-rose-500/20",
  violet: "from-violet-500 to-purple-400 shadow-violet-500/20",
  cyan: "from-cyan-500 to-teal-400 shadow-cyan-500/20",
}

function SectionHeader({
  icon,
  label,
  count,
  color = "red",
}: {
  icon: React.ReactNode
  label: string
  count?: number
  color?: SectionColor
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("flex size-8 items-center justify-center rounded-xl bg-gradient-to-br shadow-md", gradientMap[color])}>
        {icon}
      </div>
      <h2 className="text-[17px] font-bold tracking-tight text-white">{label}</h2>
      {count !== undefined && count > 0 && (
        <span className="ml-auto rounded-full bg-white/[0.07] px-2.5 py-0.5 text-xs font-medium text-white/35">
          {count}
        </span>
      )}
    </div>
  )
}

// ─── Empty Personal Section ────────────────────────────────────────────────────

const emptyIconMap: Record<SectionColor, string> = {
  red: "bg-rose-500/10 text-rose-400",
  violet: "bg-violet-500/10 text-violet-400",
  cyan: "bg-cyan-500/10 text-cyan-400",
}

function EmptyPersonalSection({
  icon,
  message,
  sub,
  color = "red",
}: {
  icon: React.ReactNode
  message: string
  sub: string
  color?: SectionColor
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-10 text-center">
      <div className={cn("flex size-12 items-center justify-center rounded-2xl", emptyIconMap[color])}>{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-white/55">{message}</p>
        <p className="text-xs text-white/28">{sub}</p>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function SongsPageContent() {
  const { user } = useUser()
  const { currentlyPlaying, playState, setPlayingTrack, togglePlay, mostSearched, fetchMostSearched, mostListened, fetchMostListened } =
    useMusicStore()
  const isPlaying = playState === PLAY_STATE.PLAYING

  const [trendingSongs, setTrendingSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAllTrending, setShowAllTrending] = useState(false)

  const visibleTrending = showAllTrending ? trendingSongs : trendingSongs.slice(0, TRENDING_PREVIEW)

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchSongsBrowse()
      setTrendingSongs(data)
    } catch {
      setError("Failed to load")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetchMostSearched(user.id)
      fetchMostListened(user.id)
    }
  }, [user?.id, fetchMostSearched, fetchMostListened])

  const mostListenedSongs = useMemo(() => mostListened.map(({ song }) => song), [mostListened])

  const handlePlay = (song: Song, collection: Song[]) => {
    if (currentlyPlaying?.id === song.id) {
      togglePlay()
    } else {
      setPlayingTrack(song, collection)
    }
  }

  const handleTrendingPlay = (songId: string) => {
    const song = trendingSongs.find((s) => s.id === songId)
    if (!song) return
    handlePlay(song, trendingSongs)
  }

  return (
    <div className="relative space-y-10">
      {/* Spotlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(6, 182, 212, 0.06)" />
      </div>

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex items-center gap-3 pt-1"
      >
        <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-hover shadow-lg shadow-accent/25">
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-accent/30 to-accent-hover/30 blur-md" />
          <Music2 size={22} className="relative z-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Songs</h1>
          <p className="text-xs text-white/38">Your personalised music overview</p>
        </div>
      </motion.div>

      {/* ── Trending Songs ───────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="space-y-4"
      >
        <SectionHeader
          icon={<TrendingUp size={15} className="text-white" />}
          label="Trending Songs"
          count={trendingSongs.length || undefined}
          color="red"
        />

        <AnimatePresence mode="wait">
          {error && trendingSongs.length === 0 ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-20 text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.05]">
                <WifiOff size={22} className="text-white/30" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white/65">Failed to load tracks</p>
                <p className="text-xs text-white/30">Check your connection and try again</p>
              </div>
              <button
                onClick={load}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-5 py-2 text-xs font-semibold text-white/65 transition-all duration-200 hover:bg-white/[0.12] hover:text-white"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </motion.div>
          ) : isLoading && trendingSongs.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]"
              role="status"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={cn("flex items-center gap-3 px-4 py-3", i < 7 && "border-b border-white/[0.04]")}>
                  <div className="h-3.5 w-4 animate-pulse rounded bg-white/[0.07]" />
                  <div className="size-11 animate-pulse rounded-xl bg-white/[0.07]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-36 animate-pulse rounded-full bg-white/[0.07]" />
                    <div className="h-2.5 w-24 animate-pulse rounded-full bg-white/[0.05]" />
                  </div>
                  <div className="h-2.5 w-8 animate-pulse rounded-full bg-white/[0.05]" />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" variants={stagger} initial="hidden" animate="show">
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-list shadow-lg shadow-black/20 backdrop-blur-sm">
                <AnimatePresence initial={false}>
                  {visibleTrending.map((song, index) => (
                    <motion.div
                      key={song.id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.2 }}
                      className={index < visibleTrending.length - 1 ? "border-b border-white/[0.05]" : ""}
                    >
                      <SongCard
                        song={song}
                        variant="trending"
                        rank={index + 1}
                        isPlaying={currentlyPlaying?.id === song.id && isPlaying}
                        onPlay={() => handleTrendingPlay(song.id)}
                        showAddToPlaylist
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {trendingSongs.length > TRENDING_PREVIEW && (
                <button
                  onClick={() => setShowAllTrending((v) => !v)}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium text-white/40 transition-all duration-200 hover:text-white/70"
                >
                  {showAllTrending ? (
                    <>
                      <ChevronUp size={15} />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={15} />
                      Show all {trendingSongs.length} songs
                    </>
                  )}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* ── Personal Sections ────────────────────────────────────────────────── */}
      {user ? (
        <>
          {/* Most Searched */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            <SectionHeader
              icon={<Search size={15} className="text-white" />}
              label="Most Searched"
              count={mostSearched.length || undefined}
              color="violet"
            />

            {mostSearched.length === 0 ? (
              <EmptyPersonalSection
                icon={<Search size={22} />}
                message="No search history yet"
                sub="Search for songs and play them to build your history"
                color="violet"
              />
            ) : (
              <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                {mostSearched.map(({ song, count }, i) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.05 }}
                  >
                    <SongMiniCard
                      song={song}
                      isPlaying={currentlyPlaying?.id === song.id && isPlaying}
                      onPlay={() => handlePlay(song, mostSearched.map((e) => e.song))}
                      badge={count > 1 ? `${count}x` : undefined}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Most Listened */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-4"
          >
            <SectionHeader
              icon={<Headphones size={15} className="text-white" />}
              label="Most Listened"
              count={mostListened.length || undefined}
              color="cyan"
            />

            {mostListened.length === 0 ? (
              <EmptyPersonalSection
                icon={<Headphones size={22} />}
                message="Nothing played this session"
                sub="Hit play on any song and it will show up here"
                color="cyan"
              />
            ) : (
              <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                {mostListened.map(({ song, count }, i) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.05 }}
                  >
                    <SongMiniCard
                      song={song}
                      isPlaying={currentlyPlaying?.id === song.id && isPlaying}
                      onPlay={() => handlePlay(song, mostListenedSongs)}
                      badge={count > 1 ? `${count}x` : undefined}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </>
      ) : (
        /* Sign-in prompt */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent px-8 py-12 text-center"
        >
          <div className="pointer-events-none absolute -top-10 -left-10 size-48 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-48 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 ring-1 ring-white/[0.08]">
              <LogIn size={22} className="text-white/55" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-white/75">Sign in for your personalised overview</p>
              <p className="text-sm text-white/35">Your most searched and most listened tracks will appear here</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
