"use client"

import { apiFetch } from "lib/api-client"
import { iTunesTrack } from "lib/itunes"
import { Playlist } from "lib/types"

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const data = await apiFetch("/playlists")
    return data as Playlist[]
  } catch (err) {
    console.error("Error fetching playlists:", err)
    return []
  }
}

export async function createPlaylist(name: string, description?: string): Promise<Playlist> {
  return apiFetch("/playlists", {
    method: "POST",
    body: JSON.stringify({ name, description })
  }) as Promise<Playlist>
}

export async function deletePlaylist(id: string): Promise<void> {
  return apiFetch(`/playlists/${id}`, {
    method: "DELETE"
  }) as Promise<void>
}

export async function addSongToPlaylist(playlistId: string, track: iTunesTrack): Promise<{ success: boolean }> {
  return apiFetch("/playlists/add-song", {
    method: "POST",
    body: JSON.stringify({ playlistId, track })
  }) as Promise<{ success: boolean }>
}

export async function getPlaylistSongs(playlistId: string): Promise<iTunesTrack[]> {
  try {
    return apiFetch(`/playlists/${playlistId}/songs`) as Promise<iTunesTrack[]>
  } catch (err) {
    console.error("Error fetching playlist songs:", err)
    return []
  }
}
