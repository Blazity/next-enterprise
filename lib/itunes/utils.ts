// iTunes parsing and display utils — reusable across the app

import type { RssEntry } from "lib/itunes/rssTypes"
import type { ItunesAlbum } from "lib/itunes/types"

export function getLargestRssArtwork(images: RssEntry["im:image"]): string {
  return images.at(-1)?.label ?? images[0]?.label ?? ""
}

export function parseRssEntryToAlbum(entry: RssEntry): ItunesAlbum {
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

// Converts milliseconds to a m:ss string (e.g. 213000 → "3:33")
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Extracts the 4-digit year from an ISO date string (e.g. "2021-06-18T07:00:00Z" → "2021")
export function extractReleaseYear(releaseDate: string): string {
  return new Date(releaseDate).getFullYear().toString()
}
