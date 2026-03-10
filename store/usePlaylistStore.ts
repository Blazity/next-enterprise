"use client"

// Playlist store — manages the aggregated list of user playlists
// wednesday-dev: PascalCase types, camelCase actions, boolean vars prefixed is/has

import { create } from "zustand"

import type { Playlist } from "lib/api/playlists"

type PlaylistState = {
  playlists: Playlist[]
  sharedPlaylists: (Playlist & { sharedBy: string; shareId: string })[]
  isLoading: boolean
  selectedPlaylistId: string | null
}

type PlaylistActions = {
  setPlaylists: (playlists: Playlist[]) => void
  setSharedPlaylists: (playlists: (Playlist & { sharedBy: string; shareId: string })[]) => void
  addPlaylist: (playlist: Playlist) => void
  removePlaylist: (id: string) => void
  updatePlaylist: (id: string, data: Partial<Playlist>) => void
  setIsLoading: (isLoading: boolean) => void
  setSelectedPlaylistId: (id: string | null) => void
}

type PlaylistStore = PlaylistState & PlaylistActions

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  sharedPlaylists: [],
  isLoading: false,
  selectedPlaylistId: null,

  setPlaylists: (playlists) => set({ playlists }),
  setSharedPlaylists: (sharedPlaylists) => set({ sharedPlaylists }),

  addPlaylist: (playlist) =>
    set((state) => ({ playlists: [...state.playlists, playlist] })),

  removePlaylist: (id) =>
    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== id),
    })),

  updatePlaylist: (id, data) =>
    set((state) => ({
      playlists: state.playlists.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    })),

  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedPlaylistId: (id) => set({ selectedPlaylistId: id }),
}))
