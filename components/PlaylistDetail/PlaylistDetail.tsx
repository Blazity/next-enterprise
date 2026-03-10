"use client"

// PlaylistDetail — fetches tracks for single playlist, does lookup, uses SongCard
// wednesday-dev: dedicated local state for the tracks and enriched iTunes metadata

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { ChevronLeftIcon, CloseIcon } from "components/icons"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"
import { getPlaylist, removeTrack } from "lib/api/playlists"
import type { Playlist, PlaylistTrack } from "lib/api/playlists"
import { fetchTracksByIds } from "lib/itunes/api"
import type { ItunesTrack } from "lib/itunes/types"

interface PlaylistDetailProps {
  playlistId: string
  onBack: () => void
}

export function PlaylistDetail({ playlistId, onBack }: PlaylistDetailProps) {
  const { getToken } = useAuth()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [enrichedTracks, setEnrichedTracks] = useState<ItunesTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true)
      try {
        const token = await getToken()
        const res = await getPlaylist(token, playlistId)
        if (res.data) {
          setPlaylist(res.data)
          
          if (res.data.tracks && res.data.tracks.length > 0) {
            // map them
            const trackIds = res.data.tracks.map((t: PlaylistTrack) => t.trackId)
            const itunesTracks = await fetchTracksByIds(trackIds)
            // Re-order based on playlist tracks array
            const trackMap = new Map(itunesTracks.map(t => [t.trackId, t]))
            const ordered = trackIds.map((id: number) => trackMap.get(id)).filter(Boolean) as ItunesTrack[]
            
            setEnrichedTracks(ordered)
          }
        }
      } catch (err) {
        console.error("Failed to load playlist", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDetail()
  }, [playlistId, getToken])

  async function handleRemove(trackId: number) {
    try {
      const token = await getToken()
      await removeTrack(token, playlistId, trackId)
      setEnrichedTracks(prev => prev.filter(t => t.trackId !== trackId))
      setPlaylist((prev: Playlist | null) => {
        if (!prev || !prev.tracks) return prev
        return {
          ...prev,
          tracks: prev.tracks.filter((t: PlaylistTrack) => t.trackId !== trackId)
        }
      })
    } catch (err) {
      console.error("Failed to remove track", err)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in-up">
        <Skeleton className="h-5 w-28 mb-6" />
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-40 mb-6" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white mb-2">Playlist not found</h2>
        <button onClick={onBack} className="text-primary hover:underline bg-transparent border-0 cursor-pointer">
          Back to Playlists
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 py-1 -ml-1 mb-6 rounded-lg border-0 bg-transparent text-muted hover:text-white transition-colors cursor-pointer"
          aria-label="Back to playlists"
        >
          <ChevronLeftIcon width={18} height={18} />
          <span className="text-sm">Back to playlists</span>
        </button>
        <h1 className="text-3xl font-bold text-white m-0 tracking-tight">{playlist.name}</h1>
        {playlist.description && (
          <p className="text-sm text-muted mt-1 m-0">{playlist.description}</p>
        )}
        <p className="text-sm text-muted mt-2 m-0">
          {playlist.tracks?.length || 0} track{playlist.tracks?.length !== 1 && "s"}
        </p>
      </div>

      {/* Tracks List */}
      <div className="flex flex-col gap-2">
        {enrichedTracks.length === 0 ? (
          <div className="text-center py-20 bg-surface-elevated rounded-2xl border border-[#27272a] border-dashed">
            <p className="text-muted m-0">This playlist is empty.</p>
            <p className="text-sm text-[#71717a] mt-2 m-0">Search for songs and add them here!</p>
          </div>
        ) : (
          enrichedTracks.map((track, i) => (
            <div key={`${track.trackId}-${i}`} className="group relative pr-12">
              <SongCard track={track} />
              <button
                onClick={() => handleRemove(track.trackId)}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-0 cursor-pointer hover:bg-red-500/20"
                aria-label="Remove track"
                title="Remove track"
              >
                <CloseIcon width={12} height={12} /> {/* Just using an icon for removal indicator */}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
