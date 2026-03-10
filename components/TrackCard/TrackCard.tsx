"use client"

import Image from "next/image"
import type { iTunesTrack } from "lib/itunes"

interface TrackCardProps {
  track: iTunesTrack
  isPlaying: boolean
  isCurrentTrack: boolean
  onPlay: (track: iTunesTrack) => void
  onPause: () => void
}

export function TrackCard({ track, isPlaying, isCurrentTrack, onPlay, onPause }: TrackCardProps) {
  const albumImage = track.artworkUrl100
  const hasPreview = Boolean(track.previewUrl)
  const artistNames = track.artistName

  const handleClick = () => {
    if (!hasPreview) return
    if (isCurrentTrack && isPlaying) {
      onPause()
    } else {
      onPlay(track)
    }
  }

  return (
    <button
      id={`track-card-${track.trackId}`}
      onClick={handleClick}
      disabled={!hasPreview}
      className={`group hover:shadow-aura-primary/20 relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl p-4 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 ${
        isCurrentTrack
          ? "bg-aura-card-hover border-aura-primary border"
          : "bg-aura-card hover:bg-aura-card-hover border border-white/5"
      } `}
    >
      {/* Album Art Container - Edge to edge look */}
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-slate-800 shadow-xl transition-all group-hover:shadow-2xl">
        {albumImage ? (
          <Image
            src={albumImage.replace("100x100bb.jpg", "300x300bb.jpg")} // Fetch higher res image from iTunes
            alt={`${track.collectionName} album art`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}

        {/* Play/Pause Overlay - Ultra Glassmorphism */}
        {hasPreview && (
          <div
            className={`absolute inset-0 flex items-center justify-center pb-2 transition-all duration-300 ease-out ${
              isCurrentTrack && isPlaying
                ? "bg-black/60 opacity-100 backdrop-blur-sm"
                : "bg-black/40 opacity-0 backdrop-blur-md group-hover:opacity-100"
            }`}
          >
            {isCurrentTrack && isPlaying ? (
              /* Equalizer Animation */
              <div className="flex h-8 items-end gap-[4px]" aria-label="Playing">
                <span className="equalizer-bar bg-aura-primary animate-eq-1 w-[5px] rounded-full drop-shadow-md" />
                <span className="equalizer-bar animate-eq-2 w-[5px] rounded-full bg-white drop-shadow-md" />
                <span className="equalizer-bar bg-aura-secondary animate-eq-3 w-[5px] rounded-full drop-shadow-md" />
                <span className="equalizer-bar bg-aura-primary animate-eq-4 w-[5px] rounded-full drop-shadow-md" />
              </div>
            ) : (
              /* Premium Play Button */
              <div className="flex h-14 w-14 translate-y-4 scale-90 transform items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform duration-300 group-hover:translate-y-0 group-hover:scale-110">
                <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* No Preview Badge */}
        {!hasPreview && (
          <div className="absolute bottom-2 left-2 rounded border border-white/10 bg-black/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
            No preview
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex w-full min-w-0 flex-1 flex-col justify-center">
        <p
          className={`truncate text-[15px] leading-tight font-bold transition-colors ${
            isCurrentTrack
              ? "from-aura-primary to-aura-secondary bg-gradient-to-r bg-clip-text text-transparent"
              : "group-hover:text-aura-primary text-white"
          }`}
          title={track.trackName}
        >
          {track.trackName}
        </p>
        <p className="mt-1 truncate text-[13px] font-medium text-slate-400" title={artistNames}>
          {artistNames}
        </p>
      </div>
    </button>
  )
}
