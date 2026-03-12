"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

import { ChevronLeftIcon, PlayIcon } from "components/icons"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"

import { cn } from "lib/cn"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { fetchAlbumWithTracks } from "lib/itunes/api"
import type { ItunesAlbum, ItunesTrack } from "lib/itunes/types"
import { extractReleaseYear } from "lib/itunes/utils"
import { usePlayerStore } from "store/usePlayerStore"

interface AlbumDetailViewProps {
  onBack: () => void
}

export function AlbumDetailView({ onBack }: AlbumDetailViewProps) {
  const searchParams = useSearchParams()
  const selectedAlbumId = searchParams.get("id")
  const { playTrack } = usePlayerStore()
  const { requireAuth } = useRequireAuth()
  
  const [album, setAlbum] = useState<ItunesAlbum | null>(null)
  const [tracks, setTracks] = useState<ItunesTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAlbum() {
      if (!selectedAlbumId) return
      setIsLoading(true)
      try {
        const data = await fetchAlbumWithTracks(selectedAlbumId)
        if (data) {
          setAlbum(data.album)
          setTracks(data.tracks)
        }
      } catch (err) {
        console.error("Failed to load album", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAlbum()
  }, [selectedAlbumId])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex gap-6 items-end">
          <Skeleton className="w-[200px] h-[200px] rounded-xl shrink-0" />
          <div className="flex flex-col gap-3 w-full max-w-md">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted">Album not found</p>
        <button onClick={onBack} className="mt-4 text-primary hover:underline bg-transparent border-0 cursor-pointer">
          Go back
        </button>
      </div>
    )
  }

  const artworkUrl = album.artworkUrl100.replace("100x100", "600x600")
  const year = extractReleaseYear(album.releaseDate)
  const firstPlayableTrack = tracks.find((t) => t.previewUrl)

  function handlePlayAlbum() {
    if (!firstPlayableTrack) return
    requireAuth(() => {
      // For now, just play the first track. Ideally, this would queue the album.
      playTrack(firstPlayableTrack)
    })
  }

  return (
    <div className="flex flex-col gap-8 pb-10 fade-in">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors w-fit bg-transparent border-0 cursor-pointer p-0"
      >
        <ChevronLeftIcon width={16} height={16} />
        Back
      </button>

      {/* Header */}
      <header className="flex flex-col md:flex-row gap-6 md:items-end">
        <Image
          src={artworkUrl}
          alt={album.collectionName}
          width={220}
          height={220}
          className="rounded-xl shadow-2xl shrink-0"
          priority
        />
        <div className="flex flex-col justify-end">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted mb-2">
            Album
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight balance-text">
            {album.collectionName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <span className="font-semibold text-white">{album.artistName}</span>
            <span>&middot;</span>
            <span>{year}</span>
            <span>&middot;</span>
            <span>{album.trackCount} songs</span>
          </div>
          <button
            onClick={handlePlayAlbum}
            disabled={!firstPlayableTrack}
            className={cn(
              "flex items-center justify-center size-14 rounded-full bg-primary text-black hover:scale-105 transition-all shadow-glow-sm cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <PlayIcon width={24} height={24} className="ml-1" />
          </button>
        </div>
      </header>

      {/* Tracklist */}
      <section className="flex flex-col gap-1 mt-4">
        {tracks.map((track, i) => (
          <div key={track.trackId} className="flex items-center gap-3">
            <span className="w-6 text-sm text-muted text-right tabular-nums shrink-0">
              {i + 1}
            </span>
            <div className="flex-1">
              <SongCard track={track} />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
