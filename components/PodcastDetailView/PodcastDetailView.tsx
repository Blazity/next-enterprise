"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { ChevronLeftIcon, PlayIcon } from "components/icons"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"

import { cn } from "lib/cn"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { fetchPodcastWithEpisodes } from "lib/itunes/api"
import type { ItunesAlbum, ItunesTrack } from "lib/itunes/types"
import { extractReleaseYear } from "lib/itunes/utils"
import { usePlayerStore } from "store/usePlayerStore"

interface PodcastDetailViewProps {
  podcastId: string
  onBack: () => void
}

export function PodcastDetailView({ podcastId, onBack }: PodcastDetailViewProps) {
  const { playTrack } = usePlayerStore()
  const { requireAuth } = useRequireAuth()
  
  const [podcast, setPodcast] = useState<ItunesAlbum | null>(null)
  const [episodes, setEpisodes] = useState<ItunesTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPodcast() {
      setIsLoading(true)
      try {
        const data = await fetchPodcastWithEpisodes(podcastId)
        if (data) {
          setPodcast(data.podcast)
          setEpisodes(data.episodes)
        }
      } catch (err) {
        console.error("Failed to load podcast", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadPodcast()
  }, [podcastId])

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
        <div className="flex flex-col gap-4 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!podcast) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted">Podcast not found</p>
        <button onClick={onBack} className="mt-4 text-primary hover:underline bg-transparent border-0 cursor-pointer">
          Go back
        </button>
      </div>
    )
  }

  const artworkUrl = podcast.artworkUrl100.replace("100x100", "600x600")
  const year = extractReleaseYear(podcast.releaseDate)
  const firstPlayableEpisode = episodes.find((e) => e.previewUrl)

  function handlePlayLatest() {
    if (!firstPlayableEpisode) return
    requireAuth(() => {
      playTrack(firstPlayableEpisode)
    })
  }

  return (
    <div className="flex flex-col gap-8 pb-10 fade-in w-full max-w-5xl">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors w-fit bg-transparent border-0 cursor-pointer p-0"
      >
        <ChevronLeftIcon width={16} height={16} />
        Back
      </button>

      {/* Header */}
      <header className="flex flex-col md:flex-row gap-6 md:items-end">
        <Image
          src={artworkUrl}
          alt={podcast.collectionName}
          width={220}
          height={220}
          className="rounded-xl shadow-2xl shrink-0"
          priority
        />
        <div className="flex flex-col justify-end">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted mb-2">
            Podcast
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3 tracking-tight balance-text">
            {podcast.collectionName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-primary/70 mb-4">
            <span className="font-semibold text-primary">{podcast.artistName}</span>
            <span>&middot;</span>
            <span>{year}</span>
            <span>&middot;</span>
            <span>{episodes.length} episodes</span>
          </div>
          <button
            onClick={handlePlayLatest}
            disabled={!firstPlayableEpisode}
            className={cn(
              "flex items-center justify-center h-14 px-8 rounded-full bg-primary text-bg hover:scale-105 transition-all shadow-glow-sm cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm tracking-wide gap-2",
            )}
          >
            <PlayIcon width={20} height={20} className="fill-bg" />
            LATEST EPISODE
          </button>
        </div>
      </header>

      {/* Episodes List - using slightly larger cards for podcasts */}
      <section className="flex flex-col gap-3 mt-4">
        <h3 className="text-2xl font-bold mb-4">All Episodes</h3>
        {episodes.map((episode) => (
          <div key={episode.trackId} className="bg-surface/50 hover:bg-surface border border-transparent hover:border-border rounded-xl p-2 transition-all">
            <SongCard track={episode} />
          </div>
        ))}
      </section>
    </div>
  )
}
