"use client"

import { create } from "zustand"

import {
  createPlaylist as createPlaylistApi,
  deletePlaylist as deletePlaylistApi,
  getUserPlaylists,
  getPlaylist as getPlaylistApi,
  updatePlaylist as updatePlaylistApi,
  addSongToPlaylist as addSongApi,
  removeSongFromPlaylist as removeSongApi,
  getSharedPlaylists as getSharedPlaylistsApi,
  sharePlaylist as sharePlaylistApi,
  unsharePlaylist as unsharePlaylistApi,
  createShareLink as createShareLinkApi,
  type Playlist,
} from "@/lib/services/playlistService"
import type { Song } from "@/types/music"

interface PlaylistStore {
  playlists: Playlist[]
  sharedPlaylists: Playlist[]
  currentPlaylist: Playlist | null
  isLoading: boolean
  error: string | null

  fetchPlaylists: (clerkId: string) => Promise<void>
  fetchSharedPlaylists: (clerkId: string) => Promise<void>
  fetchPlaylist: (id: number, clerkId?: string) => Promise<void>
  createPlaylist: (clerkId: string, name: string, description?: string) => Promise<Playlist>
  updatePlaylist: (id: number, data: { name?: string; description?: string }) => Promise<void>
  deletePlaylist: (id: number) => Promise<void>
  addSong: (playlistId: number, song: Song) => Promise<void>
  removeSong: (playlistId: number, trackId: string) => Promise<void>
  sharePlaylist: (playlistId: number, email: string, sharedByClerkId: string) => Promise<void>
  unsharePlaylist: (playlistId: number, sharedWithClerkId: string) => Promise<void>
  createShareLink: (playlistId: number, clerkId: string) => Promise<{ token: string; url: string }>
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  sharedPlaylists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  fetchPlaylists: async (clerkId) => {
    set({ isLoading: true, error: null })
    try {
      const playlists = await getUserPlaylists(clerkId)
      set({ playlists, isLoading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load playlists", isLoading: false })
    }
  },

  fetchSharedPlaylists: async (clerkId) => {
    try {
      const sharedPlaylists = await getSharedPlaylistsApi(clerkId)
      set({ sharedPlaylists })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load shared playlists" })
    }
  },

  fetchPlaylist: async (id, clerkId) => {
    set({ isLoading: true, error: null })
    try {
      const playlist = await getPlaylistApi(id, clerkId)
      set({ currentPlaylist: playlist, isLoading: false })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load playlist", isLoading: false })
    }
  },

  createPlaylist: async (clerkId, name, description) => {
    try {
      const playlist = await createPlaylistApi(clerkId, name, description)
      set((state) => ({ playlists: [{ ...playlist, song_count: 0 }, ...state.playlists], error: null }))
      return playlist
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create playlist"
      set({ error: msg })
      throw err
    }
  },

  updatePlaylist: async (id, data) => {
    const updated = await updatePlaylistApi(id, data)
    set((state) => ({
      playlists: state.playlists.map((p) => (p.id === id ? { ...p, ...updated } : p)),
      currentPlaylist: state.currentPlaylist?.id === id ? { ...state.currentPlaylist, ...updated } : state.currentPlaylist,
    }))
  },

  deletePlaylist: async (id) => {
    await deletePlaylistApi(id)
    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== id),
      currentPlaylist: state.currentPlaylist?.id === id ? null : state.currentPlaylist,
    }))
  },

  addSong: async (playlistId, song) => {
    await addSongApi(playlistId, song)
    // Update song count in playlists list
    set((state) => ({
      playlists: state.playlists.map((p) =>
        p.id === playlistId ? { ...p, song_count: (p.song_count || 0) + 1 } : p
      ),
    }))
    // Re-fetch detail if viewing this playlist
    const { currentPlaylist } = get()
    if (currentPlaylist?.id === playlistId) {
      get().fetchPlaylist(playlistId)
    }
  },

  removeSong: async (playlistId, trackId) => {
    // Optimistically update UI
    const { currentPlaylist } = get()
    if (currentPlaylist?.id === playlistId && currentPlaylist.songs) {
      set({
        currentPlaylist: {
          ...currentPlaylist,
          songs: currentPlaylist.songs.filter((s: any) => s.track_id !== trackId),
        },
      })
    }
    set((state) => ({
      playlists: state.playlists.map((p) =>
        p.id === playlistId ? { ...p, song_count: Math.max((p.song_count || 1) - 1, 0) } : p
      ),
    }))
    try {
      await removeSongApi(playlistId, trackId)
    } catch {
      // Revert on failure — re-fetch
      if (currentPlaylist?.id === playlistId) {
        get().fetchPlaylist(playlistId)
      }
    }
  },

  sharePlaylist: async (playlistId, email, sharedByClerkId) => {
    try {
      await sharePlaylistApi(playlistId, email, sharedByClerkId)
      set({ error: null })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to share playlist"
      set({ error: msg })
      throw err
    }
  },

  unsharePlaylist: async (playlistId, sharedWithClerkId) => {
    try {
      await unsharePlaylistApi(playlistId, sharedWithClerkId)
      set({ error: null })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to revoke share"
      set({ error: msg })
      throw err
    }
  },

  createShareLink: async (playlistId, clerkId) => {
    try {
      const result = await createShareLinkApi(playlistId, clerkId)
      set({ error: null })
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create share link"
      set({ error: msg })
      throw err
    }
  },
}))
