"use client"

import { formatDistanceToNow } from "date-fns"
import { Clock, Heart, Music, Play } from "lucide-react"
import Image from "next/image"

import { iTunesTrack } from "lib/itunes"

interface TrackTableProps {
  tracks: (iTunesTrack & { addedAt?: string })[]
  currentTrackId: number | null
  isPlaying: boolean
  onPlay: (track: iTunesTrack) => void
  onPause: () => void
  likedSongIds: number[]
  onToggleLike?: (track: iTunesTrack) => void
}

export function TrackTable({
  tracks,
  currentTrackId,
  isPlaying,
  onPlay,
  onPause,
  likedSongIds,
  onToggleLike,
}: TrackTableProps) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-white/5">
            <th className="px-4 py-3 font-bold w-12">#</th>
            <th className="px-4 py-3 font-bold">Title</th>
            <th className="px-4 py-3 font-bold hidden md:table-cell">Album</th>
            <th className="px-4 py-3 font-bold hidden lg:table-cell">Date Added</th>
            <th className="px-4 py-3 font-bold w-12 text-center">
              <Clock size={16} className="inline" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {tracks.map((track, index) => {
            const isCurrent = currentTrackId === track.trackId
            const isTrackPlaying = isCurrent && isPlaying

            return (
              <tr 
                key={`${track.trackId}-${index}`}
                className="group hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => isTrackPlaying ? onPause() : onPlay(track)}
              >
                <td className="px-4 py-4 text-slate-500 text-[10px] font-black w-12 text-center uppercase tracking-tighter">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play 
                    size={14} 
                    className={`hidden group-hover:inline ${isCurrent ? "text-aura-primary" : "text-white"}`}
                    fill={isCurrent ? "currentColor" : "none"}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-aura-surface border border-white/5 overflow-hidden relative shadow-lg">
                      {track.artworkUrl100 ? (
                        <Image src={track.artworkUrl100} alt={track.trackName} fill sizes="48px" className="object-cover transition-transform group-hover:scale-110 duration-500" />
                      ) : (
                        <Music className="text-aura-primary/40 m-auto h-5 w-5" />
                      )}
                      {isTrackPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="flex gap-1 items-end h-4">
                            <div className="w-1 bg-aura-primary animate-eq-1" />
                            <div className="w-1 bg-aura-primary animate-eq-2" />
                            <div className="w-1 bg-aura-primary animate-eq-3" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-base font-black truncate tracking-tight ${isCurrent ? "text-aura-primary" : "text-white"}`}>
                        {track.trackName}
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">{track.artistName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-400 text-sm font-medium hidden md:table-cell truncate max-w-[200px]">
                  {track.collectionName}
                </td>
                <td className="px-4 py-4 text-slate-500 text-[11px] font-bold uppercase tracking-widest hidden lg:table-cell">
                  {track.addedAt ? formatDistanceToNow(new Date(track.addedAt), { addSuffix: true }) : "-"}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleLike?.(track)
                    }}
                    className={`transition-all hover:scale-125 active:scale-95 ${
                      likedSongIds.includes(track.trackId) ? "text-aura-primary drop-shadow-[0_0_8px_#ef5b1e]" : "text-slate-600 hover:text-white"
                    }`}
                  >
                    <Heart size={18} fill={likedSongIds.includes(track.trackId) ? "currentColor" : "none"} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
