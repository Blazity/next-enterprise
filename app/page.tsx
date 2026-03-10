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

import { type ActiveView, SEARCH_DEBOUNCE_MS } from "lib/constants"
import { useDebounce } from "lib/hooks/useDebounce"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { searchAlbums, searchArtists, searchSongs } from "lib/itunes/api"
import type { ItunesAlbum, ItunesArtist, ItunesTrack } from "lib/itunes/types"
import { isHomeView, ternary } from "lib/utils"
 

export default function HomePage() {
  const { requireAuth } = useRequireAuth()
  const [activeView, setActiveView] = useState<ActiveView>("home")
  const [query, setQuery] = useState("")
  const [songs, setSongs] = useState<ItunesTrack[]>([])
  const [albums, setAlbums] = useState<ItunesAlbum[]>([])
  const [artists, setArtists] = useState<ItunesArtist[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const debouncedQuery = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS)

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
      } catch(error:unknown) {
          console.error("Search failed:", error);
      } finally {
        setIsLoadingSearch(false)
      }
    })
  }, [debouncedQuery])

  function handleNavClick(view: ActiveView) {
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
    <div className="flex h-screen overflow-hidden pb-[72px] box-border bg-bg">
      <Sidebar activeView={activeView} onNavClick={handleNavClick} />

      <div className="flex-1 flex flex-col overflow-hidden bg-bg">
        <TopNav
          query={query}
          inputRef={searchInputRef}
          onChange={handleQueryChange}
        />

        <main className="flex-1 overflow-y-auto px-8 py-7">
          {activeView === "playlists" ? (
            <PlaylistsView />
          ) : ternary(
            isHomeView(activeView),
            <HomeContent activeView={activeView as Exclude<ActiveView, "search" | "playlists">} />,
            <SearchResults
              songs={songs}
              albums={albums}
              artists={artists}
              isLoading={isLoadingSearch}
              hasSearched={hasSearched}
            />
          )}
        </main>
      </div>
    </div>
  )
}
