// ─── Types ───────────────────────────────────────────────────────────

export interface iTunesTrack {
  wrapperType: string
  kind: string
  artistId: number
  collectionId: number
  trackId: number
  artistName: string
  collectionName: string
  trackName: string
  artistViewUrl: string
  collectionViewUrl: string
  trackViewUrl: string
  previewUrl: string
  artworkUrl30: string
  artworkUrl60: string
  artworkUrl100: string
  collectionPrice: number
  trackPrice: number
  releaseDate: string
  discCount: number
  discNumber: number
  trackCount: number
  trackNumber: number
  trackTimeMillis: number
  country: string
  currency: string
  primaryGenreName: string
  isStreamable: boolean
}

export interface iTunesSearchResponse {
  resultCount: number
  results: iTunesTrack[]
}

// ─── Search ──────────────────────────────────────────────────────────

export async function searchTracks(query: string, limit: number = 15): Promise<iTunesTrack[]> {
  const params = new URLSearchParams({
    term: query,
    entity: "song",
    limit: String(limit),
  })

  const response = await fetch(`https://itunes.apple.com/search?${params.toString()}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("iTunes search error body:", errorBody)
    throw new Error(`iTunes search failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as iTunesSearchResponse

  // iTunes occasionally returns non-song entities in search, filter to be safe
  return data.results.filter((track) => track.wrapperType === "track" && track.kind === "song" && track.previewUrl)
}
