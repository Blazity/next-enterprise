import type { Song } from "@/types/music"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export interface Playlist {
  id: number
  clerk_id: string
  name: string
  description: string | null
  song_count?: number
  created_at: string
  songs?: PlaylistSong[]
  is_owner?: boolean
  is_shared?: boolean
  shared_by?: string
  shared_by_email?: string
  shared_by_name?: string
  owner_name?: string
}

export interface PlaylistSong {
  id: number
  playlist_id: number
  track_id: string
  title: string
  artist_name: string
  album_art: string | null
  preview_url: string | null
  collection_name: string | null
  duration: number | null
  position: number
  added_at: string
}

export async function syncUser(user: {
  id: string
  username?: string | null
  emailAddresses?: { emailAddress: string }[]
  firstName?: string | null
  lastName?: string | null
  imageUrl?: string
}) {
  const res = await fetch(`${API_URL}/api/users/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerk_id: user.id,
      username: user.username,
      email: user.emailAddresses?.[0]?.emailAddress,
      first_name: user.firstName,
      last_name: user.lastName,
      profile_image: user.imageUrl,
    }),
  })
  if (!res.ok) throw new Error("Failed to sync user")
  return res.json() as Promise<Record<string, unknown>>
}

export async function getUserPlaylists(clerkId: string): Promise<Playlist[]> {
  const res = await fetch(`${API_URL}/api/playlists/user/${encodeURIComponent(clerkId)}`)
  if (!res.ok) throw new Error("Failed to fetch playlists")
  return res.json() as Promise<Playlist[]>
}

export async function getPlaylist(id: number, clerkId?: string): Promise<Playlist> {
  const params = clerkId ? `?clerk_id=${encodeURIComponent(clerkId)}` : ""
  const res = await fetch(`${API_URL}/api/playlists/${id}${params}`)
  if (!res.ok) throw new Error("Failed to fetch playlist")
  return res.json() as Promise<Playlist>
}

export async function createPlaylist(clerkId: string, name: string, description?: string): Promise<Playlist> {
  const res = await fetch(`${API_URL}/api/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clerk_id: clerkId, name, description }),
  })
  if (!res.ok) throw new Error("Failed to create playlist")
  return res.json() as Promise<Playlist>
}

export async function updatePlaylist(id: number, data: { name?: string; description?: string }): Promise<Playlist> {
  const res = await fetch(`${API_URL}/api/playlists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update playlist")
  return res.json() as Promise<Playlist>
}

export async function deletePlaylist(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/playlists/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete playlist")
}

export async function addSongToPlaylist(playlistId: number, song: Song): Promise<PlaylistSong> {
  const res = await fetch(`${API_URL}/api/playlists/${playlistId}/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      track_id: song.id,
      title: song.title,
      artist_name: song.artist.name,
      album_art: song.albumArt,
      preview_url: song.previewUrl,
      collection_name: song.collectionName,
      duration: song.duration,
    }),
  })
  if (!res.ok) {
    const err = (await res.json()) as { error?: string }
    throw new Error(err.error || "Failed to add song")
  }
  return res.json() as Promise<PlaylistSong>
}

export async function removeSongFromPlaylist(playlistId: number, trackId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/playlists/${playlistId}/songs/${trackId}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to remove song")
}

export async function sharePlaylist(playlistId: number, email: string, sharedByClerkId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/playlists/${playlistId}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, shared_by_clerk_id: sharedByClerkId }),
  })
  if (!res.ok) {
    const err = (await res.json()) as { error?: string }
    throw new Error(err.error || "Failed to share playlist")
  }
}

export async function unsharePlaylist(playlistId: number, sharedWithClerkId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/playlists/${playlistId}/share/${encodeURIComponent(sharedWithClerkId)}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to revoke share")
}

export async function getSharedPlaylists(clerkId: string): Promise<Playlist[]> {
  const res = await fetch(`${API_URL}/api/playlists/shared/${encodeURIComponent(clerkId)}`)
  if (!res.ok) throw new Error("Failed to fetch shared playlists")
  return res.json() as Promise<Playlist[]>
}

export async function createShareLink(
  playlistId: number,
  clerkId: string
): Promise<{ token: string; url: string }> {
  const res = await fetch(`${API_URL}/api/playlists/${playlistId}/share-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clerk_id: clerkId }),
  })
  if (!res.ok) {
    const err = (await res.json()) as { error?: string }
    throw new Error(err.error || "Failed to create share link")
  }
  return res.json() as Promise<{ token: string; url: string }>
}

export async function getPlaylistByToken(token: string): Promise<Playlist> {
  const res = await fetch(`${API_URL}/api/playlists/shared-by-token/${encodeURIComponent(token)}`)
  if (!res.ok) throw new Error("Invalid or expired share link")
  return res.json() as Promise<Playlist>
}

export async function claimPlaylistByToken(
  token: string,
  clerkId: string
): Promise<{ playlist_id: number }> {
  const res = await fetch(`${API_URL}/api/playlists/claim-by-token/${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clerk_id: clerkId }),
  })
  if (!res.ok) {
    const err = (await res.json()) as { error?: string }
    throw new Error(err.error || "Failed to claim playlist")
  }
  return res.json() as Promise<{ playlist_id: number }>
}
