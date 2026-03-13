import { iTunesTrack } from "./itunes"

export interface Playlist {
  id: string
  name: string
  description?: string
  user_id: string
  created_at: string
  trackCount?: number
}

export interface LikedSong {
  trackId: number
  createdAt: string
  trackData: iTunesTrack
}
