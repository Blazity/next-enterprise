"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

import { DashboardShell } from "components/DashboardShell/DashboardShell"
import { SpinnerIcon } from "components/icons"
import { PlaylistDetail } from "components/PlaylistDetail/PlaylistDetail"
import { Skeleton } from "components/Skeleton/Skeleton"

import { followPlaylist, getPublicPlaylist, getSharedWithMe, type Playlist } from "lib/api/playlists"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { usePlaylistStore } from "store/usePlaylistStore"
import { useToastStore } from "store/useToastStore"

export default function SharedPlaylistPage() {
  const { token: shareToken } = useParams()
  const { getToken, isSignedIn, isLoaded } = useAuth()
  const { requireAuth } = useRequireAuth()
  const router = useRouter()
  const { addToast } = useToastStore()

  const { setSharedPlaylists } = usePlaylistStore()
  const [playlist, setPlaylist] = useState<(Playlist & { isFollowing?: boolean; isPublic?: boolean }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || playlist || error) return

    async function fetchPublicPlaylist() {
      setIsLoading(true)
      try {
        const result = await getPublicPlaylist(shareToken as string)
        if (result.data) {
          setPlaylist(result.data)
        } else if (result.error) {
          setError(result.error)
        }
      } catch {
        setError("An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicPlaylist()
  }, [isLoaded, shareToken, playlist, error])

  useEffect(() => {
    async function loadShared() {
      if (isSignedIn) {
        try {
          const token = await getToken()
          const res = await getSharedWithMe(token)
          if (res.data) {
            setSharedPlaylists(res.data)
          }
        } catch (err) {
          console.error("Failed to load shared playlists", err)
        }
      }
    }
    loadShared()
  }, [isSignedIn, getToken, setSharedPlaylists])

  async function handleFollow() {
    if (!playlist) return
    
    requireAuth(async () => {
      setIsFollowing(true)
      try {
        const token = await getToken()
        const result = await followPlaylist(token, playlist.id)
        if (result.data) {
          addToast("Added to library")
          setPlaylist(prev => prev ? { ...prev, isFollowing: true } : null)
        } else if (result.error) {
          addToast(result.error, "error")
        }
      } catch {
        addToast("Failed to follow playlist", "error")
      } finally {
        setIsFollowing(false)
      }
    })
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-bg p-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Link Expired</h1>
          <p className="text-muted mb-8">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 rounded-full border-0 bg-primary font-bold text-black cursor-pointer hover:scale-105 transition-transform"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!playlist) return null

  return (
    <DashboardShell
      activeView="playlists"
      onNavClick={() => router.push("/")}
      query=""
      onQueryChange={() => {}}
    >
      <div className="relative">
        {/* Follow Button overlay for public view */}
        {playlist.isPublic && !playlist.isFollowing && (
            <div className="absolute top-0 right-0 z-10">
                <button
                    onClick={handleFollow}
                    disabled={isFollowing}
                    className="px-4 py-1.5 rounded-full border-0 bg-primary font-bold text-black text-xs cursor-pointer hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-1.5"
                >
                    {isFollowing ? <SpinnerIcon className="animate-spin" width={14} height={14} /> : null}
                    Add to my playlists
                </button>
            </div>
        )}
        
        <PlaylistDetail 
          playlistId={playlist.id} 
          onBack={() => router.push("/")} 
          initialData={playlist}
        />
      </div>
    </DashboardShell>
  )
}
