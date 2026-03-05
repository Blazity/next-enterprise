import { mapITunesTrackToSong } from "@/lib/itunes"
import type { ITunesSearchResponse, Song } from "@/types/music"

export async function searchTracks(query: string, limit = 25): Promise<Song[]> {
  const res = await fetch(`/api/itunes/search?term=${encodeURIComponent(query)}&limit=${limit}`)
  if (!res.ok) throw new Error("Search failed")

  const data = (await res.json()) as ITunesSearchResponse
  return data.results.filter((track) => track.previewUrl).map(mapITunesTrackToSong)
}

export async function fetchPopularContent(): Promise<{ featured: Song[]; trending: Song[] }> {
  const [featuredRes, trendingRes] = await Promise.all([
    fetch("/api/itunes/search?term=top+hits+2026&limit=5"),
    fetch("/api/itunes/search?term=trending+music+2026&limit=12"),
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
