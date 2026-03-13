"use client"

import { useEffect, useState } from "react"

import Image from "next/image"

import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronRight,
  Disc3,
  Globe,
  Guitar,
  Headphones,
  Loader2,
  Mic2,
  Music2,
  Radio,
  Sparkles,
  Star,
  Waves,
  WifiOff,
  Zap,
} from "lucide-react"

import { SongCard } from "@/components/SongCard/SongCard"
import { Spotlight } from "@/components/ui/spotlight"
import { cn } from "@/lib/utils"
import { mapITunesTrackToSong } from "@/lib/itunes"
import { useMusicStore } from "@/store/musicStore"
import type { ITunesSearchResponse, Song } from "@/types/music"
import { PLAY_STATE } from "@/types/music"

// ─── Genre definitions ──────────────────────────────────────────────────────

const GENRES = [
  {
    id: "pop", name: "Pop", genreId: "14",
    icon: Star, gradient: "from-pink-600/80 to-rose-500/80", shadow: "shadow-pink-500/25",
    photo: "1470229722913-7c0e2dbbafd3",
  },
  {
    id: "hiphop", name: "Hip-Hop", genreId: "18",
    icon: Mic2, gradient: "from-purple-700/80 to-violet-600/80", shadow: "shadow-purple-500/25",
    photo: "1493225457124-a3eb161ffa5f",
  },
  {
    id: "rock", name: "Rock", genreId: "21",
    icon: Guitar, gradient: "from-red-700/80 to-orange-600/80", shadow: "shadow-red-500/25",
    photo: "1501386761578-eac5c294458e",
  },
  {
    id: "rnb", name: "R&B", genreId: "15",
    icon: Headphones, gradient: "from-blue-700/80 to-indigo-600/80", shadow: "shadow-blue-500/25",
    photo: "1415201364774-f6f0bb35f28f",
  },
  {
    id: "electronic", name: "Electronic", genreId: "7",
    icon: Zap, gradient: "from-cyan-600/80 to-teal-500/80", shadow: "shadow-cyan-500/25",
    photo: "1571330735066-03aaa9429d89",
  },
  {
    id: "country", name: "Country", genreId: "6",
    icon: Radio, gradient: "from-amber-600/80 to-yellow-500/80", shadow: "shadow-amber-500/25",
    photo: "1486218119243-13301543a1b4",
  },
  {
    id: "jazz", name: "Jazz", genreId: "11",
    icon: Waves, gradient: "from-indigo-700/80 to-blue-600/80", shadow: "shadow-indigo-500/25",
    photo: "1510915361894-db8b60106cb1",
  },
  {
    id: "latin", name: "Latin", genreId: "12",
    icon: Globe, gradient: "from-green-600/80 to-emerald-500/80", shadow: "shadow-green-500/25",
    photo: "1504910182-33ad29e21a60",
  },
  {
    id: "indie", name: "Indie", genreId: "20",
    icon: Sparkles, gradient: "from-violet-700/80 to-fuchsia-600/80", shadow: "shadow-violet-500/25",
    photo: "1545245047-ca41c0b62ded",
  },
  {
    id: "kpop", name: "K-Pop", genreId: "51",
    icon: Star, gradient: "from-fuchsia-600/80 to-pink-500/80", shadow: "shadow-fuchsia-500/25",
    photo: "1540575467063-178a50c2df87",
  },
  {
    id: "metal", name: "Metal", genreId: "1153",
    icon: Guitar, gradient: "from-zinc-800/85 to-slate-700/85", shadow: "shadow-zinc-500/25",
    photo: "1516280440614-37939bbacd81",
  },
  {
    id: "classical", name: "Classical", genreId: "5",
    icon: Music2, gradient: "from-stone-700/80 to-slate-600/80", shadow: "shadow-stone-500/25",
    photo: "1520523839897-bd0b52f945a0",
  },
] as const

type Genre = (typeof GENRES)[number]

// ─── Genre Card ─────────────────────────────────────────────────────────────

function GenreCard({
  genre,
  isSelected,
  isLoading,
  onClick,
}: {
  genre: Genre
  isSelected: boolean
  isLoading: boolean
  onClick: () => void
}) {
  const Icon = genre.icon
  const photoUrl = `https://images.unsplash.com/photo-${genre.photo}?w=400&h=300&fit=crop&auto=format&q=75`

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 shadow-lg aspect-[4/3]",
        genre.shadow,
        isSelected ? "ring-2 ring-white/50 shadow-xl" : "opacity-90 hover:opacity-100"
      )}
    >
      {/* Photo background */}
      <Image
        src={photoUrl}
        alt={genre.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 17vw"
      />

      {/* Gradient overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-300 group-hover:opacity-80", genre.gradient)} />

      {/* Dark vignette at bottom for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Icon */}
      <Icon size={20} className="relative z-10 text-white/90 drop-shadow" />

      {/* Label row */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[14px] font-bold text-white drop-shadow-md">{genre.name}</span>
        {isSelected && isLoading ? (
          <Loader2 size={13} className="animate-spin text-white/80" />
        ) : isSelected ? (
          <ChevronRight size={13} className="text-white/80" />
        ) : null}
      </div>
    </motion.button>
  )
}

