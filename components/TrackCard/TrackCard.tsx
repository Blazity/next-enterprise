"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Heart, ListMusic, Plus } from "lucide-react"
import Image from "next/image"

import { iTunesTrack } from "lib/itunes"
import { Playlist } from "lib/types"

interface TrackCardProps {
  track: iTunesTrack
  isPlaying: boolean
  isCurrentTrack: boolean
  onPlay: (track: iTunesTrack) => void
  onPause: () => void
  isLiked?: boolean
  onToggleLike?: (track: iTunesTrack) => void
  onAddToPlaylist?: (track: iTunesTrack, playlistId: string) => void
  playlists?: Playlist[]
}

export function TrackCard({ 
  track, 
  isPlaying, 
  isCurrentTrack, 
  onPlay, 
  onPause, 
  isLiked = false, 
  onToggleLike,
  onAddToPlaylist,
  playlists = []
}: TrackCardProps) {
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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleLike) {
      onToggleLike(track)
    }
  }

  return (
    <div
      className={`group relative flex w-full flex-col overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
        isCurrentTrack
          ? "bg-aura-primary/20 border-aura-primary border shadow-[0_0_20px_rgba(239,91,30,0.2)]"
          : "bg-aura-surface hover:bg-white/5 border border-white/5"
      } `}
    >
      <button
        id={`track-card-${track.trackId}`}
        onClick={handleClick}
        disabled={!hasPreview}
        className="w-full disabled:opacity-50"
      >
        {/* Album Art Container */}
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-slate-800 shadow-2xl transition-all group-hover:shadow-aura-primary/20">
          {albumImage ? (
            <Image
              src={albumImage.replace("100x100bb.jpg", "300x300bb.jpg")}
              alt={`${track.collectionName} album art`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-600">
              <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}

          {/* Retro Play Overlay */}
          {hasPreview && (
            <div
              className={`absolute inset-0 flex items-center justify-center pb-2 transition-all duration-300 ease-out ${
                isCurrentTrack && isPlaying
                  ? "bg-black/40 opacity-100 backdrop-blur-[2px]"
                  : "bg-black/40 opacity-0 backdrop-blur-sm group-hover:opacity-100"
              }`}
            >
              {isCurrentTrack && isPlaying ? (
                /* Retro Equalizer */
                <div className="flex h-10 items-end gap-[4px]" aria-label="Playing">
                  <span className="equalizer-bar bg-aura-primary animate-eq-1 w-[6px] rounded-full shadow-[0_0_10px_#ef5b1e]" />
                  <span className="equalizer-bar animate-eq-2 w-[6px] rounded-full bg-white shadow-[0_0_10px_#fff]" />
                  <span className="equalizer-bar bg-aura-secondary animate-eq-3 w-[6px] rounded-full shadow-[0_0_10px_#ff9e2b]" />
                  <span className="equalizer-bar bg-aura-primary animate-eq-4 w-[6px] rounded-full shadow-[0_0_10px_#ef5b1e]" />
                </div>
              ) : (
                /* Orange Play Button */
                <div className="flex h-16 w-16 translate-y-4 scale-90 transform items-center justify-center rounded-full bg-aura-primary text-white shadow-2xl shadow-aura-primary/50 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 hover:scale-110 active:scale-90">
                  <svg className="ml-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={handleLikeClick}
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                isLiked 
                  ? "bg-aura-primary text-white scale-105 shadow-lg shadow-aura-primary/40" 
                  : "bg-black/50 text-white/70 backdrop-blur-md hover:bg-aura-primary hover:text-white group-hover:opacity-100 opacity-0"
              }`}
            >
              <Heart 
                size={16} 
                className={`${isLiked ? "fill-current" : "fill-none"}`} 
              />
            </button>

            {onAddToPlaylist && playlists.length > 0 && (
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="h-9 w-9 rounded-full bg-black/50 text-white/70 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:opacity-100 opacity-0 hover:bg-aura-primary hover:text-white"
                      title="Add to Playlist"
                    >
                      <Plus size={18} />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[180px] bg-aura-surface rounded-xl border border-white/10 p-2 shadow-2xl animate-in fade-in slide-in-from-top-1 z-[100]"
                      sideOffset={5}
                      align="end"
                    >
                      <DropdownMenu.Label className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Add to Playlist
                      </DropdownMenu.Label>
                      {playlists.map((playlist) => (
                        <DropdownMenu.Item
                          key={playlist.id}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/5 outline-none cursor-pointer transition-colors"
                          onSelect={() => onAddToPlaylist(track, playlist.id)}
                        >
                          <ListMusic size={16} className="text-aura-primary" />
                          <span className="truncate">{playlist.name}</span>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="flex w-full min-w-0 flex-1 flex-col justify-center px-1">
          <p
            className={`truncate text-[16px] leading-tight font-black tracking-tight transition-colors ${
              isCurrentTrack
                ? "text-aura-primary"
                : "group-hover:text-aura-primary text-white"
            }`}
            title={track.trackName}
          >
            {track.trackName}
          </p>
          <p className="mt-1.5 truncate text-[12px] font-bold text-slate-500 uppercase tracking-wider" title={artistNames}>
            {artistNames}
          </p>
        </div>
      </button>
    </div>
  )
}
