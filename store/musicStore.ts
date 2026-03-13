"use client"

import { create } from "zustand"

import {
  fetchPopularContent as fetchPopularContentService,
  searchTracks,
  fetchSearchHistory as fetchSearchHistoryApi,
  saveRecentSong as saveRecentSongApi,
} from "@/lib/services/itunesService"
import { PLAY_STATE, type PlayState, type Song } from "@/types/music"

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

interface MusicStore {
  searchQuery: string
  featuredSongs: Song[]
  trendingSongs: Song[]
  currentlyPlaying: Song | null
  playState: PlayState
  currentTime: number
  duration: number

  searchResults: Song[]
  isSearching: boolean
  searchError: string | null

  volume: number
  isMuted: boolean
  isLoadingHome: boolean
  homeError: string | null
  isBuffering: boolean
  isShuffled: boolean
  isRepeating: boolean
  isExpanded: boolean
  queue: Song[]
  originalCollection: Song[]
  history: Song[]
  recentSongs: Song[]

  setVolume: (volume: number) => void
  toggleMute: () => void
  setBuffering: (isBuffering: boolean) => void
  setExpanded: (isExpanded: boolean) => void
  toggleExpanded: () => void
  setSearchQuery: (query: string) => void
  setPlayingTrack: (song: Song | null, collection?: Song[]) => void
  togglePlay: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  playNext: () => void
  playPrevious: () => void
  searchItunes: (query: string) => Promise<void>
  fetchPopularContent: () => Promise<void>
  fetchSearchHistory: (clerkId: string) => Promise<void>
  addRecentSong: (clerkId: string, song: Song) => Promise<void>
  removeRecentSong: (clerkId: string, songId: string) => Promise<void>
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  searchQuery: "",
  featuredSongs: [],
  trendingSongs: [],
  currentlyPlaying: null,
  playState: PLAY_STATE.IDLE,
  currentTime: 0,
  duration: 0,

  searchResults: [],
  isSearching: false,
  searchError: null,

  volume: 1,
  isMuted: false,
  isLoadingHome: false,
  homeError: null,
  isBuffering: false,
  isShuffled: false,
  isRepeating: false,
  isExpanded: false,
  queue: [],
  originalCollection: [],
  history: [],
  recentSongs: [],

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setBuffering: (isBuffering) => set({ isBuffering }),

  setSearchQuery: (query) => {
    set({ searchQuery: query })
    if (!query.trim()) {
      set({ searchResults: [], searchError: null })
    }
  },

