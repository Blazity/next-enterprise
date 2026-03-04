"use client"

// HomeContent — fetches and renders trending songs, top albums, popular artists
// wednesday-design: card rows, horizontal scroll, section headings
// wednesday-dev: Promise.all parallel fetch, isLoading boolean, no console.log

import { useEffect, useState } from "react"

import { AlbumCard } from "components/AlbumCard/AlbumCard"
import { ArtistCard } from "components/ArtistCard/ArtistCard"
import { HorizontalRow } from "components/HorizontalRow/HorizontalRow"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"

import { fetchPopularArtists, fetchTopAlbums, fetchTrendingSongs } from "lib/itunes/api"
import type { ItunesAlbum, ItunesArtist, ItunesTrack } from "lib/itunes/types"

import type { ActiveView } from "app/page"

interface HomeContentProps {
  activeView: Exclude<ActiveView, "search">
}

const SONG_PREVIEW_COUNT = 5

export function HomeContent({ activeView }: HomeContentProps) {
  const [trendingSongs, setTrendingSongs] = useState<ItunesTrack[]>([])
  const [topAlbums, setTopAlbums] = useState<ItunesAlbum[]>([])
  const [popularArtists, setPopularArtists] = useState<ItunesArtist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadHomeData() {
      setIsLoading(true)
      const [songs, albums, artists] = await Promise.all([
        fetchTrendingSongs(),
        fetchTopAlbums(),
        fetchPopularArtists(),
      ])
      setTrendingSongs(songs)
      setTopAlbums(albums)
      setPopularArtists(artists)
      setIsLoading(false)
    }

    loadHomeData()
  }, [])

  if (isLoading) return <HomeSkeletons />

  const songsToShow = activeView === "songs" ? trendingSongs : trendingSongs.slice(0, SONG_PREVIEW_COUNT)
  const shouldShowSongs = activeView === "home" || activeView === "songs"
  const shouldShowAlbums = activeView === "home" || activeView === "albums"
  const shouldShowArtists = activeView === "home" || activeView === "artists"

  return (
    <div>
      {shouldShowSongs && trendingSongs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white tracking-[-0.01em] mb-4">
            {activeView === "songs" ? "Trending Songs" : "🔥 Trending Right Now"}
          </h2>
          <div className="flex flex-col gap-1">
            {songsToShow.map((track, index) => (
              <div key={track.trackId} className="flex items-center gap-2">
                <span className="w-5 text-xs text-muted text-right shrink-0">{index + 1}</span>
                <div className="flex-1">
                  <SongCard track={track} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {shouldShowAlbums && topAlbums.length > 0 && (
        <HorizontalRow title={activeView === "albums" ? "Top Albums" : "💿 Top Albums"}>
          {topAlbums.map((album) => (
            <div key={album.collectionId} className="shrink-0 w-40">
              <AlbumCard album={album} />
            </div>
          ))}
        </HorizontalRow>
      )}

      {shouldShowArtists && popularArtists.length > 0 && (
        <HorizontalRow title={activeView === "artists" ? "Popular Artists" : "🎤 Popular Artists"}>
          {popularArtists.map((artist) => (
            <div key={artist.artistId} className="shrink-0 w-[140px]">
              <ArtistCard artist={artist} />
            </div>
          ))}
        </HorizontalRow>
      )}
    </div>
  )
}

// Skeleton loading state — mirrors the real home sections
function HomeSkeletons() {
  return (
    <div>
      <Skeleton className="w-[200px] h-6 mb-4" />
      <div className="flex flex-col gap-2 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[68px] rounded-xl" />
        ))}
      </div>

      <Skeleton className="w-[140px] h-6 mb-4" />
      <div className="flex gap-4 overflow-hidden mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-40 h-[210px] shrink-0 rounded-3xl" />
        ))}
      </div>

      <Skeleton className="w-40 h-6 mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-[140px] h-40 shrink-0 rounded-3xl" />
        ))}
      </div>
    </div>
  )
}
