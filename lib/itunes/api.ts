// iTunes API helpers — calls local proxy routes to avoid CORS
// wednesday-dev: verb-first names, explicit return types, UPPER_SNAKE_CASE constants

import { POPULAR_ARTIST_NAMES, SEARCH_LIMIT_ALBUMS, SEARCH_LIMIT_TRACKS } from "lib/itunes/constants"
import type { RssFeed } from "lib/itunes/rssTypes"
import type { ItunesAlbum, ItunesArtist, ItunesSearchResponse, ItunesTrack } from "lib/itunes/types"
import { parseRssEntryToAlbum } from "lib/itunes/utils"

// ─── Internal helpers ────────────────────────────────────────────────────────

async function fetchSearch<T>(entity: string, term: string, limit: string): Promise<T[]> {
  const params = new URLSearchParams({ term, entity, limit })
  const response = await fetch(`/api/itunes/search?${params.toString()}`)
  if (!response.ok) return []
  const data = (await response.json()) as ItunesSearchResponse<T>
  return data.results
}

// ─── Search API ──────────────────────────────────────────────────────────────

export async function searchSongs(term: string): Promise<ItunesTrack[]> {
  return fetchSearch<ItunesTrack>("musicTrack", term, SEARCH_LIMIT_TRACKS)
}

export async function searchAlbums(term: string): Promise<ItunesAlbum[]> {
  return fetchSearch<ItunesAlbum>("album", term, SEARCH_LIMIT_ALBUMS)
}

export async function searchArtists(term: string): Promise<ItunesArtist[]> {
  const artists = await fetchSearch<ItunesArtist>("musicArtist", term, "6")

  // iTunes artist search has no artwork — enrich from a track per artist
  const enriched = await Promise.all(
    artists.map(async (artist) => {
      const tracks = await fetchSearch<ItunesTrack>("musicTrack", artist.artistName, "1")
      const artworkUrl = tracks[0]?.artworkUrl100?.replace("100x100", "440x440")
      return { ...artist, artworkUrl }
    })
  )

  return enriched
}

// ─── Home page data (RSS + lookup) ───────────────────────────────────────────

export async function fetchTrendingSongs(): Promise<ItunesTrack[]> {
  // 1. RSS chart → extract track IDs (preserves chart rank order)
  const rssResponse = await fetch("/api/itunes/rss?feed=topsongs&limit=20")
  if (!rssResponse.ok) return []

  const rssData = (await rssResponse.json()) as RssFeed
  const entries = rssData.feed?.entry ?? []
  const trackIds = entries.map((e) => e.id.attributes["im:id"]).filter(Boolean)
  if (!trackIds.length) return []

  // 2. Batch lookup → get full track objects with previewUrl
  const lookupResponse = await fetch(`/api/itunes/lookup?ids=${trackIds.join(",")}`)
  if (!lookupResponse.ok) return []

  const lookupData = (await lookupResponse.json()) as ItunesSearchResponse<ItunesTrack>
  const tracks = lookupData.results.filter(
    (r) => (r as { wrapperType: string }).wrapperType === "track"
  )

  // 3. Re-sort to RSS chart order
  const trackMap = new Map(tracks.map((t) => [String(t.trackId), t]))
  return trackIds.map((id) => trackMap.get(id)).filter((t): t is ItunesTrack => t !== undefined)
}

export async function fetchTracksByIds(ids: number[]): Promise<ItunesTrack[]> {
  if (!ids.length) return []
  const lookupResponse = await fetch(`/api/itunes/lookup?ids=${ids.join(",")}`)
  if (!lookupResponse.ok) return []

  const lookupData = (await lookupResponse.json()) as ItunesSearchResponse<ItunesTrack>
  return lookupData.results.filter(
    (r) => (r as { wrapperType: string }).wrapperType === "track"
  )
}

export async function fetchTopAlbums(): Promise<ItunesAlbum[]> {
  const response = await fetch("/api/itunes/rss?feed=topalbums&limit=20")
  if (!response.ok) return []

  const data = (await response.json()) as RssFeed
  const entries = data.feed?.entry ?? []
  return entries.map(parseRssEntryToAlbum)
}

export async function fetchPopularArtists(): Promise<ItunesArtist[]> {
  // Search for a track per artist — iTunes artist entity has no artwork,
  // so we use the track's artworkUrl100 as the artist portrait
  const results = await Promise.all(
    POPULAR_ARTIST_NAMES.map((name) => fetchSearch<ItunesTrack>("musicTrack", name, "1"))
  )
  return results
    .flatMap((tracks) => {
      const track = tracks[0]
      if (!track) return []
      const artist: ItunesArtist = {
        wrapperType: "artist",
        artistType: "Artist",
        artistId: track.artistId,
        artistName: track.artistName,
        primaryGenreName: track.primaryGenreName,
        artworkUrl: track.artworkUrl100.replace("100x100", "440x440"),
      }
      return [artist]
    })
}
