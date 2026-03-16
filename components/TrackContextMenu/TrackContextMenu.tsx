"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { CreatePlaylistModal } from "components/CreatePlaylistModal/CreatePlaylistModal"
import { AlbumIcon, ArtistIcon, DotsHorizontalIcon, HeartFilledIcon, HeartIcon, PlusIcon, QueueIcon, SpinnerIcon } from "components/icons"
import { addTrack } from "lib/api/playlists"
import { cn } from "lib/cn"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import type { ItunesTrack } from "lib/itunes/types"
import { useLikeStore } from "store/useLikeStore"
import { usePlayerStore } from "store/usePlayerStore"
import { usePlaylistStore } from "store/usePlaylistStore"
import { useToastStore } from "store/useToastStore"

interface TrackContextMenuProps {
  track: ItunesTrack
  /** Appearance variant — 'dark' for the full-page player overlay */
  variant?: "default" | "dark"
  className?: string
}

export function TrackContextMenu({ track, variant = "default", className }: TrackContextMenuProps) {
  const router = useRouter()
  const { getToken } = useAuth()
  const { requireAuth } = useRequireAuth()
  const { addToQueue } = usePlayerStore()
  const { addToast } = useToastStore()
  const { playlists, isLoading: isPlaylistsLoading } = usePlaylistStore()
  const { getToken: getLikeToken } = useAuth()
  const { isLiked, toggleLike } = useLikeStore()
  const liked = isLiked(track.trackId)
  
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<"main" | "playlists">("main")
  const [addingToId, setAddingToId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Reset view when closing
  useEffect(() => {
    if (!open) {
      setTimeout(() => setView("main"), 200)
    }
  }, [open])

  // Close when clicking outside
  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  function handleAddToQueue(e: React.MouseEvent) {
    e.stopPropagation()
    addToQueue(track)
    addToast(`"${track.trackName}" will play next`)
    setOpen(false)
  }

  async function handleToggleLike(e: React.MouseEvent) {
    e.stopPropagation()
    requireAuth(async () => {
      const token = await getLikeToken()
      await toggleLike(token, track.trackId)
      addToast(liked ? "Removed from Liked Songs" : "Added to Liked Songs")
      setOpen(false)
    })
  }

  function handleGoToArtist(e: React.MouseEvent) {
    e.stopPropagation()
    router.push(`/?view=artist_detail&id=${track.artistId}`, { scroll: false })
    setOpen(false)
  }

  function handleGoToAlbum(e: React.MouseEvent) {
    e.stopPropagation()
    if (!track.collectionId) return
    router.push(`/?view=album_detail&id=${track.collectionId}`, { scroll: false })
    setOpen(false)
  }

  async function handleAddToPlaylist(playlistId: string) {
    if (addingToId) return
    setAddingToId(playlistId)
    try {
      const token = await getToken()
      await addTrack(token, playlistId, track.trackId)
      addToast("Track added to playlist")
      setOpen(false)
    } catch (error) {
      console.error("Failed to add track", error)
      addToast("Failed to add track", "error")
    } finally {
      setAddingToId(null)
    }
  }

  const isDark = variant === "dark"

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        aria-label="More options"
        className={cn(
          "size-8 flex items-center justify-center rounded-full border-0 cursor-pointer transition-all",
          isDark
            ? "text-white/60 hover:text-white hover:bg-white/10"
            : "text-muted hover:text-primary hover:bg-surface-elevated",
          open && (isDark ? "text-white bg-white/10" : "text-primary bg-surface-elevated")
        )}
      >
        <DotsHorizontalIcon width={18} height={18} />
      </button>

      {open && (
        <div
          ref={menuRef}
          className={cn(
            "absolute right-0 bottom-full mb-2 z-[9999] min-w-[210px] rounded-xl shadow-2xl border overflow-hidden",
            "animate-in fade-in zoom-in-95 duration-150",
            isDark
              ? "bg-[#1a1a1a] border-white/10"
              : "bg-surface border-border"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {view === "main" ? (
            <>
              {/* Like / Unlike */}
              <button
                onClick={handleToggleLike}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-sm text-left border-0 cursor-pointer transition-colors",
                  isDark
                    ? "text-white/90 hover:bg-white/10"
                    : "text-primary hover:bg-surface-elevated"
                )}
              >
                {liked
                  ? <HeartFilledIcon width={16} height={16} className="shrink-0 text-red-500" />
                  : <HeartIcon width={16} height={16} className="shrink-0 text-muted" />
                }
                {liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
              </button>

              {/* Divider */}
              <div className={cn("h-px mx-3", isDark ? "bg-white/10" : "bg-border")} />

              {/* Play Next */}
              <button
                onClick={handleAddToQueue}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-sm text-left border-0 cursor-pointer transition-colors",
                  isDark
                    ? "text-white/90 hover:bg-white/10"
                    : "text-primary hover:bg-surface-elevated"
                )}
              >
                <QueueIcon width={16} height={16} className="shrink-0 text-muted" />
                Add to queue
              </button>

              {/* Add to Playlist */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  requireAuth(() => setView("playlists"))
                }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-sm text-left border-0 cursor-pointer transition-colors",
                  isDark
                    ? "text-white/90 hover:bg-white/10"
                    : "text-primary hover:bg-surface-elevated"
                )}
              >
                <PlusIcon width={16} height={16} className="shrink-0 text-muted" />
                Add to playlist
              </button>

              {/* Divider */}
              <div className={cn("h-px mx-3", isDark ? "bg-white/10" : "bg-border")} />

              {/* Go to Artist */}
              <button
                onClick={handleGoToArtist}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-sm text-left border-0 cursor-pointer transition-colors",
                  isDark
                    ? "text-white/90 hover:bg-white/10"
                    : "text-primary hover:bg-surface-elevated"
                )}
              >
                <ArtistIcon width={16} height={16} className="shrink-0 text-muted" />
                Go to Artist
              </button>

              {/* Go to Album — only when collectionId exists */}
              {!!track.collectionId && (
                <button
                  onClick={handleGoToAlbum}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 text-sm text-left border-0 cursor-pointer transition-colors",
                    isDark
                      ? "text-white/90 hover:bg-white/10"
                      : "text-primary hover:bg-surface-elevated"
                  )}
                >
                  <AlbumIcon width={16} height={16} className="shrink-0 text-muted" />
                  Go to Album
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col py-1">
              <div className="px-4 py-2 border-b border-border mb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Add to Playlist</span>
                <button 
                  onClick={() => setView("main")}
                  className="text-[10px] font-bold text-primary hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Back
                </button>
              </div>

              <div className="max-h-[240px] overflow-y-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsCreating(true)
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left border-0 cursor-pointer transition-colors font-medium text-primary",
                    isDark ? "hover:bg-white/10" : "hover:bg-surface-elevated"
                  )}
                >
                  <div className="size-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <PlusIcon width={14} height={14} className="text-primary" />
                  </div>
                  Create New
                </button>

                <div className={cn("h-px mx-3 my-1", isDark ? "bg-white/10" : "bg-border")} />

                {isPlaylistsLoading ? (
                  <div className="px-4 py-4 text-center">
                    <SpinnerIcon className="animate-spin text-muted mx-auto" />
                  </div>
                ) : playlists.length > 0 ? (
                  playlists.map((p) => (
                    <button
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToPlaylist(p.id)
                      }}
                      disabled={addingToId === p.id}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border-0 cursor-pointer transition-colors",
                        isDark ? "text-white/80 hover:bg-white/10" : "text-primary/80 hover:bg-surface-elevated"
                      )}
                    >
                      <span className="truncate mr-2">{p.name}</span>
                      {addingToId === p.id && <SpinnerIcon width={12} height={12} className="animate-spin text-primary" />}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-4 text-xs text-muted text-center italic">
                    No playlists yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {isCreating && <CreatePlaylistModal onClose={() => {
        setIsCreating(false)
        setOpen(false)
      }} />}
    </div>
  )
}