  setPlayingTrack: (song, collection) => {
    if (!song) {
      set({ currentlyPlaying: null, playState: PLAY_STATE.IDLE, currentTime: 0, duration: 0 })
      return
    }
    const state = get()
    const pool = collection && collection.length > 0 
      ? collection 
      : (state.searchResults.length > 0 ? state.searchResults : [...state.featuredSongs, ...state.trendingSongs])

    let queue = pool.filter((s) => s.id !== song.id)
    if (state.isShuffled) {
      queue = [...queue]
      for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]]
      }
    }

    const history = state.currentlyPlaying ? [state.currentlyPlaying, ...state.history] : state.history
    
    set({
      currentlyPlaying: song,
      playState: PLAY_STATE.PLAYING,
      currentTime: 0,
      duration: 0,
      isBuffering: true,
      queue,
      originalCollection: pool,
      history,
    })
  },

  togglePlay: () =>
    set((state) => ({
      playState: state.playState === PLAY_STATE.PLAYING ? PLAY_STATE.PAUSED : PLAY_STATE.PLAYING,
    })),

  setExpanded: (isExpanded: boolean) => set({ isExpanded }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),

  toggleShuffle: () => set((state) => {
    const isShuffled = !state.isShuffled
    let newQueue = state.queue
    if (isShuffled) {
      newQueue = [...state.queue]
      for (let i = newQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]]
      }
    } else {
      if (state.currentlyPlaying) {
        const currentIndex = state.originalCollection.findIndex(s => s.id === state.currentlyPlaying?.id)
        if (currentIndex !== -1) {
          newQueue = state.originalCollection.slice(currentIndex + 1)
        } else {
          newQueue = state.originalCollection
        }
      } else {
        newQueue = state.originalCollection
      }
    }
    return { isShuffled, isRepeating: false, queue: newQueue }
  }),
  toggleRepeat: () => set((state) => ({ isRepeating: !state.isRepeating, isShuffled: false })),

  playNext: () => {
    const { queue, originalCollection, isShuffled, isRepeating, currentlyPlaying } = get()
    if (isRepeating && currentlyPlaying) {
      set({ currentTime: 0, playState: PLAY_STATE.PLAYING })
      return
    }
    const history = currentlyPlaying ? [currentlyPlaying, ...get().history] : get().history
    
    if (queue.length === 0) {
      if (isShuffled && originalCollection.length > 1) {
        const newPool = originalCollection.filter(s => s.id !== currentlyPlaying?.id)
        const newQueue = [...newPool]
        for (let i = newQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]]
        }
        if (newQueue.length > 0 && newQueue[0]) {
          const nextSong = newQueue[0]
          set({
            currentlyPlaying: nextSong,
            playState: PLAY_STATE.PLAYING,
            currentTime: 0,
            duration: 0,
            isBuffering: true,
            queue: newQueue.slice(1),
            history,
          })
          return
        }
      }
      set({ currentlyPlaying: null, playState: PLAY_STATE.IDLE, currentTime: 0, duration: 0, history })
      return
    }

    const nextSong = queue[0]
    if (!nextSong) return
    set({
      currentlyPlaying: nextSong,
      playState: PLAY_STATE.PLAYING,
      currentTime: 0,
      duration: 0,
      isBuffering: true,
      queue: queue.slice(1),
      history,
    })
  },

  playPrevious: () => {
    const { history, currentlyPlaying, queue } = get()
    if (history.length === 0) return
    const [prevSong, ...remainingHistory] = history
    const newQueue = currentlyPlaying ? [currentlyPlaying, ...queue] : queue
    set({
      currentlyPlaying: prevSong!,
      playState: PLAY_STATE.PLAYING,
      currentTime: 0,
      duration: 0,
      isBuffering: true,
      history: remainingHistory,
      queue: newQueue,
    })
  },

  searchItunes: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false, searchError: null })
      return
    }

    set({ isSearching: true, searchError: null })

    try {
      const songs = await searchTracks(query)

      // Only update if query hasn't changed while we were fetching
      if (get().searchQuery === query) {
        set({ searchResults: songs, isSearching: false })
      }
    } catch (error) {
      set({
        searchError: error instanceof Error ? error.message : "Search failed",
        isSearching: false,
      })
    }
  },

  fetchPopularContent: async () => {
    if (get().isLoadingHome) return
    set({ isLoadingHome: true, homeError: null })

    try {
      const { featured, trending } = await fetchPopularContentService()

      set({
        featuredSongs: featured,
        trendingSongs: trending,
        isLoadingHome: false,
      })
    } catch (error) {
      set({
        homeError: error instanceof Error ? error.message : "Failed to load content",
        isLoadingHome: false,
      })
    }
  },

  fetchSearchHistory: async (clerkId: string) => {
    try {
      const songs = await fetchSearchHistoryApi(clerkId)
      set({ recentSongs: songs })
    } catch {
      // Best-effort
    }
  },

  addRecentSong: async (clerkId: string, song: Song) => {
    if (!song || !song.id) return
    // Optimistically update local state FIRST (instant UI feedback)
    set((state) => {
      const filtered = state.recentSongs.filter((s) => s.id !== song.id)
      return { recentSongs: [song, ...filtered].slice(0, 5) }
    })
    // Fire-and-forget API call to persist to Redis (don't block UI)
    saveRecentSongApi(clerkId, song).catch(() => {})
  },

  removeRecentSong: async (clerkId: string, songId: string) => {
    // Optimistically update local state FIRST (instant UI feedback)
    set((state) => ({
      recentSongs: state.recentSongs.filter((s) => s.id !== songId)
    }))
    // Fire-and-forget API call to persist to Redis (don't block UI)
    import("@/lib/services/itunesService").then(({ removeRecentSong }) => {
      removeRecentSong(clerkId, songId).catch(() => {})
    })
  },
}))
