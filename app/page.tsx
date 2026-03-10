"use client"

// Music Discovery — Spotify-inspired desktop layout
// Layout: Sidebar (fixed left) + Main (TopNav + scrollable content) + MiniPlayer (in layout.tsx)
// wednesday-design: dark surfaces, green accents, card rows, premium feel
// wednesday-dev: local useState for search, useRef for input focus

import { useEffect, useRef, useState } from "react"

import { HomeContent } from "components/HomeContent/HomeContent"
import { PlaylistsView } from "components/PlaylistsView/PlaylistsView"
import { SearchResults } from "components/SearchResults/SearchResults"
import { Sidebar } from "components/Sidebar/Sidebar"
import { TopNav } from "components/TopNav/TopNav"
import { DashboardShell } from "components/DashboardShell/DashboardShell"
import { useAuth } from "@clerk/nextjs"
import { useFeatureFlagEnabled } from "posthog-js/react"

import { type ActiveView, SEARCH_DEBOUNCE_MS } from "lib/constants"
import { useDebounce } from "lib/hooks/useDebounce"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { searchAlbums, searchArtists, searchSongs } from "lib/itunes/api"
import type { ItunesAlbum, ItunesArtist, ItunesTrack } from "lib/itunes/types"
import { isHomeView, ternary } from "lib/utils"
import { usePlaylistStore } from "store/usePlaylistStore"
import { getSharedWithMe } from "lib/api/playlists"


export default function HomePage() {
  const { getToken, isSignedIn } = useAuth()
  const { requireAuth } = useRequireAuth()
  const [activeView, setActiveView] = useState<ActiveView>("home")
  const [query, setQuery] = useState("")
  const [songs, setSongs] = useState<ItunesTrack[]>([])
  const [albums, setAlbums] = useState<ItunesAlbum[]>([])
  const [artists, setArtists] = useState<ItunesArtist[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const debouncedQuery = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS)

  const { setSharedPlaylists, sharedPlaylists, selectedPlaylistId, setSelectedPlaylistId } = usePlaylistStore()
  const isPlaylistEnabled = useFeatureFlagEnabled("playlist-feature") ?? false

  useEffect(() => {
    if (activeView === "playlists" && !isPlaylistEnabled) {
      setActiveView("home")
    }
  }, [activeView, isPlaylistEnabled])

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

  // Search-as-you-type: fire when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) return
    requireAuth(async () => {
      setActiveView("search")
      setIsLoadingSearch(true)
      setHasSearched(true)

      try {
        const [songsResult, albumsResult, artistsResult] = await Promise.all([
          searchSongs(debouncedQuery),
          searchAlbums(debouncedQuery),
          searchArtists(debouncedQuery),
        ])

        setSongs(songsResult)
        setAlbums(albumsResult)
        setArtists(artistsResult)
      } catch (error: unknown) {
        console.error("Search failed:", error);
      } finally {
        setIsLoadingSearch(false)
      }
    })
  }, [debouncedQuery])

  function handleNavClick(view: ActiveView) {
    if (view === "playlists") {
      requireAuth(() => setActiveView(view))
      return
    }

    setActiveView(view)
    if (view === "search") {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    if (!value) setActiveView("home")
  }

  return (
    <DashboardShell
      activeView={activeView}
      onNavClick={handleNavClick}
      query={query}
      onQueryChange={handleQueryChange}
    >
      {activeView === "playlists" ? (
        <PlaylistsView />
      ) : ternary(
        isHomeView(activeView),
        <HomeContent 
          activeView={activeView as Exclude<ActiveView, "search" | "playlists">} 
          onPlaylistClick={(id) => {
            setSelectedPlaylistId(id)
            setActiveView("playlists")
          }}
        />,
        <SearchResults
          songs={songs}
          albums={albums}
          artists={artists}
          isLoading={isLoadingSearch}
          hasSearched={hasSearched}
        />
      )}
    </DashboardShell>
  )
}
