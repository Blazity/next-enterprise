import { mapITunesTrackToSong } from "@/lib/itunes"
import type { ITunesSearchResponse, Song } from "@/types/music"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

// --- Search History (Redis-backed via backend) ---

export async function fetchSearchHistory(clerkId: string): Promise<Song[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/search-history/${encodeURIComponent(clerkId)}`)
    if (!res.ok) return []
    const data = (await res.json()) as { searches: Song[] }
    return data.searches
  } catch {
    return []
  }
}

export async function saveRecentSong(clerkId: string, song: Song): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/search-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerk_id: clerkId, song }),
    })
  } catch {
    // Best-effort — don't block the UI
  }
}

export async function removeRecentSong(clerkId: string, songId: string): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/search-history?clerk_id=${encodeURIComponent(clerkId)}&song_id=${encodeURIComponent(songId)}`, {
      method: "DELETE",
    })
  } catch {
    // Best-effort — don't block the UI
  }
}

// --- Most Searched (DB-backed, frequency-based) ---

export async function incrementSearchCount(clerkId: string, song: Song): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/most-searched`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerk_id: clerkId, song }),
    })
  } catch {
    // Best-effort
  }
}

export async function fetchMostSearched(clerkId: string): Promise<{ song: Song; count: number }[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/most-searched/${encodeURIComponent(clerkId)}`)
    if (!res.ok) return []
    const data = (await res.json()) as { songs: { song: Song; count: number }[] }
    return data.songs
  } catch {
    return []
  }
}

// --- Most Listened (DB-backed, frequency-based) ---

export async function recordListen(clerkId: string, song: Song): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/most-listened`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerk_id: clerkId, song }),
    })
  } catch {
    // Best-effort
  }
}

export async function fetchMostListened(clerkId: string): Promise<{ song: Song; count: number }[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/most-listened/${encodeURIComponent(clerkId)}`)
    if (!res.ok) return []
    const data = (await res.json()) as { songs: { song: Song; count: number }[] }
    return data.songs
  } catch {
    return []
  }
}

// --- iTunes API ---

export async function searchTracks(query: string, limit = 25): Promise<Song[]> {
  const res = await fetch(`/api/itunes/search?term=${encodeURIComponent(query)}&limit=${limit}`)
  if (!res.ok) throw new Error("Search failed")

  const data = (await res.json()) as ITunesSearchResponse
  return data.results.filter((track) => track.previewUrl).map(mapITunesTrackToSong)
}

export async function fetchPopularContent(): Promise<{ featured: Song[]; trending: Song[] }> {
  const [featuredRes, trendingRes] = await Promise.all([
    fetch("/api/itunes/search?term=top+songs+2025&limit=5"),
    fetch("/api/itunes/search?term=popular+music+2025&limit=12"),
  ])

  if (!featuredRes.ok || !trendingRes.ok) throw new Error("Failed to load content")

  const [featuredData, trendingData] = (await Promise.all([featuredRes.json(), trendingRes.json()])) as [
    ITunesSearchResponse,
    ITunesSearchResponse,
  ]

  return {
    featured: featuredData.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong),
    trending: trendingData.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong),
  }
}

export async function fetchRecentlyAdded(): Promise<Song[]> {
  const res = await fetch("/api/itunes/search?term=new+music+2026&limit=20")
  if (!res.ok) throw new Error("Failed to load recently added")
  const data = (await res.json()) as ITunesSearchResponse
  return data.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong)
}

export async function fetchSongsBrowse(): Promise<Song[]> {
  const res = await fetch("/api/itunes/search?term=top+hits+2026&limit=25")
  if (!res.ok) throw new Error("Failed to load songs")
  const data = (await res.json()) as ITunesSearchResponse
  return data.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong)
}

export interface ArtistWithSongs {
  id: string
  name: string
  image: string
  songs: Song[]
}

export async function fetchArtistsBrowse(): Promise<ArtistWithSongs[]> {
  const res = await fetch("/api/itunes/search?term=best+artists+2026&limit=25")
  if (!res.ok) throw new Error("Failed to load artists")
  const data = (await res.json()) as ITunesSearchResponse
  const songs = data.results.filter((t) => t.previewUrl).map(mapITunesTrackToSong)

  const artistMap = new Map<string, ArtistWithSongs>()
  for (const song of songs) {
    const existing = artistMap.get(song.artist.id)
    if (existing) {
      existing.songs.push(song)
    } else {
      artistMap.set(song.artist.id, {
        id: song.artist.id,
        name: song.artist.name,
        image: song.albumArt,
        songs: [song],
      })
    }
  }
  return Array.from(artistMap.values())
}
