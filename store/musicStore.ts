"use client"

import { create } from "zustand"

import type { PlayState, Song } from "@/types/music"
import { featuredSongs, trendingSongs } from "@/data/songs"

interface MusicStore {
  searchQuery: string
  featuredSongs: Song[]
  trendingSongs: Song[]
  currentlyPlaying: Song | null
  playState: PlayState
  setSearchQuery: (query: string) => void
  setPlayingTrack: (song: Song | null) => void
  togglePlay: () => void
}

export const useMusicStore = create<MusicStore>((set) => ({
  searchQuery: "",
  featuredSongs,
  trendingSongs,
  currentlyPlaying: null,
  playState: "idle",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPlayingTrack: (song) =>
    set({
      currentlyPlaying: song,
      playState: song ? "playing" : "idle",
    }),
  togglePlay: () =>
    set((state) => ({
      playState: state.playState === "playing" ? "paused" : "playing",
    })),
}))
