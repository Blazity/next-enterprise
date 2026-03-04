"use client"

import { create } from "zustand"

import { featuredSongs as staticFeatured, trendingSongs as staticTrending } from "@/data/songs"
import { mapITunesTrackToSong } from "@/lib/itunes"
import type { ITunesSearchResponse, PlayState, Song } from "@/types/music"

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
  playState: "idle",
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
      playState: song ? "playing" : "idle",
      currentTime: 0,
      duration: 0,
    }),

  togglePlay: () =>
    set((state) => ({
      playState: state.playState === "playing" ? "paused" : "playing",
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
      const res = await fetch(`/api/itunes/search?term=${encodeURIComponent(query)}&limit=25`)
      if (!res.ok) throw new Error("Search failed")

      const data = (await res.json()) as ITunesSearchResponse
      const songs = data.results.filter((track) => track.previewUrl).map(mapITunesTrackToSong)

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
      const [featuredRes, trendingRes] = await Promise.all([
        fetch("/api/itunes/search?term=top+hits+2026&limit=5"),
        fetch("/api/itunes/search?term=trending+music+2026&limit=12"),
      ])

      if (!featuredRes.ok || !trendingRes.ok) throw new Error("Failed to load content")

      const [featuredData, trendingData] = (await Promise.all([
        featuredRes.json(),
        trendingRes.json(),
      ])) as [ITunesSearchResponse, ITunesSearchResponse]

      const featured = featuredData.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong)
      const trending = trendingData.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong)

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
