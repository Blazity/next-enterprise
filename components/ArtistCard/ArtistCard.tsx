// ArtistCard — wednesday-design: artist photo or green gradient avatar fallback
// wednesday-dev: PascalCase component, getInitials helper

import Image from "next/image"

import type { ItunesArtist } from "lib/itunes/types"

interface ArtistCardProps {
  artist: ItunesArtist
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const initials = getInitials(artist.artistName)

  return (
    <div className="bg-surface rounded-3xl px-4 py-6 border border-border cursor-pointer text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-primary/20">
      {artist.artworkUrl ? (
        <Image
          src={artist.artworkUrl}
          alt={artist.artistName}
          width={80}
          height={80}
          className="size-20 rounded-full object-cover mx-auto mb-3.5 shadow-glow-sm"
        />
      ) : (
        <div className="size-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-3.5 shadow-glow-sm text-2xl font-bold text-white">
          {initials}
        </div>
      )}

      <p className="text-sm font-semibold text-white truncate m-0">
        {artist.artistName}
      </p>
      <p className="text-[11px] text-muted mt-1 m-0 uppercase tracking-[0.08em]">
        {artist.primaryGenreName}
      </p>
    </div>
  )
}
