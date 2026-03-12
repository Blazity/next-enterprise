"use client"

// Player store — cross-tree state shared between SongCard (page) and MiniPlayer (layout)
// wednesday-dev: PascalCase types, camelCase actions, boolean vars prefixed is/has

import { create } from "zustand"

import type { ItunesTrack } from "lib/itunes/types"

type PlayerState = {
  currentTrack: ItunesTrack | null
  isPlaying: boolean
  volume: number
}

type PlayerActions = {
  playTrack: (track: ItunesTrack) => void
  togglePlay: () => void
  stop: () => void
  setVolume: (volume: number) => void
}

type PlayerStore = PlayerState & PlayerActions

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1,

  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  stop: () => set({ currentTrack: null, isPlaying: false }),

  setVolume: (volume) => set({ volume }),
}))
