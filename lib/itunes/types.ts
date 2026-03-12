// iTunes Search & Lookup API response types
// API docs: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/

export interface ItunesTrack {
  wrapperType: "track" | string
  kind: "song" | "podcast-episode" | string
  trackId: number
  trackName: string
  artistId: number
  artistName: string
  collectionName: string
  artworkUrl100: string
  previewUrl: string | null
  episodeUrl?: string
  description?: string
  trackTimeMillis: number
  collectionId: number
  trackNumber: number
  primaryGenreName: string
  releaseDate: string
}

export interface ItunesAlbum {
  wrapperType: "collection"
  collectionType: "Album"
  collectionId: number
  collectionName: string
  artistName: string
  artworkUrl100: string
  releaseDate: string
  primaryGenreName: string
  artistId: number
  trackCount: number
}

export interface ItunesArtist {
  wrapperType: "artist"
  artistType: "Artist"
  artistId: number
  artistName: string
  primaryGenreName: string
  artworkUrl?: string // not in iTunes API — enriched from a track search
}

export interface ItunesSearchResponse<T> {
  resultCount: number
  results: T[]
}
