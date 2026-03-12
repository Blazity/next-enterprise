"use client"

// Music Discovery — Spotify-inspired desktop layout
// Layout: Sidebar (fixed left) + Main (TopNav + scrollable content) + MiniPlayer (in layout.tsx)
// wednesday-design: dark surfaces, green accents, card rows, premium feel
// wednesday-dev: local useState for search, useRef for input focus

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useFeatureFlagEnabled } from "posthog-js/react"

import { AlbumDetailView } from "components/AlbumDetailView/AlbumDetailView"
import { ArtistDetailView } from "components/ArtistDetailView/ArtistDetailView"
import { DashboardShell } from "components/DashboardShell/DashboardShell"
import { GenreDetailView } from "components/GenreDetailView/GenreDetailView"
import { HomeContent } from "components/HomeContent/HomeContent"
import { PlaylistsView } from "components/PlaylistsView/PlaylistsView"
import { PodcastDetailView } from "components/PodcastDetailView/PodcastDetailView"
import { SearchResults } from "components/SearchResults/SearchResults"

import { getSharedWithMe } from "lib/api/playlists"
import { ACTIVE_VIEWS, type ActiveView, SEARCH_DEBOUNCE_MS } from "lib/constants"
import { useDebounce } from "lib/hooks/useDebounce"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { searchAlbums, searchArtists, searchSongs } from "lib/itunes/api"
import type { ItunesAlbum, ItunesArtist, ItunesTrack } from "lib/itunes/types"
import { isHomeView, ternary } from "lib/utils"
import { usePlaylistStore } from "store/usePlaylistStore"


export default function HomePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-bg" />}>
      <HomeContentWrapper />
    </Suspense>
  )
}

function HomeContentWrapper() {
  const { getToken, isSignedIn } = useAuth()
  const { requireAuth } = useRequireAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const viewParam = searchParams.get("view") as ActiveView | null
  const activeView = viewParam && ACTIVE_VIEWS.includes(viewParam) ? viewParam : "home"
  const activeId = searchParams.get("id") ?? undefined

  const [query, setQuery] = useState("")
  const [songs, setSongs] = useState<ItunesTrack[]>([])
  const [albums, setAlbums] = useState<ItunesAlbum[]>([])
  const [artists, setArtists] = useState<ItunesArtist[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const debouncedQuery = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS)

  const { setSharedPlaylists, setSelectedPlaylistId } = usePlaylistStore()
  const isPlaylistEnabled = useFeatureFlagEnabled("playlist-feature") ?? false

  useEffect(() => {
    if (activeView === "playlists" && !isPlaylistEnabled) {
      router.replace("/?view=home", { scroll: false })
    }
  }, [activeView, isPlaylistEnabled, router])

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
      if (activeView !== "search") {
        router.push("/?view=search", { scroll: false })
      }
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

  function handleNavClick(view: ActiveView, id?: string) {
    if (view === "playlists") {
      requireAuth(() => router.push(`/?view=${view}`, { scroll: false }))
      return
    }

    let url = `/?view=${view}`
    if (id) url += `&id=${id}`
    router.push(url, { scroll: false })
    
    if (view === "search") {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    if (!value && activeView === "search") {
      router.push("/?view=home", { scroll: false })
    }
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
      ) : activeView === "album_detail" ? (
        <AlbumDetailView onBack={() => handleNavClick("albums")} />
      ) : activeView === "artist_detail" ? (
        <ArtistDetailView onBack={() => handleNavClick("artists")} />
      ) : activeView === "podcast_detail" && activeId ? (
        <PodcastDetailView podcastId={activeId} onBack={() => handleNavClick("podcasts")} />
      ) : activeView === "genre_detail" && activeId ? (
        <GenreDetailView genreName={activeId} onBack={() => handleNavClick("home")} />
      ) : ternary(
        isHomeView(activeView),
        <HomeContent 
          activeView={activeView as Exclude<ActiveView, "search" | "playlists" | "album_detail" | "artist_detail">} 
          activeId={activeId}
          onPlaylistClick={(id) => {
            setSelectedPlaylistId(id)
            handleNavClick("playlists")
          }}
          onNavClick={handleNavClick}
        />,
        <SearchResults
          songs={songs}
          albums={albums}
          artists={artists}
          isLoading={isLoadingSearch}
          hasSearched={hasSearched}
          onNavClick={handleNavClick}
        />
      )}
    </DashboardShell>
  )
}
