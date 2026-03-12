"use client"

// AddToPlaylistButton — renders inside track cards
// wednesday-dev: dropdown listing playlists, allowing adding a track

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useFeatureFlagEnabled } from "posthog-js/react"

import { CreatePlaylistModal } from "components/CreatePlaylistModal/CreatePlaylistModal"
import { PlaylistIcon, SpinnerIcon } from "components/icons"
import { addTrack } from "lib/api/playlists"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { usePlaylistStore } from "store/usePlaylistStore"
import { useToastStore } from "store/useToastStore"

interface AddToPlaylistButtonProps {
  trackId: number
}

export function AddToPlaylistButton({ trackId }: AddToPlaylistButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [addingToId, setAddingToId] = useState<string | null>(null)
  
  const { getToken } = useAuth()
  const { requireAuth } = useRequireAuth()
  const { playlists, isLoading } = usePlaylistStore()
  const { addToast } = useToastStore()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isPlaylistEnabled = useFeatureFlagEnabled("playlist-feature") ?? false

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  async function handleAddToPlaylist(playlistId: string) {
    if (addingToId) return
    setAddingToId(playlistId)
    try {
      const token = await getToken()
      await addTrack(token, playlistId, trackId)

      addToast("Track added to playlist")
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to add track", error)
      addToast("Failed to add track", "error")
    } finally {
      setAddingToId(null)
    }
  }

  if (!isPlaylistEnabled) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          requireAuth(() => setIsOpen(!isOpen))
        }}
        aria-label="Add to playlist"
        className="size-8 rounded-full border-0 bg-transparent flex items-center justify-center shrink-0 transition-colors text-muted hover:text-primary hover:bg-primary/10"
      >
        <PlaylistIcon width={16} height={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-10 w-48 bg-surface-elevated border border-border rounded-xl shadow-xl overflow-hidden z-[300] py-1 animate-fade-in-up">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
              setIsCreating(true)
            }}
            className="w-full px-4 py-2.5 bg-transparent border-0 text-left text-sm font-medium text-primary hover:bg-primary/5 cursor-pointer flex items-center justify-between"
          >
            Create New Playlist
          </button>
          
          <div className="my-1 border-t border-border" />

          {isLoading ? (
            <div className="px-4 py-3 text-center">
              <SpinnerIcon width={16} height={16} className="animate-spin text-muted mx-auto" />
            </div>
          ) : playlists.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToPlaylist(p.id)
                  }}
                  disabled={addingToId === p.id}
                  className="w-full px-4 py-2.5 bg-transparent border-0 text-left text-sm text-primary hover:bg-primary/5 cursor-pointer flex items-center justify-between gap-2"
                >
                  <span className="truncate">{p.name}</span>
                  {addingToId === p.id && (
                    <SpinnerIcon width={12} height={12} className="shrink-0 animate-spin text-primary" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-muted text-center italic">
              No playlists yet
            </div>
          )}
        </div>
      )}

      {isCreating && <CreatePlaylistModal onClose={() => setIsCreating(false)} />}
    </div>
  )
}
