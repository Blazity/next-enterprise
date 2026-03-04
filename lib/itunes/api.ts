// iTunes API helpers — calls local proxy routes to avoid CORS
// wednesday-dev: verb-first names, explicit return types, UPPER_SNAKE_CASE constants

import type { RssEntry, RssFeed } from "lib/itunes/rssTypes"
import type { ItunesAlbum, ItunesArtist, ItunesSearchResponse, ItunesTrack } from "lib/itunes/types"

const SEARCH_LIMIT_TRACKS = "12"
const SEARCH_LIMIT_ALBUMS = "12"
const POPULAR_ARTIST_NAMES = ["Taylor Swift", "Drake", "The Weeknd", "Beyonce", "Adele", "Ed Sheeran"]

// ─── Internal helpers ────────────────────────────────────────────────────────

async function fetchSearch<T>(entity: string, term: string, limit: string): Promise<T[]> {
  const params = new URLSearchParams({ term, entity, limit })
  const response = await fetch(`/api/itunes/search?${params.toString()}`)
  if (!response.ok) return []
  const data = (await response.json()) as ItunesSearchResponse<T>
  return data.results
}

function getLargestRssArtwork(images: RssEntry["im:image"]): string {
  return images.at(-1)?.label ?? images[0]?.label ?? ""
}

function parseRssEntryToAlbum(entry: RssEntry): ItunesAlbum {
  return {
    wrapperType: "collection",
    collectionType: "Album",
    collectionId: parseInt(entry.id.attributes["im:id"]),
    collectionName: entry["im:name"].label,
    artistName: entry["im:artist"].label,
    artworkUrl100: getLargestRssArtwork(entry["im:image"]),
    releaseDate: entry["im:releaseDate"]?.label ?? new Date().toISOString(),
    primaryGenreName: entry.category?.attributes.term ?? "Music",
    artistId: 0,
    trackCount: 0,
  }
}

// ─── Search API ──────────────────────────────────────────────────────────────

export async function searchSongs(term: string): Promise<ItunesTrack[]> {
  return fetchSearch<ItunesTrack>("musicTrack", term, SEARCH_LIMIT_TRACKS)
}

export async function searchAlbums(term: string): Promise<ItunesAlbum[]> {
  return fetchSearch<ItunesAlbum>("album", term, SEARCH_LIMIT_ALBUMS)
}

export async function searchArtists(term: string): Promise<ItunesArtist[]> {
  return fetchSearch<ItunesArtist>("musicArtist", term, "6")
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
        artistId: track.collectionId,
        artistName: track.artistName,
        primaryGenreName: track.primaryGenreName,
        artworkUrl: track.artworkUrl100.replace("100x100", "440x440"),
      }
      return [artist]
    })
}
