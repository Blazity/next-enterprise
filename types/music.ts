export interface Artist {
  id: string
  name: string
}

export interface Song {
  id: string
  title: string
  artist: Artist
  albumArt: string
  duration: number
  previewUrl?: string
  collectionName?: string
}

export const PLAY_STATE = {
  IDLE: "idle",
  PLAYING: "playing",
  PAUSED: "paused",
} as const

export type PlayState = (typeof PLAY_STATE)[keyof typeof PLAY_STATE]

export interface ITunesTrack {
  trackId: number
  trackName: string
  artistName: string
  artistId: number
  artworkUrl100: string
  previewUrl: string
  trackTimeMillis: number
  collectionName: string
}

export interface ITunesSearchResponse {
  resultCount: number
  results: ITunesTrack[]
}
