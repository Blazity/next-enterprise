// ArtistCard — wednesday-design: artist photo or green gradient avatar fallback
// wednesday-dev: PascalCase component, getInitials helper

import Image from "next/image"

import type { ActiveView } from "lib/constants"
import type { ItunesArtist } from "lib/itunes/types"

interface ArtistCardProps {
  artist: ItunesArtist
  onNavClick?: (view: ActiveView, id?: string) => void
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

export function ArtistCard({ artist, onNavClick }: ArtistCardProps) {
  const initials = getInitials(artist.artistName)

  function handleClick() {
    if (onNavClick) onNavClick("artist_detail", String(artist.artistId))
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-surface rounded-3xl px-4 py-6 border border-border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.97] cursor-pointer"
    >
      {artist.artworkUrl ? (
        <Image
          src={artist.artworkUrl}
          alt={artist.artistName}
          width={80}
          height={80}
          className="size-20 rounded-full object-cover mx-auto mb-3.5 shadow-glow-sm"
        />
      ) : (
        <div className="size-20 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-3.5 shadow-glow-sm text-2xl font-bold text-bg">
          {initials}
        </div>
      )}

      <p className="text-sm font-semibold text-primary truncate m-0">
        {artist.artistName}
      </p>
      <p className="text-[11px] text-muted mt-1 m-0 uppercase tracking-[0.08em]">
        {artist.primaryGenreName}
      </p>
    </div>
  )
}
