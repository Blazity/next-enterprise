"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

import { DashboardShell } from "components/DashboardShell/DashboardShell"
import { PlaylistDetail } from "components/PlaylistDetail/PlaylistDetail"
import { Skeleton } from "components/Skeleton/Skeleton"

import { getPlaylistByToken, getSharedWithMe, type Playlist } from "lib/api/playlists"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { usePlaylistStore } from "store/usePlaylistStore"

export default function SharedPlaylistPage() {
  const { token: shareToken } = useParams()
  const { getToken, isSignedIn, isLoaded } = useAuth()
  const { requireAuth } = useRequireAuth()
  const router = useRouter()

  const { setSharedPlaylists } = usePlaylistStore()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || playlist || error) return

    if (!isSignedIn) {
      requireAuth(() => {}) // Trigger sign-in modal
      return
    }

    async function fetchSharedPlaylist() {
      setIsLoading(true)
      try {
        const token = await getToken()
        const result = await getPlaylistByToken(token, shareToken as string)
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

    fetchSharedPlaylist()
  }, [isLoaded, isSignedIn, shareToken, getToken, requireAuth, playlist, error])

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

  if (!isLoaded || (isSignedIn && isLoading)) {
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
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
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
      <PlaylistDetail 
        playlistId={playlist.id} 
        onBack={() => router.push("/")} 
      />
    </DashboardShell>
  )
}
