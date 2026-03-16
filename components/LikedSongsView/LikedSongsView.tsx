"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { HeartFilledIcon } from "components/icons"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"
import { fetchTracksByIds } from "lib/itunes/api"
import type { ItunesTrack } from "lib/itunes/types"
import { useLikeStore } from "store/useLikeStore"

export function LikedSongsView() {
  const { getToken } = useAuth()
  const { likedIds, fetchLikes, isLoading: isLikesLoading } = useLikeStore()
  const [tracks, setTracks] = useState<ItunesTrack[]>([])
  const [isTracksLoading, setIsTracksLoading] = useState(false)

  useEffect(() => {
    async function init() {
      const token = await getToken()
      await fetchLikes(token)
    }
    init()
  }, [getToken, fetchLikes])

  useEffect(() => {
    async function loadTracks() {
      if (likedIds.size === 0) {
        setTracks([])
        return
      }
      
      setIsTracksLoading(true)
      try {
        const idArray = Array.from(likedIds)
        const fetchedTracks = await fetchTracksByIds(idArray)
        
        // Preserve order of likes if possible, or just sort by trackId
        // fetchTracksByIds returns in iTunes' own order, let's keep it as is
        setTracks(fetchedTracks)
      } catch (err) {
        console.error("Failed to load liked tracks", err)
      } finally {
        setIsTracksLoading(false)
      }
    }
    
    // Only reload if the sets of IDs actually changed significantly 
    // (A simple toggle shouldn't necessarily trigger a full re-fetch of all tracks 
    // but for now it's fine as the set is usually small)
    loadTracks()
  }, [likedIds])

  const isLoading = isLikesLoading || isTracksLoading

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight m-0">Liked Songs</h1>
        <p className="text-muted mt-1.5 m-0 text-sm sm:text-base">
          {tracks.length} track{tracks.length !== 1 ? 's' : ''} saved to your library.
        </p>
      </div>

      {isLoading && tracks.length === 0 ? (
        <div className="flex flex-col gap-1 max-w-5xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="size-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-24 px-6 bg-surface-elevated/60 rounded-2xl border border-border border-dashed">
          <HeartFilledIcon width={56} height={56} className="text-muted/40 mx-auto mb-5" />
          <p className="text-lg text-primary font-medium m-0">No liked songs yet</p>
          <p className="text-sm text-muted mt-2 m-0 max-w-sm mx-auto">
            Click the heart icon on any song to save it here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5 w-full max-w-5xl">
          {tracks.map((track, i) => (
            <div key={track.trackId} className="flex items-center gap-1 md:gap-4 w-full group">
              <span className="w-4 md:w-5 text-xs md:text-sm font-bold text-muted text-right group-hover:text-primary transition-colors shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <SongCard 
                  track={track} 
                  context={tracks} 
                  contextIndex={i} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