// ─── Song list skeleton ──────────────────────────────────────────────────────

function SongsSkeleton() {
  return (
    <motion.div
      key="skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-list"
      role="status"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={cn("flex items-center gap-3 px-4 py-3", i < 7 && "border-b border-white/[0.04]")}>
          <div className="h-3.5 w-4 animate-pulse rounded bg-white/[0.07]" />
          <div className="size-11 shrink-0 animate-pulse rounded-xl bg-white/[0.07]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-36 animate-pulse rounded-full bg-white/[0.07]" />
            <div className="h-2.5 w-24 animate-pulse rounded-full bg-white/[0.05]" />
          </div>
          <div className="h-2.5 w-8 animate-pulse rounded-full bg-white/[0.05]" />
        </div>
      ))}
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function GenresPageContent() {
  const { currentlyPlaying, playState, setPlayingTrack, togglePlay } = useMusicStore()
  const isPlaying = playState === PLAY_STATE.PLAYING

  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(GENRES[0])
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const g = GENRES[0]
    setIsLoading(true)
    setError(null)
    fetch(`/api/itunes/search?genreId=${g.genreId}&limit=20`)
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json() as Promise<ITunesSearchResponse> })
      .then((data) => setSongs(data.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong)))
      .catch(() => setError("Failed to load songs. Try again."))
      .finally(() => setIsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadGenre = async (genre: Genre) => {
    // Toggle off if clicking the same genre
    if (selectedGenre?.id === genre.id) {
      setSelectedGenre(null)
      setSongs([])
      return
    }

    setSelectedGenre(genre)
    setIsLoading(true)
    setError(null)
    setSongs([])

    try {
      const res = await fetch(`/api/itunes/search?genreId=${genre.genreId}&limit=20`)
      if (!res.ok) throw new Error("Failed")
      const data = (await res.json()) as ITunesSearchResponse
      const mapped = data.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong)
      setSongs(mapped)
    } catch {
      setError("Failed to load songs. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
    <div className="relative space-y-8">
      {/* Spotlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(6, 182, 212, 0.06)" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 blur-md" />
          <Disc3 size={22} className="relative z-10 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Genres</h1>
          <p className="text-xs text-white/38">Browse music by genre</p>
        </div>
      </motion.div>

      {/* Genre grid */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"
      >
        {GENRES.map((genre) => (
          <GenreCard
            key={genre.id}
            genre={genre}
            isSelected={selectedGenre?.id === genre.id}
            isLoading={isLoading && selectedGenre?.id === genre.id}
            onClick={() => loadGenre(genre)}
          />
        ))}
      </motion.div>

      {/* Song results */}
      <AnimatePresence mode="wait">
        {selectedGenre && (
          <motion.section
            key={selectedGenre.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className={cn("flex size-8 items-center justify-center rounded-xl bg-gradient-to-br shadow-md", selectedGenre.gradient, selectedGenre.shadow)}>
                <selectedGenre.icon size={15} className="text-white" />
              </div>
              <h2 className="text-[17px] font-bold tracking-tight text-white">{selectedGenre.name}</h2>
              {songs.length > 0 && (
                <span className="ml-auto rounded-full bg-white/[0.07] px-2.5 py-0.5 text-xs font-medium text-white/35">
                  {songs.length}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <SongsSkeleton key="loading" />
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.05]">
                    <WifiOff size={20} className="text-white/30" />
                  </div>
                  <p className="text-sm text-white/45">{error}</p>
                  <button
                    onClick={() => loadGenre(selectedGenre)}
                    className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-5 py-2 text-xs font-semibold text-white/65 transition-all hover:bg-white/[0.12] hover:text-white"
                  >
                    Try again
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-list shadow-xl shadow-black/25 backdrop-blur-sm"
                >
                  {songs.map((song, index) => (
                    <div key={song.id} className={index < songs.length - 1 ? "border-b border-white/[0.05]" : ""}>
                      <SongCard
                        song={song}
                        variant="trending"
                        rank={index + 1}
                        isPlaying={currentlyPlaying?.id === song.id && isPlaying}
                        onPlay={() => handlePlay(song.id)}
                        showAddToPlaylist
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>

    </div>
  )
}
