"use client"

import { createClient } from "lib/supabase/client"
import { iTunesTrack } from "lib/itunes"

export async function getLikedSongs() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("liked_songs")
    .select("track_id, created_at, track_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching liked songs:", error)
    return []
  }

  return data.map((item) => ({
    trackId: item.track_id,
    createdAt: item.created_at,
    trackData: item.track_data as iTunesTrack
  }))
}

export async function toggleLikeSong(track: iTunesTrack, isCurrentlyLiked: boolean) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to like songs")
  }

  if (isCurrentlyLiked) {
    const { error } = await supabase
      .from("liked_songs")
      .delete()
      .eq("user_id", user.id)
      .eq("track_id", track.trackId)

    if (error) throw error
    return false
  } else {
    // Check if it already exists to be safe
    const { data: existing } = await supabase
      .from("liked_songs")
      .select("id")
      .eq("user_id", user.id)
      .eq("track_id", track.trackId)
      .maybeSingle()

    if (existing) return true

    const { error } = await supabase
      .from("liked_songs")
      .insert({
        user_id: user.id,
        track_id: track.trackId,
        track_data: track,
      })

    if (error) throw error
    return true
  }
}
