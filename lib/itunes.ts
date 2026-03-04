import type { ITunesTrack, Song } from "@/types/music"

export function mapITunesTrackToSong(track: ITunesTrack): Song {
  return {
    id: String(track.trackId),
    title: track.trackName,
    artist: {
      id: String(track.artistId),
      name: track.artistName,
    },
    albumArt: track.artworkUrl100.replace("100x100", "300x300"),
    duration: Math.round(track.trackTimeMillis / 1000),
    previewUrl: track.previewUrl,
    collectionName: track.collectionName,
  }
}
