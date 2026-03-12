// SearchResults — renders songs, albums, artists sections after a search
// Hides any section with no results — wednesday-dev: hasResults derived boolean

import { AlbumCard } from "components/AlbumCard/AlbumCard"
import { ArtistCard } from "components/ArtistCard/ArtistCard"
import { Skeleton } from "components/Skeleton/Skeleton"
import { SongCard } from "components/SongCard/SongCard"

import type { ActiveView } from "lib/constants"
import type { ItunesAlbum, ItunesArtist, ItunesTrack } from "lib/itunes/types"

interface SearchResultsProps {
  songs: ItunesTrack[]
  albums: ItunesAlbum[]
  artists: ItunesArtist[]
  isLoading: boolean
  hasSearched: boolean
  onNavClick: (view: ActiveView, id?: string) => void
}

export function SearchResults({ songs, albums, artists, isLoading, hasSearched, onNavClick }: SearchResultsProps) {
  if (isLoading) return <SearchSkeletons />

  const hasResults = songs.length > 0 || albums.length > 0 || artists.length > 0

  if (hasSearched && !hasResults) {
    return (
      <div className="text-center px-6 py-20">
        <p className="text-lg text-muted m-0">No results found</p>
        <p className="text-sm text-muted mt-2 m-0">Try a different search term</p>
      </div>
    )
  }

  return (
    <div>
      {songs.length > 0 && (
        <Section title="Songs" count={songs.length}>
          <div className="flex flex-col gap-1">
            {songs.map((track, i) => (
              <div
                key={track.trackId}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <SongCard track={track} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {albums.length > 0 && (
        <Section title="Albums" count={albums.length}>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]">
            {albums.map((album, i) => (
              <div
                key={album.collectionId}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <AlbumCard album={album} onNavClick={onNavClick} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {artists.length > 0 && (
        <Section title="Artists" count={artists.length}>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]">
            {artists.map((artist, i) => (
              <div
                key={artist.artistId}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ArtistCard artist={artist} onNavClick={onNavClick} />
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <div className="flex items-baseline gap-2.5 mb-4">
        <h2 className="text-xl font-bold text-primary tracking-[-0.01em] m-0">{title}</h2>
        <span className="text-[13px] text-muted">{count} results</span>
      </div>
      {children}
    </section>
  )
}

function SearchSkeletons() {
  return (
    <>
      <section className="mb-10">
        <Skeleton className="w-20 h-6 mb-4" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] rounded-xl" />
          ))}
        </div>
      </section>
      <section className="mb-10">
        <Skeleton className="w-20 h-6 mb-4" />
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[210px] rounded-3xl" />
          ))}
        </div>
      </section>
    </>
  )
}
