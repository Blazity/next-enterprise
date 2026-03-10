"use client"

import { SearchX } from "lucide-react"
import { TrackCard } from "components/TrackCard/TrackCard"
import { TrackCardSkeleton } from "components/TrackCardSkeleton/TrackCardSkeleton"
import type { iTunesTrack } from "lib/itunes"

interface TrackListProps {
  tracks: iTunesTrack[]
  currentTrackId: number | null
  isPlaying: boolean
  onPlay: (track: iTunesTrack) => void
  onPause: () => void
  isLoading: boolean
}

export function TrackList({ tracks, currentTrackId, isPlaying, onPlay, onPause, isLoading }: TrackListProps) {
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
        />
      ))}
    </div>
  )
}
