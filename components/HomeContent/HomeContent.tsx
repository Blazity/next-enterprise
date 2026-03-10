"use client"

import { useEffect, useState } from "react"
import Image from "next/image"


import { BentoCard, BentoGrid } from "components/BentoGrid/BentoGrid"
import { EqualizerIcon, PlayIcon } from "components/icons"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"

import { cn } from "lib/cn"
import type { ActiveView } from "lib/constants"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { fetchPopularArtists, fetchTopAlbums, fetchTrendingSongs } from "lib/itunes/api"
import type { ItunesAlbum, ItunesArtist, ItunesTrack } from "lib/itunes/types"
import { extractReleaseYear, formatDuration } from "lib/itunes/utils"
import { isVisibleInView } from "lib/utils"
import { usePlayerStore } from "store/usePlayerStore"

interface HomeContentProps {
  activeView: Exclude<ActiveView, "search" | "playlists">
  onPlaylistClick: (id: string) => void
}

const FEATURED_SONG_COUNT = 3
const ALBUM_GRID_COUNT = 6
const ARTIST_DISPLAY_COUNT = 6

export function HomeContent({ activeView }: HomeContentProps) {
  const [trendingSongs, setTrendingSongs] = useState<ItunesTrack[]>([])
  const [topAlbums, setTopAlbums] = useState<ItunesAlbum[]>([])
  const [popularArtists, setPopularArtists] = useState<ItunesArtist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadHomeData() {
      setIsLoading(true)
      try {
        const [songs, albums, artists] = await Promise.all([
          fetchTrendingSongs(),
          fetchTopAlbums(),
          fetchPopularArtists(),
        ])

        setTrendingSongs(songs)
        setTopAlbums(albums)
        setPopularArtists(artists)
      } catch (error) {
        console.error("Home data fetch failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHomeData()
  }, [])

  if (isLoading) return <BentoSkeletons />

  // Dedicated view: show full list instead of bento
  if (activeView === "songs" && trendingSongs.length > 0) {
    return (
      <section>
        <h2 className="text-xl font-bold text-white tracking-[-0.01em] mb-4">Trending Songs</h2>
        <div className="flex flex-col gap-1">
          {trendingSongs.map((track, index) => (
            <div key={track.trackId} className="flex items-center gap-2">
              <span className="w-5 text-xs text-muted text-right shrink-0">{index + 1}</span>
              <div className="flex-1">
                <SongCard track={track} />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (activeView === "albums" && topAlbums.length > 0) {
    return (
      <section>
        <h2 className="text-xl font-bold text-white tracking-[-0.01em] mb-4">Top Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topAlbums.map((album) => (
            <AlbumTile key={album.collectionId} album={album} />
          ))}
        </div>
      </section>
    )
  }

  if (activeView === "artists" && popularArtists.length > 0) {
    return (
      <section>
        <h2 className="text-xl font-bold text-white tracking-[-0.01em] mb-4">Popular Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularArtists.map((artist) => (
            <ArtistTile key={artist.artistId} artist={artist} />
          ))}
        </div>
      </section>
    )
  }

  // Home view — bento grid
  const featuredSong = trendingSongs[0]
  const restSongs = trendingSongs.slice(1, FEATURED_SONG_COUNT + 1)
  const albumsToShow = topAlbums.slice(0, ALBUM_GRID_COUNT)
  const artistsToShow = popularArtists.slice(0, ARTIST_DISPLAY_COUNT)
  const featuredArtwork = featuredSong?.artworkUrl100 ? featuredSong.artworkUrl100.replace("100x100", "600x600") : ""

  return (
    <BentoGrid>
      {/* Hero — Featured Song (large, 2 cols) */}
      {featuredSong && (
        <BentoCard colSpan={2} rowSpan={2} className="p-0 relative">
          <div className="absolute inset-0">
            <Image
              src={featuredArtwork}
              alt={featuredSong.trackName}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          </div>
          <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-2">
              Trending Now
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 line-clamp-2">
              {featuredSong.trackName}
            </h2>
            <p className="text-sm text-white/70 mb-5">
              {featuredSong.artistName} &middot; {featuredSong.collectionName}
            </p>
            <div className="flex flex-col gap-0.5 max-w-md">
              {restSongs.map((track) => (
                <GlassSongRow key={track.trackId} track={track} />
              ))}
            </div>
          </div>
        </BentoCard>
      )}

      {/* Top Artists */}
      {isVisibleInView(activeView, "artists") && artistsToShow.length > 0 && (
        <BentoCard rowSpan={2} className="flex flex-col">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted mb-4">
            Popular Artists
          </h3>
          <div className="flex flex-col gap-3 flex-1">
            {artistsToShow.map((artist, index) => (
              <ArtistRow key={artist.artistId} artist={artist} rank={index + 1} />
            ))}
          </div>
        </BentoCard>
      )}


      {/* Top Albums — full width mosaic */}
      {isVisibleInView(activeView, "albums") && albumsToShow.length > 0 && (
        <BentoCard colSpan={3} className="p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted mb-3">
            Top Albums
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {albumsToShow.map((album) => (
              <AlbumTile key={album.collectionId} album={album} compact />
            ))}
          </div>
        </BentoCard>
      )}
    </BentoGrid>
  )
}

// --- Sub-components used only within the bento grid ---

/** Minimal song row with glass background — designed for use over artwork images */
function GlassSongRow({ track }: { track: ItunesTrack }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore()
  const { requireAuth } = useRequireAuth()
  const isCurrentTrack = currentTrack?.trackId === track.trackId
  const isActiveAndPlaying = isCurrentTrack && isPlaying
  const artworkUrl = track.artworkUrl100.replace("100x100", "300x300")

  function handlePlay() {
    if (!track.previewUrl) return
    requireAuth(() => {
      if (isCurrentTrack) {
        togglePlay()
      } else {
        playTrack(track)
      }
    })
  }

  return (
    <div
      onClick={handlePlay}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 active:scale-[0.98]",
        isCurrentTrack
          ? "bg-white/15 backdrop-blur-sm"
          : "hover:bg-white/10"
      )}
    >
      <div className="relative shrink-0">
        <Image
          src={artworkUrl}
          alt={track.trackName}
          width={36}
          height={36}
          className="rounded-md block"
        />
        {isCurrentTrack && (
          <div className="absolute inset-0 rounded-md bg-black/40 flex items-center justify-center">
            {isActiveAndPlaying ? (
              <EqualizerIcon />
            ) : (
              <PlayIcon width={12} height={12} className="text-primary" />
            )}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate m-0",
          isCurrentTrack ? "text-primary" : "text-white"
        )}>
          {track.trackName}
        </p>
        <p className="text-xs text-white/50 truncate mt-0.5 m-0">
          {track.artistName}
        </p>
      </div>
      <span className="text-xs text-white/40 shrink-0">
        {formatDuration(track.trackTimeMillis)}
      </span>
    </div>
  )
}

function ArtistRow({ artist, rank }: { artist: ItunesArtist; rank: number }) {
  const initials = artist.artistName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 group/artist">
      <span className="w-4 text-xs text-muted text-right shrink-0">{rank}</span>
      {artist.artworkUrl ? (
        <Image
          src={artist.artworkUrl}
          alt={artist.artistName}
          width={36}
          height={36}
          className="size-9 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="size-9 rounded-full bg-gradient-brand flex items-center justify-center shrink-0 text-xs font-bold text-white">
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate m-0">{artist.artistName}</p>
        <p className="text-[11px] text-muted m-0 uppercase tracking-[0.06em]">
          {artist.primaryGenreName}
        </p>
      </div>
    </div>
  )
}

function AlbumTile({ album, compact }: { album: ItunesAlbum; compact?: boolean }) {
  const artworkUrl = album.artworkUrl100.replace("100x100", "300x300")
  const year = extractReleaseYear(album.releaseDate)

  return (
    <div className={cn(
      "group/album relative overflow-hidden rounded-xl transition-all duration-200",
      "hover:scale-105 hover:z-10",
      compact ? "aspect-square" : "bg-surface border border-border rounded-3xl p-4"
    )}>
      <Image
        src={artworkUrl}
        alt={album.collectionName}
        width={compact ? 120 : 160}
        height={compact ? 120 : 160}
        className={cn(
          "block object-cover",
          compact ? "w-full h-full rounded-xl" : "w-full h-auto aspect-square rounded-xl"
        )}
      />
      {compact ? (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/album:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2 rounded-xl">
          <p className="text-[11px] font-semibold text-white truncate m-0">{album.collectionName}</p>
          <p className="text-[10px] text-white/60 truncate m-0">{album.artistName}</p>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-sm font-semibold text-white truncate m-0">{album.collectionName}</p>
          <p className="text-xs text-muted mt-1 m-0 truncate">{album.artistName} &middot; {year}</p>
        </div>
      )}
    </div>
  )
}

function ArtistTile({ artist }: { artist: ItunesArtist }) {
  const initials = artist.artistName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="bg-surface rounded-3xl px-4 py-6 border border-border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      {artist.artworkUrl ? (
        <Image
          src={artist.artworkUrl}
          alt={artist.artistName}
          width={80}
          height={80}
          className="size-20 rounded-full object-cover mx-auto mb-3.5 shadow-glow-sm"
        />
      ) : (
        <div className="size-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-3.5 shadow-glow-sm text-2xl font-bold text-white">
          {initials}
        </div>
      )}
      <p className="text-sm font-semibold text-white truncate m-0">{artist.artistName}</p>
      <p className="text-[11px] text-muted mt-1 m-0 uppercase tracking-[0.08em]">
        {artist.primaryGenreName}
      </p>
    </div>
  )
}

// Skeleton loading state for the bento grid
function BentoSkeletons() {
  return (
    <BentoGrid>
      <Skeleton className="rounded-3xl md:col-span-2 md:row-span-2 min-h-[360px]" />
      <Skeleton className="rounded-3xl md:row-span-2 min-h-[360px]" />
      <Skeleton className="rounded-3xl md:col-span-3 min-h-[180px]" />
    </BentoGrid>
  )
}
