"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { ChevronLeftIcon } from "components/icons"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"

import { fetchSongsByGenre } from "lib/itunes/api"
import type { ItunesTrack } from "lib/itunes/types"
import { GENRES } from "lib/genres"

interface GenreDetailViewProps {
  genreName: string
  onBack: () => void
}

export function GenreDetailView({ genreName, onBack }: GenreDetailViewProps) {
  const [songs, setSongs] = useState<ItunesTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSongs() {
      setIsLoading(true)
      try {
        const data = await fetchSongsByGenre(genreName)
        setSongs(data)
      } catch (err) {
        console.error("Failed to load genre songs", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSongs()
  }, [genreName])

  const genreMeta = GENRES.find(g => g.name === genreName)

  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in duration-500 w-full max-w-5xl">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          <ChevronLeftIcon width={16} height={16} />
          Home
        </button>
      </div>

      <header className="relative w-full h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-sm mb-2 flex items-end p-6 md:p-8">
        {genreMeta && (
          <>
            <Image
              src={genreMeta.image}
              alt={genreMeta.name}
              fill
              className="object-cover"
              priority
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${genreMeta.color} opacity-80`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        )}
        <div className="relative z-10 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Genre</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-md">
            {genreName}
          </h1>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-2 w-full max-w-5xl mt-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : songs.length > 0 ? (
        <div className="flex flex-col gap-1 w-full max-w-5xl">
          {songs.map((track, idx) => (
            <div key={track.trackId} className="flex items-center gap-4 w-full group">
              <span className="w-8 text-sm font-bold text-muted text-right group-hover:text-primary transition-colors tabular-nums">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <SongCard track={track} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted">
          No songs found for this genre.
        </div>
      )}
    </div>
  )
}
