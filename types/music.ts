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
}

export type PlayState = "idle" | "playing" | "paused"
