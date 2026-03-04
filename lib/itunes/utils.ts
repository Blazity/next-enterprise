// iTunes RSS parsing utils — reusable across any RSS-based iTunes feed

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
