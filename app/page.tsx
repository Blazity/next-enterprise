"use client"

import { Flame, Music3, Search } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { NowPlayingBar } from "components/NowPlayingBar/NowPlayingBar"
import { SearchBar } from "components/SearchBar/SearchBar"
import { TopNav } from "components/TopNav/TopNav"
import { TrackCard } from "components/TrackCard/TrackCard"
import { TrackList } from "components/TrackList/TrackList"
import type { iTunesTrack } from "lib/itunes"

const SUGGESTED_SEARCHES = ["Chill", "Workout", "Focus", "Party", "Pop", "Electronic"]

export default function AuraMusicPage() {
  const [tracks, setTracks] = useState<iTunesTrack[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<iTunesTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("Top Hits")

  // ─── Independent Player State ─────────────────────────────────────
  // currentTrack stores the actual track object, completely independent
  // of the tracks[] search results array. Searching or clearing search
  // will never affect what the player displays or plays.
  const [currentTrack, setCurrentTrack] = useState<iTunesTrack | null>(null)
  // playbackContext remembers which list the track was played from,
  // so Next/Prev can step through the correct list.
  const [playbackContext, setPlaybackContext] = useState<"search" | "recent" | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ─── LocalStorage ────────────────────────────────────────────────

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aura_recent_tracks")
      if (stored) {
        setRecentlyPlayed(JSON.parse(stored) as iTunesTrack[])
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const saveToRecent = useCallback((track: iTunesTrack) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => t.trackId !== track.trackId)
      const next = [track, ...filtered].slice(0, 8)
      try {
        localStorage.setItem("aura_recent_tracks", JSON.stringify(next))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }, [])

  // ─── Search ──────────────────────────────────────────────────────

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    setSearchQuery(query)

    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error("Search failed")
      const data = (await res.json()) as { tracks: iTunesTrack[] }

      setTracks(data.tracks)
      // Player state (currentTrack, isPlaying) is NOT touched here.
      // The user keeps listening uninterrupted.
    } catch (err) {
      console.error("Search error:", err)
      setTracks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleClearSearch = useCallback(() => {
    handleSearch("Top Hits")
  }, [handleSearch])

  const hasMounted = useRef(false)

  // Initial load fetch
  useEffect(() => {
    if (!hasMounted.current) {
      handleSearch("Top Hits")
      hasMounted.current = true
    }
  }, [handleSearch])

  // ─── Playback ────────────────────────────────────────────────────

  const playTrack = useCallback(
    (track: iTunesTrack) => {
      if (!track.previewUrl) return

      if (!audioRef.current) {
        audioRef.current = new Audio()
      }
      const audio = audioRef.current

      // If same track is already loaded, just resume
      if (currentTrack?.trackId === track.trackId) {
        audio.play()
        setIsPlaying(true)
        return
      }

      // New track — switch audio source
      audio.pause()
      audio.src = track.previewUrl
      audio.play()
      setCurrentTrack(track)
      setIsPlaying(true)
      saveToRecent(track)
    },
    [currentTrack, saveToRecent]
  )

  const handlePlayFromCard = useCallback(
    (track: iTunesTrack, context: "search" | "recent") => {
      setPlaybackContext(context)
      playTrack(track)
    },
    [playTrack]
  )

  const handlePause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      handlePause()
    } else if (currentTrack) {
      // Resume — the audio element still has the correct src
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }, [isPlaying, currentTrack, handlePause])

  const handleNext = useCallback(() => {
    if (!currentTrack || !playbackContext) return
    const list = playbackContext === "search" ? tracks : recentlyPlayed
    const currentIndex = list.findIndex((t) => t.trackId === currentTrack.trackId)
    if (currentIndex !== -1 && currentIndex < list.length - 1) {
      playTrack(list[currentIndex + 1]!)
    }
  }, [currentTrack, playbackContext, tracks, recentlyPlayed, playTrack])

  const handlePrev = useCallback(() => {
    if (!currentTrack || !playbackContext) return
    const list = playbackContext === "search" ? tracks : recentlyPlayed
    const currentIndex = list.findIndex((t) => t.trackId === currentTrack.trackId)
    if (currentIndex > 0) {
      playTrack(list[currentIndex - 1]!)
    }
  }, [currentTrack, playbackContext, tracks, recentlyPlayed, playTrack])

  // Derive Next/Prev availability from current track position in active list
  const currentList = playbackContext === "search" ? tracks : recentlyPlayed
  const currentIndexInList = currentTrack ? currentList.findIndex((t) => t.trackId === currentTrack.trackId) : -1
  const hasNext = currentIndexInList !== -1 && currentIndexInList < currentList.length - 1
  const hasPrev = currentIndexInList > 0

  const isHomeView = searchQuery === "Top Hits"

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <main className="min-h-screen pb-32">
      <TopNav onHome={handleClearSearch} />

      {/* Hero Search Section & Suggested Chips */}
      <div className="from-aura-bg relative mx-auto flex max-w-screen-xl flex-col items-center overflow-hidden border-b border-white/5 bg-gradient-to-b to-transparent px-4 pt-16 pb-12">
        {/* Decorative background glow */}
        <div className="bg-aura-primary/10 pointer-events-none absolute top-[-50%] left-1/2 aspect-[2/1] w-full max-w-3xl -translate-x-1/2 rounded-[100%] blur-[120px]" />

        <h1 className="animate-in slide-in-from-bottom-3 z-10 mb-10 bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-center text-4xl font-black tracking-tight text-transparent duration-700 md:text-5xl">
          What&apos;s your aura today?
        </h1>

        <div className="animate-in slide-in-from-bottom-4 relative z-10 w-full delay-75 duration-700">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />
        </div>

        {/* Suggested Searches */}
        <div className="animate-in slide-in-from-bottom-5 z-10 mt-8 flex flex-wrap items-center justify-center gap-3 delay-150 duration-700">
          {SUGGESTED_SEARCHES.map((pill) => (
            <button
              key={pill}
              onClick={() => handleSearch(pill)}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-300 shadow-sm transition-all hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6">
        {isHomeView && recentlyPlayed.length > 0 && (
          <div className="animate-in fade-in mb-16 duration-700">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Music3 className="text-aura-primary h-4 w-4" />
              </span>
              Recently Played
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {recentlyPlayed.map((track, i) => (
                <TrackCard
                  key={`recent-${track.trackId}-${i}`}
                  track={track}
                  isCurrentTrack={currentTrack?.trackId === track.trackId}
                  isPlaying={currentTrack?.trackId === track.trackId && isPlaying}
                  onPlay={(t) => handlePlayFromCard(t, "recent")}
                  onPause={handlePause}
                />
              ))}
            </div>
          </div>
        )}

        <div className="animate-in fade-in duration-700">
          <div className="mb-6 flex items-center gap-3">
            {isHomeView ? (
              <Flame className="text-aura-secondary h-6 w-6" />
            ) : (
              <Search className="text-aura-primary h-6 w-6" />
            )}
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isHomeView ? "Trending Now" : `Results for "${searchQuery}"`}
            </h2>
          </div>

          <TrackList
            tracks={tracks}
            currentTrackId={currentTrack?.trackId ?? null}
            isPlaying={isPlaying}
            onPlay={(t) => handlePlayFromCard(t, "search")}
            onPause={handlePause}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Now Playing */}
      <NowPlayingBar
        track={currentTrack}
        isPlaying={isPlaying}
        audioRef={audioRef}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </main>
  )
}
