"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { PauseIcon, PlayIcon } from "components/icons"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"

import { cn } from "lib/cn"
import type { ActiveView } from "lib/constants"
import { GENRES } from "lib/genres"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { fetchPopularArtists, fetchTopAlbums, fetchTopPodcasts, fetchTrendingSongs } from "lib/itunes/api"
import type { ItunesAlbum, ItunesArtist, ItunesTrack } from "lib/itunes/types"
import { extractReleaseYear } from "lib/itunes/utils"

import { usePlayerStore } from "store/usePlayerStore"


interface HomeContentProps {
  activeView: Exclude<ActiveView, "search" | "playlists" | "album_detail" | "artist_detail">
  activeId?: string
  onPlaylistClick: (id: string) => void
  onNavClick: (view: ActiveView, id?: string) => void
}





export function HomeContent({ activeView, onNavClick }: HomeContentProps) {
  const [trendingSongs, setTrendingSongs] = useState<ItunesTrack[]>([])
  const [topAlbums, setTopAlbums] = useState<ItunesAlbum[]>([])
  const [popularArtists, setPopularArtists] = useState<ItunesArtist[]>([])
  const [topPodcasts, setTopPodcasts] = useState<ItunesAlbum[]>([])
  const [filter, setFilter] = useState<"all" | "music" | "podcasts">("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadHomeData() {
      setIsLoading(true)
      try {
        const [songs, albums, artists, podcasts] = await Promise.all([
          fetchTrendingSongs(),
          fetchTopAlbums(),
          fetchPopularArtists(),
          fetchTopPodcasts(),
        ])

        setTrendingSongs(songs)
        setTopAlbums(albums)
        setPopularArtists(artists)
        setTopPodcasts(podcasts)
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
      <section className="animate-in fade-in duration-500 pb-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight mb-8">Trending Songs</h2>
        <div className="flex flex-col gap-1 w-full max-w-5xl">
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
      <section className="animate-in fade-in duration-500 pb-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight mb-8">Top Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topAlbums.map((album) => (
            <AlbumTile key={album.collectionId} album={album} onNavClick={onNavClick} />
          ))}
        </div>
      </section>
    )
  }

  if (activeView === "artists" && popularArtists.length > 0) {
    return (
      <section className="animate-in fade-in duration-500 pb-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight mb-8">Popular Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {popularArtists.map((artist) => (
            <ArtistTile key={artist.artistId} artist={artist} onNavClick={onNavClick} />
          ))}
        </div>
      </section>
    )
  }



  if (activeView === "podcasts") {
    return (
      <section className="animate-in fade-in duration-500 pb-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight mb-8">Top Podcasts</h2>
        {topPodcasts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {topPodcasts.map(podcast => (
              <AlbumTile
                key={podcast.collectionId}
                album={podcast}
                onNavClick={() => onNavClick("podcast_detail", String(podcast.collectionId))}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
               <div key={i} className="flex flex-col gap-3">
                 <Skeleton className="aspect-square rounded-[1.25rem]" />
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-3 w-1/2" />
               </div>
            ))}
          </div>
        )}
      </section>
    )
  }


  // Home view — new standard layout
  const restSongs = trendingSongs.slice(1, 6)
  const albumsToShow = topAlbums
  const artistsToShow = popularArtists
  const discoverSongs = trendingSongs.slice(6, 12)


  return (
    <div className="flex flex-col pb-24 animate-in fade-in duration-500">
      {/* Filters */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 border",
            filter === "all" ? "bg-primary text-bg border-primary shadow-sm" : "bg-surface text-primary border-border hover:bg-surface-hover"
          )}>All</button>
        <button
          onClick={() => setFilter("music")}
          className={cn(
            "px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 border",
            filter === "music" ? "bg-primary text-bg border-primary shadow-sm" : "bg-surface text-primary border-border hover:bg-surface-hover"
          )}>Music</button>
        <button
          onClick={() => setFilter("podcasts")}
          className={cn(
            "px-5 py-2 rounded-full font-bold text-sm transition-all active:scale-95 border",
            filter === "podcasts" ? "bg-primary text-bg border-primary shadow-sm" : "bg-surface text-primary border-border hover:bg-surface-hover"
          )}>Podcasts</button>
      </div>

      {/* Trending Songs */}
      {(filter === "all" || filter === "music") && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight">Trending Songs</h2>
            <button onClick={() => onNavClick("songs")} className="text-xs font-bold text-muted hover:text-primary transition-colors   tracking-widest hidden sm:block">See All</button>
          </div>
          <div className="flex flex-col gap-1 w-full max-w-5xl">
            {restSongs.map((track, idx) => (
              <div key={track.trackId} className="flex items-center gap-4 w-full group">
                <span className="w-5 text-sm font-bold text-muted text-right group-hover:text-primary transition-colors">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <SongCard track={track} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Artists */}
      {(filter === "all" || filter === "music") && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight">Popular Artists</h2>
            <button onClick={() => onNavClick("artists")} className="text-xs font-bold text-muted hover:text-primary transition-colors   tracking-widest hidden sm:block">See All</button>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {artistsToShow.map(artist => (
              <div key={artist.artistId} className="w-[140px] shrink-0 snap-center">
                <ArtistTile artist={artist} onNavClick={onNavClick} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Explore Genres */}
      {(filter === "all" || filter === "music") && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight">Explore Genres</h2>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {GENRES.map(genre => (
              <div
                key={genre.name}
                onClick={() => onNavClick("genre_detail", genre.name)}
                className="w-[180px] md:w-[240px] shrink-0 snap-center group relative h-44 md:h-56 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <Image
                  src={genre.image}
                  alt={genre.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} transition-opacity group-hover:opacity-70`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-black text-xl md:text-2xl text-white tracking-widest uppercase drop-shadow-md">{genre.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Albums */}
      {(filter === "all" || filter === "music") && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight">Top Albums</h2>
            <button onClick={() => onNavClick("albums")} className="text-xs font-bold text-muted hover:text-primary transition-colors   tracking-widest hidden sm:block">See All</button>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {albumsToShow.map(album => (
              <div key={album.collectionId} className="w-[140px] md:w-[160px] shrink-0 snap-center">
                <AlbumTile album={album} onNavClick={onNavClick} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Discover Something New */}
      {(filter === "all" || filter === "music") && discoverSongs.length > 0 && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight">Discover Something New</h2>
            <button onClick={() => onNavClick("songs")} className="text-xs font-bold text-muted hover:text-primary transition-colors tracking-widest hidden sm:block">See All</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {discoverSongs.map((track) => (
              <div key={track.trackId}>
                <TrackTile track={track} />
              </div>
            ))}
          </div>
        </section>
      )}      {/* Top Podcasts */}
      {(filter === "all" || filter === "podcasts") && topPodcasts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight">Top Podcasts</h2>
            <button onClick={() => onNavClick("podcasts")} className="text-xs font-bold text-muted hover:text-primary transition-colors uppercase tracking-widest hidden sm:block">See All</button>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {topPodcasts.map(podcast => (
              <div key={podcast.collectionId} className="w-[140px] md:w-[160px] shrink-0 snap-center">
                <AlbumTile
                  album={podcast}

                  onNavClick={() => onNavClick("podcast_detail", String(podcast.collectionId))}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function AlbumTile({ album, onNavClick }: { album: ItunesAlbum; onNavClick?: (view: ActiveView, id?: string) => void }) {
  const artworkUrl = album.artworkUrl100.replace("100x100", "300x300")
  const year = extractReleaseYear(album.releaseDate)

  function handleClick() {
    if (onNavClick) onNavClick("album_detail", String(album.collectionId))
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group/album relative flex flex-col w-full transition-all duration-300 cursor-pointer",
        "hover:scale-[1.03]"
      )}>
      <div className="relative w-full aspect-square rounded-[1.25rem] overflow-hidden shadow-sm mb-3 group-hover/album:shadow-md transition-shadow">
        <Image
          src={artworkUrl}
          alt={album.collectionName}
          fill
          className="object-cover transition-transform duration-500 group-hover/album:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/album:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-primary truncate m-0 group-hover/album:text-green-500 transition-colors">{album.collectionName}</p>
        <p className="text-xs text-muted mt-0.5 m-0 truncate font-medium">{album.artistName} &middot; {year}</p>
      </div>
    </div>
  )
}

function ArtistTile({ artist, onNavClick }: { artist: ItunesArtist, onNavClick?: (view: ActiveView, id?: string) => void }) {
  const initials = artist.artistName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  function handleClick() {
    if (onNavClick) onNavClick("artist_detail", String(artist.artistId))
  }

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center group cursor-pointer w-full"
    >
      <div className="relative w-full aspect-square mb-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl rounded-full overflow-hidden shadow-sm">
        {artist.artworkUrl ? (
          <Image
            src={artist.artworkUrl}
            alt={artist.artistName}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-brand flex items-center justify-center text-3xl font-bold text-bg">
            {initials}
          </div>
        )}
      </div>
      <p className="text-sm font-bold text-primary truncate w-full text-center m-0 group-hover:text-green-500 transition-colors">{artist.artistName}</p>
      <p className="text-xs text-muted mt-1 m-0 uppercase tracking-widest font-semibold">
        Artist
      </p>
    </div>
  )
}

function TrackTile({ track }: { track: ItunesTrack }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore()
  const { requireAuth } = useRequireAuth()
  const artworkUrl = track.artworkUrl100.replace("100x100", "300x300")
  const isCurrentTrack = currentTrack?.trackId === track.trackId
  const isActiveAndPlaying = isCurrentTrack && isPlaying

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
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
    <div className="group/track relative flex flex-col w-full transition-all duration-300 cursor-pointer hover:scale-[1.03]" onClick={handlePlay}>
      <div className="relative w-full aspect-square rounded-[1.25rem] overflow-hidden shadow-sm mb-3 group-hover/track:shadow-md transition-shadow">
        <Image src={artworkUrl} alt={track.trackName} fill className="object-cover transition-transform duration-500 group-hover/track:scale-[1.05]" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/track:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            disabled={!track.previewUrl}
            className={cn("size-12 rounded-full border-0 flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-110", isActiveAndPlaying ? "bg-gradient-brand shadow-glow-sm" : "bg-primary text-bg", !track.previewUrl && "opacity-50 cursor-not-allowed")}
          >
            {isActiveAndPlaying ? <PauseIcon width={16} height={16} className="text-bg" /> : <PlayIcon width={16} height={16} className="text-bg translate-x-[1px]" />}
          </button>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-primary truncate m-0 group-hover/track:text-green-500 transition-colors">{track.trackName}</p>
        <p className="text-xs text-muted mt-0.5 m-0 truncate font-medium">{track.artistName}</p>
      </div>
    </div>
  )
}

// Skeleton loading state for the home page
function BentoSkeletons() {
  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex gap-3">
        <Skeleton className="h-9 w-16 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-48 rounded-md" />
        <div className="flex gap-4 overflow-hidden">
          <Skeleton className="h-16 min-w-[300px] rounded-xl" />
          <Skeleton className="h-16 min-w-[300px] rounded-xl" />
          <Skeleton className="h-16 min-w-[300px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
