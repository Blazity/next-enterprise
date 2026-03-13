"use client"

import { createClient } from "lib/supabase/client"
import { iTunesTrack } from "lib/itunes"

export async function getPlaylists() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("playlists")
    .select(`
      *,
      playlist_songs (
        count
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching playlists:", error)
    return []
  }

  return data.map(p => ({
    ...p,
    song_count: (p.playlist_songs as any)?.[0]?.count ?? 0
  }))
}

export async function createPlaylist(name: string, description?: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("playlists")
    .insert({
      user_id: user.id,
      name,
      description,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePlaylist(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", id)

  if (error) throw error
}

export async function addSongToPlaylist(playlistId: string, track: iTunesTrack) {
  const supabase = createClient()
  
  // Check if song already exists in this playlist
  const { data: existing } = await supabase
    .from("playlist_songs")
    .select("id")
    .eq("playlist_id", playlistId)
    .eq("track_id", track.trackId)
    .maybeSingle()

  if (existing) return // Already in playlist

  // Get current max position
  const { data: currentSongs } = await supabase
    .from("playlist_songs")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)

  const nextPosition = (currentSongs?.[0]?.position ?? -1) + 1

  const { error } = await supabase
    .from("playlist_songs")
    .insert({
      playlist_id: playlistId,
      track_id: track.trackId,
      track_data: track,
      position: nextPosition,
    })

  if (error) throw error
}

export async function getPlaylistSongs(playlistId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("playlist_songs")
    .select("*")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true })

  if (error) {
    console.error("Error fetching playlist songs:", error)
    return []
  }

  return data.map(item => ({
    ...(item.track_data as iTunesTrack),
    addedAt: item.created_at
  }))
}
