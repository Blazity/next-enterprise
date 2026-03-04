"use client"

import { create } from "zustand"

import { featuredSongs as staticFeatured, trendingSongs as staticTrending } from "@/data/songs"
import { fetchPopularContent as fetchPopularContentService, searchTracks } from "@/lib/services/itunesService"
import { PLAY_STATE, type PlayState, type Song } from "@/types/music"

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

  isLoadingHome: boolean

  setSearchQuery: (query: string) => void
  setPlayingTrack: (song: Song | null) => void
  togglePlay: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  searchItunes: (query: string) => Promise<void>
  fetchPopularContent: () => Promise<void>
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  searchQuery: "",
  featuredSongs: staticFeatured,
  trendingSongs: staticTrending,
  currentlyPlaying: null,
  playState: PLAY_STATE.IDLE,
  currentTime: 0,
  duration: 0,

  searchResults: [],
  isSearching: false,
  searchError: null,

  isLoadingHome: false,

  setSearchQuery: (query) => {
    set({ searchQuery: query })
    if (!query.trim()) {
      set({ searchResults: [], searchError: null })
    }
  },

  setPlayingTrack: (song) =>
    set({
      currentlyPlaying: song,
      playState: song ? PLAY_STATE.PLAYING : PLAY_STATE.IDLE,
      currentTime: 0,
      duration: 0,
    }),

  togglePlay: () =>
    set((state) => ({
      playState: state.playState === PLAY_STATE.PLAYING ? PLAY_STATE.PAUSED : PLAY_STATE.PLAYING,
    })),

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),

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
    set({ isLoadingHome: true })

    try {
      const { featured, trending } = await fetchPopularContentService()

      set({
        featuredSongs: featured.length > 0 ? featured : staticFeatured,
        trendingSongs: trending.length > 0 ? trending : staticTrending,
        isLoadingHome: false,
      })
    } catch {
      set({ isLoadingHome: false })
    }
  },
}))
