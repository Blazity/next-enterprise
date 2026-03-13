"use client"

import { Grid, Heart, List, Music, Play, Plus, Search, Shuffle, User as UserIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { AuthOverlay } from "components/Auth/AuthOverlay"
import { NowPlayingBar } from "components/NowPlayingBar/NowPlayingBar"
import { useAuth } from "components/Providers/AuthProvider"
import { Sidebar } from "components/Sidebar/Sidebar"
import { TopNav } from "components/TopNav/TopNav"
import { TrackCard } from "components/TrackCard/TrackCard"
import { TrackList } from "components/TrackList/TrackList"
import { getLikedSongs, toggleLikeSong } from "lib/actions/liked-songs"
import { addSongToPlaylist, getPlaylists, getPlaylistSongs } from "lib/actions/playlists"
import { iTunesTrack } from "lib/itunes"
import { LikedSong, Playlist } from "lib/types"

const SUGGESTED_SEARCHES = ["Chill", "Workout", "Focus", "Party", "Pop", "Electronic"]

export default function AuraMusicPage() {
  const { user } = useAuth()
  const [tracks, setTracks] = useState<(iTunesTrack & { addedAt?: string })[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<iTunesTrack[]>([])
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("Top Hits")
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  
  // Library / Navigation State
  const [activePlaylistId, setActivePlaylistId] = useState<string | "liked" | "library" | "home">("home")
  const [playlistTracks, setPlaylistTracks] = useState<(iTunesTrack & { addedAt?: string })[]>([])
  const [currentPlaylistName, setCurrentPlaylistName] = useState<string>("")
  const [isAddingSongs, setIsAddingSongs] = useState(false)
  const [playlistSearchTracks, setPlaylistSearchTracks] = useState<iTunesTrack[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isShuffle, setIsShuffle] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [featuredTrack, setFeaturedTrack] = useState<iTunesTrack | null>(null)

  // ─── Independent Player State ─────────────────────────────────────
  const [currentTrack, setCurrentTrack] = useState<iTunesTrack | null>(null)
  const [playbackContext, setPlaybackContext] = useState<"search" | "recent" | "playlist" | "library" | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ─── Search Logic ───────────────────────────────────────────────

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    // Only set isSearching to true if it's NOT the default "Top Hits"
    setIsSearching(query !== "Top Hits")
    setSearchQuery(query)
    
    if (activePlaylistId !== "home" && query !== "Top Hits") {
      setActivePlaylistId("home")
    }

    try {
      const res = await fetch(`http://localhost:4000/v1/music/search?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error("Search failed")
      const data = (await res.json()) as { tracks: iTunesTrack[] }
      setTracks(data.tracks)
    } catch (err) {
      console.error("Search error:", err)
      setTracks([])
    } finally {
      setIsLoading(false)
    }
  }, [activePlaylistId])

  const handleClearSearch = useCallback(() => {
    setIsSearching(false)
    setSearchQuery("Top Hits")
    handleSearch("Top Hits")
  }, [handleSearch])

  // ─── Playlist Content Fetching ───────────────────────────────────

  const fetchPlaylistTracks = useCallback(async (id: string | "liked" | "library") => {
    setIsLoading(true)
    try {
      if (id === "liked") {
        setCurrentPlaylistName("Liked Songs")
        const songs = await getLikedSongs()
        setPlaylistTracks(songs.map((s: LikedSong) => ({ ...s.trackData, addedAt: s.createdAt })))
      } else if (id === "library") {
        setCurrentPlaylistName("My Library")
        setPlaylistTracks([])
      } else {
        const p = playlists.find(pl => pl.id === id)
        setCurrentPlaylistName(p?.name || "Playlist")
        const songs = await getPlaylistSongs(id)
        setPlaylistTracks(songs as (iTunesTrack & { addedAt?: string })[])
      }
    } catch (err) {
      console.error("Failed to fetch tracks:", err)
    } finally {
      setIsLoading(false)
    }
  }, [playlists])

  const handleSelectPlaylist = useCallback((id: string | "liked" | "library" | "home") => {
    setActivePlaylistId(id)
    setIsAddingSongs(false)
    setIsSearching(false) // Exit global search mode when selecting a playlist
    setPlaylistTracks([]) // Clear tracks immediately to prevent stale "ghost" duplicates
    if (id === "home") {
      setSearchQuery("Top Hits")
      handleSearch("Top Hits")
    } else {
      fetchPlaylistTracks(id as string)
    }
  }, [fetchPlaylistTracks, handleSearch])

  // ─── Initial Data Sync ──────────────────────────────────────────

  const fetchInitialData = useCallback(async () => {
    if (!user) {
      setLikedSongs([])
      setPlaylists([])
      return
    }
    const [songs, userPlaylists] = await Promise.all([
      getLikedSongs(),
      getPlaylists()
    ])
    setLikedSongs(songs)
    setPlaylists(userPlaylists)
  }, [user])

  useEffect(() => {
    fetchInitialData()
    // Trigger initial "Top Hits" search on load to ensure home view isn't empty
    const initFetch = async () => {
      await handleSearch("Top Hits")
    }
    initFetch()
  }, [fetchInitialData, handleSearch])

  // Set a random featured track when tracks are loaded (only for initial load)
  useEffect(() => {
    if (tracks.length > 0 && !featuredTrack) {
      const random = tracks[Math.floor(Math.random() * tracks.length)]
      if (random) setFeaturedTrack(random)
    }
  }, [tracks, featuredTrack])

  const likedSongIds = likedSongs.map(s => s.trackId)

  const handleToggleLike = useCallback(async (track: iTunesTrack) => {
    if (!user) {
      setIsAuthOpen(true)
      return
    }

    const isLiked = likedSongIds.includes(track.trackId)
    
    // Optimistic update
    if (isLiked) {
      setLikedSongs(prev => prev.filter(s => s.trackId !== track.trackId))
    } else {
      setLikedSongs(prev => [{ trackId: track.trackId, createdAt: new Date().toISOString(), trackData: track }, ...prev])
    }

    try {
      await toggleLikeSong(track, isLiked)
      if (activePlaylistId === "liked" || activePlaylistId === "library") {
        fetchPlaylistTracks(activePlaylistId)
      }
    } catch (error) {
      console.error("Failed to toggle like:", error)
      fetchInitialData()
    }
  }, [user, likedSongIds, fetchInitialData, activePlaylistId, fetchPlaylistTracks])

  const handleAddToPlaylist = useCallback(async (track: iTunesTrack, playlistId: string) => {
    try {
      await addSongToPlaylist(playlistId, track)
      if (activePlaylistId === playlistId) fetchPlaylistTracks(playlistId)
      fetchInitialData() // Refresh counts for library/sidebar
    } catch (err) {
      console.error("Failed to add to playlist:", err)
    }
  }, [activePlaylistId, fetchPlaylistTracks, fetchInitialData])

  // ─── Inner Playlist Search ──────────────────────────────────────
  const innerSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePlaylistSearch = useCallback(async (query: string) => {
    if (innerSearchDebounceRef.current) {
      clearTimeout(innerSearchDebounceRef.current)
    }

    if (!query.trim()) {
      setPlaylistSearchTracks([])
      return
    }

    innerSearchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:4000/v1/music/search?q=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error("Search failed")
        const data = (await res.json()) as { tracks: iTunesTrack[] }
        setPlaylistSearchTracks(data.tracks)
      } catch (err) {
        console.error(err)
      }
    }, 500)
  }, [])

  // ─── LocalStorage ────────────────────────────────────────────────

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aura_recent_tracks")
      if (stored) setRecentlyPlayed(JSON.parse(stored) as iTunesTrack[])
    } catch (e) {
      console.error(e)
    }
  }, [])

  const saveToRecent = useCallback((track: iTunesTrack) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.trackId !== track.trackId)
      const next = [track, ...filtered].slice(0, 8)
      try { localStorage.setItem("aura_recent_tracks", JSON.stringify(next)) } catch (e) { console.error(e) }
      return next
    })
  }, [])

  // ─── Core Playback ─────────────────────────────────────────────

  const playTrack = useCallback((track: iTunesTrack) => {
    if (!track.previewUrl) return
    if (!audioRef.current) audioRef.current = new Audio()
    const audio = audioRef.current

    if (currentTrack?.trackId === track.trackId) {
      audio.play()
      setIsPlaying(true)
      return
    }

    audio.pause()
    audio.src = track.previewUrl
    audio.play()
    setCurrentTrack(track)
    setIsPlaying(true)
    saveToRecent(track)
  }, [currentTrack, saveToRecent])

  const handlePlayFromCard = useCallback((track: iTunesTrack, context: "search" | "recent" | "playlist" | "library") => {
    setPlaybackContext(context)
    playTrack(track)
  }, [playTrack])

  const handlePause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const handlePlayPause = useCallback(() => {
    if (isPlaying) handlePause()
    else if (currentTrack) {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }, [isPlaying, currentTrack, handlePause])

  const handleNext = useCallback(() => {
    if (!currentTrack || !playbackContext) return
    const list = playbackContext === "search" ? tracks : (playbackContext === "recent" ? recentlyPlayed : playlistTracks)
    if (list.length === 0) return

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * list.length)
      playTrack(list[randomIndex]!)
      return
    }

    const currentIndex = list.findIndex(t => t.trackId === currentTrack.trackId)
    if (currentIndex !== -1 && currentIndex < list.length - 1) playTrack(list[currentIndex + 1]!)
  }, [currentTrack, playbackContext, tracks, recentlyPlayed, playlistTracks, playTrack, isShuffle])

  const handlePrev = useCallback(() => {
    if (!currentTrack || !playbackContext) return
    const list = playbackContext === "search" ? tracks : (playbackContext === "recent" ? recentlyPlayed : playlistTracks)
    const currentIndex = list.findIndex(t => t.trackId === currentTrack.trackId)
    if (currentIndex > 0) playTrack(list[currentIndex - 1]!)
  }, [currentTrack, playbackContext, tracks, recentlyPlayed, playlistTracks, playTrack])

  const currentList = playbackContext === "search" ? tracks : (playbackContext === "recent" ? recentlyPlayed : playlistTracks)
  const currentIndexInList = currentTrack ? currentList.findIndex(t => t.trackId === currentTrack.trackId) : -1
  const hasNext = currentIndexInList !== -1 && currentIndexInList < currentList.length - 1
  const hasPrev = currentIndexInList > 0

  // ─── Playback Controls ──────────────────────────────────────────

  const handlePlayAll = useCallback(() => {
    const list = activePlaylistId === "home" ? tracks : playlistTracks
    if (list.length > 0) {
      const track = list[0]!
      setCurrentTrack(track)
      setIsPlaying(true)
      setPlaybackContext(activePlaylistId === "home" ? "search" : (activePlaylistId === "liked" ? "library" : "playlist"))
      saveToRecent(track)
      if (audioRef.current) {
        audioRef.current.src = track.previewUrl
        audioRef.current.play()
      }
    }
  }, [activePlaylistId, tracks, playlistTracks, saveToRecent])


  // ─── Render Helpers ──────────────────────────────────────────────

  const renderContent = () => {
    if (activePlaylistId === "home") {
      return (
        <div className="space-y-16">
          {/* Vibe Selectors */}
          {!isSearching && (
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar pt-2">
              {SUGGESTED_SEARCHES.map(vibe => (
                <button
                  key={vibe}
                  onClick={() => handleSearch(vibe)}
                  className="px-6 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-aura-primary/20 hover:border-aura-primary/30 text-xs font-bold uppercase tracking-widest text-white transition-all whitespace-nowrap"
                >
                  {vibe}
                </button>
              ))}
            </div>
          )}

          {/* Featured Hero Section - Retro Style */}
          {!isSearching && searchQuery === "Top Hits" && (
            <div className="relative w-full rounded-3xl overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-aura-bg via-transparent to-transparent z-10" />
              <div className="relative min-h-[400px] h-auto w-full bg-gradient-to-br from-[#1e1b4b] to-[#4c1d95]">
                {/* Abstract Neon Grid/Sun Pattern */}
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#ef5b1e1a_1px,transparent_1px),linear-gradient(to_bottom,#ef5b1e1a_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-t from-aura-primary via-aura-secondary to-transparent opacity-40 blur-3xl animate-pulse" />
                
                {/* Hero Content */}
                <div className="relative z-20 h-full flex flex-col justify-between py-12 px-12 max-w-2xl">
                  {/* Top Badge - Fixed at top */}
                  <div className="mb-4 inline-block px-3 py-1 bg-aura-secondary/20 border border-aura-secondary/30 rounded text-[10px] font-black uppercase tracking-[0.2em] text-aura-secondary self-start">
                    Featured Music
                  </div>

                  {/* Middle Section - Centered content with line clamping */}
                  <div className="flex-1 flex flex-col justify-center min-h-0">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter text-white uppercase leading-[0.9] mb-4 max-w-xl line-clamp-3">
                      {featuredTrack ? (
                        <>
                          {featuredTrack.trackName.split(' ')[0]} <br /> 
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            {featuredTrack.trackName.split(' ').slice(1).join(' ') || "DRIFT"}
                          </span>
                        </>
                      ) : (
                        <>NEON <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">DRIFT</span></>
                      )}
                    </h1>
                    <p className="text-slate-300 text-sm font-medium mb-6 max-w-md leading-relaxed line-clamp-2">
                      {featuredTrack ? `${featuredTrack.artistName} — ${featuredTrack.collectionName}` : "The ultimate late-night driving soundtrack. Pure analog warmth for your digital soul."}
                    </p>
                  </div>

                  {/* Bottom Buttons - Anchored at bottom */}
                  <div className="flex items-center gap-4 mt-4">
                    <button 
                      onClick={() => featuredTrack && handlePlayFromCard(featuredTrack, "search")}
                      className="px-8 py-3 bg-aura-primary hover:bg-aura-accent text-white font-black uppercase tracking-widest text-xs rounded-lg transition-all shadow-lg shadow-aura-primary/30 active:scale-95 flex items-center gap-2"
                    >
                       <Play fill="currentColor" size={14} /> Listen Now
                    </button>
                    <button 
                      onClick={() => featuredTrack && handleToggleLike(featuredTrack)}
                      className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-lg transition-all active:scale-95"
                    >
                      {featuredTrack && likedSongIds.includes(featuredTrack.trackId) ? "Liked" : "Save to Library"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {recentlyPlayed.length > 0 && searchQuery === "Top Hits" && !isSearching && (
            <div className="animate-in fade-in duration-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <span className="w-8 h-1 bg-aura-primary rounded-full" />
                  Recently Played
                </h2>
                <button className="text-[10px] font-black uppercase tracking-widest text-aura-primary hover:text-white transition-colors">View All</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                {recentlyPlayed.map((track, i) => (
                  <TrackCard
                    key={`recent-${track.trackId}-${i}`}
                    track={track}
                    isCurrentTrack={currentTrack?.trackId === track.trackId}
                    isPlaying={currentTrack?.trackId === track.trackId && isPlaying}
                    onPlay={(t) => handlePlayFromCard(t, "recent")}
                    onPause={handlePause}
                    isLiked={likedSongIds.includes(track.trackId)}
                    onToggleLike={handleToggleLike}
                    onAddToPlaylist={handleAddToPlaylist}
                    playlists={playlists}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <span className="w-8 h-1 bg-aura-primary rounded-full shadow-[0_0_8px_#ef5b1e]" />
                {searchQuery === "Top Hits" ? "Trending Now" : `Results for "${searchQuery}"`}
              </h2>
              <button className="text-[10px] font-black uppercase tracking-widest text-aura-primary hover:text-white transition-colors">Explorer</button>
            </div>
            <TrackList
              tracks={tracks}
              currentTrackId={currentTrack?.trackId ?? null}
              isPlaying={isPlaying}
              onPlay={(t) => handlePlayFromCard(t, "search")}
              onPause={handlePause}
              isLoading={isLoading}
              likedSongIds={likedSongIds}
              onToggleLike={handleToggleLike}
              onAddToPlaylist={handleAddToPlaylist}
              playlists={playlists}
            />
          </div>
        </div>
      )
    }

    if (activePlaylistId === "library") {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-black mb-10 text-white tracking-tight">My Library</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
              onClick={() => handleSelectPlaylist("liked")}
              className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Heart className="h-16 w-16 text-white fill-current" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Liked Songs</h3>
              <p className="text-slate-400 text-sm">{likedSongIds.length} {likedSongIds.length === 1 ? "track" : "tracks"}</p>
            </div>

            {playlists.map((p) => (
              <div 
                key={p.id}
                onClick={() => handleSelectPlaylist(p.id)}
                className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-32 w-32 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Music className="h-16 w-16 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 truncate">{p.name}</h3>
                <p className="text-slate-400 text-sm">{(p.trackCount ?? 0)} {(p.trackCount === 1) ? "track" : "tracks"}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
          <div className={`h-48 w-48 rounded-2xl bg-gradient-to-br ${activePlaylistId === 'liked' ? 'from-indigo-600 to-purple-600' : 'from-slate-800 to-slate-900'} shadow-2xl flex items-center justify-center flex-shrink-0 relative group`}>
            {activePlaylistId === 'liked' ? <Heart className="h-24 w-24 text-white fill-current" /> : <Music className="h-24 w-24 text-slate-700" />}
            <button 
              onClick={handlePlayAll}
              className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-aura-primary text-white shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Play fill="currentColor" size={20} className="ml-1" />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-aura-primary mb-3">Playlist</p>
            <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter">{currentPlaylistName || "Your Playlist"}</h1>
            <div className="flex items-center gap-4 text-slate-400 font-medium whitespace-nowrap overflow-x-auto">
              <span className="flex items-center gap-1.5"><UserIcon size={14} className="text-aura-primary" /> {user?.email?.split('@')[0]}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>{playlistTracks.length} {playlistTracks.length === 1 ? "track" : "tracks"}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <button 
                onClick={() => setIsAddingSongs(!isAddingSongs)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all border border-white/5"
              >
                <Plus size={14} />
                {isAddingSongs ? "Cancel" : "Add Songs"}
              </button>
            </div>
          </div>
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={handlePlayAll}
              className="h-14 w-14 rounded-full bg-aura-primary text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              <Play fill="currentColor" size={24} className="ml-1" />
            </button>
            <button 
              onClick={() => setIsShuffle(!isShuffle)}
              className={`transition-colors ${isShuffle ? "text-aura-primary" : "text-slate-400 hover:text-white"}`}
            >
              <Shuffle size={24} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-white"}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-white"}`}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>

        {isAddingSongs ? (
          <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Let&apos;s find something for your playlist</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                <input 
                  autoFocus
                  placeholder="Search for songs or artists"
                  onChange={(e) => handlePlaylistSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-aura-primary transition-all"
                />
              </div>
            </div>
            {playlistSearchTracks.length > 0 && (
              <TrackList
                tracks={playlistSearchTracks}
                currentTrackId={currentTrack?.trackId ?? null}
                isPlaying={isPlaying}
                onPlay={(t) => handlePlayFromCard(t, "search")}
                onPause={handlePause}
                isLoading={isLoading}
                likedSongIds={likedSongIds}
                onToggleLike={handleToggleLike}
                onAddToPlaylist={handleAddToPlaylist}
                playlists={playlists}
                viewMode={viewMode}
              />
            )}
          </div>
        ) : (
          <TrackList
            tracks={playlistTracks}
            currentTrackId={currentTrack?.trackId ?? null}
            isPlaying={isPlaying}
            onPlay={(t) => handlePlayFromCard(t, "playlist")}
            onPause={handlePause}
            isLoading={isLoading}
            likedSongIds={likedSongIds}
            onToggleLike={handleToggleLike}
            onAddToPlaylist={handleAddToPlaylist}
            playlists={playlists}
            viewMode={viewMode}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex bg-black min-h-screen text-white">
      <div className="hidden lg:block h-screen sticky top-0 z-50">
        <Sidebar activeId={activePlaylistId} onSelectPlaylist={handleSelectPlaylist} />
      </div>

      <main className="flex-1 min-h-screen pb-40 overflow-x-hidden relative">
        <TopNav 
          onHome={handleClearSearch} 
          onSearch={handleSearch} 
          onClearSearch={handleClearSearch} 
          isSearchLoading={isLoading}
        />
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </main>

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

      <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
