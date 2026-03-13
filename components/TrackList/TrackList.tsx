"use client"

import { SearchX } from "lucide-react"

import { TrackCard } from "components/TrackCard/TrackCard"
import { TrackCardSkeleton } from "components/TrackCardSkeleton/TrackCardSkeleton"
import { iTunesTrack } from "lib/itunes"
import { Playlist } from "lib/types"

import { TrackTable } from "./TrackTable"

interface TrackListProps {
  tracks: (iTunesTrack & { addedAt?: string })[]
  currentTrackId: number | null
  viewMode?: "grid" | "list"
  isPlaying: boolean
  onPlay: (track: iTunesTrack) => void
  onPause: () => void
  isLoading: boolean
  likedSongIds?: number[]
  onToggleLike?: (track: iTunesTrack) => void
  onAddToPlaylist?: (track: iTunesTrack, playlistId: string) => void
  playlists?: Playlist[]
}

export function TrackList({ 
  tracks, 
  currentTrackId, 
  viewMode = "grid",
  isPlaying, 
  onPlay, 
  onPause, 
  isLoading,
  likedSongIds = [],
  onToggleLike,
  onAddToPlaylist,
  playlists = []
}: TrackListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {Array.from({ length: 14 }).map((_, i) => (
          <TrackCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (tracks.length === 0) {
    // ... (no changes to empty state)
    return (
      <div
        id="no-results"
        className="animate-in fade-in zoom-in-95 flex flex-col items-center justify-center py-32 text-center duration-500"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/30">
          <SearchX className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-white">No audio waves found</h2>
        <p className="text-sm text-slate-400">Try a different search term to find the right vibe.</p>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <TrackTable
        tracks={tracks}
        currentTrackId={currentTrackId}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        likedSongIds={likedSongIds}
        onToggleLike={onToggleLike}
      />
    )
  }

  return (
    <div
      id="track-list"
      className="animate-in fade-in grid grid-cols-2 gap-6 duration-500 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
    >
      {tracks.map((track) => (
        <TrackCard
          key={track.trackId}
          track={track}
          isPlaying={isPlaying && currentTrackId === track.trackId}
          isCurrentTrack={currentTrackId === track.trackId}
          onPlay={onPlay}
          onPause={onPause}
          isLiked={likedSongIds.includes(track.trackId)}
          onToggleLike={onToggleLike}
          onAddToPlaylist={onAddToPlaylist}
          playlists={playlists}
        />
      ))}
    </div>
  )
}
