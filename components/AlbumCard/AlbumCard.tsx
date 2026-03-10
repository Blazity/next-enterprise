// AlbumCard — wednesday-design: dark card, hover lift -6px + green border glow
// wednesday-dev: extractReleaseYear helper, PascalCase component

import Image from "next/image"

import type { ItunesAlbum } from "lib/itunes/types"
import { extractReleaseYear } from "lib/itunes/utils"

interface AlbumCardProps {
  album: ItunesAlbum
}

export function AlbumCard({ album }: AlbumCardProps) {
  const artworkUrl = album.artworkUrl100.replace("100x100", "300x300")
  const year = extractReleaseYear(album.releaseDate)

  return (
    <div className="bg-surface rounded-3xl p-4 border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.97]">
      <Image
        src={artworkUrl}
        alt={album.collectionName}
        width={160}
        height={160}
        className="rounded-xl block w-full h-auto aspect-square object-cover"
      />
      <div className="mt-3">
        <p className="text-sm font-semibold text-white truncate m-0">
          {album.collectionName}
        </p>
        <p className="text-xs text-muted mt-1 m-0 truncate">
          {album.artistName} · {year}
        </p>
      </div>
    </div>
  )
}
