"use client"

// PlaylistsView — acts as the main SPA container when activeView === "playlists"
// wednesday-dev: uses Zustand store to fetch and hold the list

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { CreatePlaylistModal } from "components/CreatePlaylistModal/CreatePlaylistModal"
import { DeleteConfirmModal } from "components/DeleteConfirmModal/DeleteConfirmModal"
import { ChevronRightIcon, PlaylistIcon, TrashIcon } from "components/icons"
import { PlaylistDetail } from "components/PlaylistDetail/PlaylistDetail"
import { Skeleton } from "components/Skeleton/Skeleton"
import { deletePlaylist, getPlaylists, getSharedWithMe } from "lib/api/playlists"
import { usePlaylistStore } from "store/usePlaylistStore"
import { useToastStore } from "store/useToastStore"

export function PlaylistsView() {
  const { getToken, userId: currentUserId } = useAuth()
  const { requireAuth } = useRequireAuth()
  const { playlists, setPlaylists, sharedPlaylists, setSharedPlaylists, isLoading, setIsLoading, removePlaylist, selectedPlaylistId, setSelectedPlaylistId } = usePlaylistStore()
  const { addToast } = useToastStore()
  const [isCreating, setIsCreating] = useState(false)
  const [playlistToDelete, setPlaylistToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchAllPlaylists() {
      setIsLoading(true)
      try {
        const token = await getToken()
        const [userRes, sharedRes] = await Promise.all([
          getPlaylists(token),
          getSharedWithMe(token)
        ])

        if (userRes.data) {
          setPlaylists(userRes.data)
        }
        if (sharedRes.data) {
          setSharedPlaylists(sharedRes.data)
        }
      } catch (err) {
        console.error("Failed to load user playlists", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllPlaylists()
  }, [getToken, setPlaylists, setSharedPlaylists, setIsLoading])

  if (selectedPlaylistId) {
    return (
      <PlaylistDetail
        playlistId={selectedPlaylistId}
        onBack={() => setSelectedPlaylistId(null)}
      />
    )
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight m-0">Your Playlists</h1>
          <p className="text-muted mt-1.5 m-0 text-sm sm:text-base">Create and manage your music collections.</p>
        </div>
        <button
          onClick={() => requireAuth(() => setIsCreating(true))}
          className="shrink-0 px-5 py-2.5 rounded-full border-0 bg-primary font-bold text-black text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-glow-sm"
        >
          New Playlist
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-1 max-w-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 px-3">
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-32 mb-1.5" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (playlists.length === 0 && sharedPlaylists.length === 0) ? (
        <div className="text-center py-24 px-6 bg-surface-elevated/60 rounded-2xl border border-[#27272a] border-dashed">
          <PlaylistIcon width={56} height={56} className="text-[#3f3f46] mx-auto mb-5" />
          <p className="text-lg text-white font-medium m-0">No playlists yet</p>
          <p className="text-sm text-[#71717a] mt-2 m-0 max-w-sm mx-auto">Create your first playlist and start adding songs.</p>
          <button
            onClick={() => requireAuth(() => setIsCreating(true))}
            className="mt-6 px-5 py-2.5 rounded-full border-0 bg-primary font-bold text-black text-sm cursor-pointer hover:opacity-90 transition-opacity"
          >
            New Playlist
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1 max-w-2xl">
          {playlists.length > 0 ? (
            playlists.map((playlist) => {
              const trackCount = playlist._count?.tracks ?? playlist.tracks?.length ?? 0
              return (
                <div
                  key={playlist.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPlaylistId(playlist.id)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedPlaylistId(playlist.id)}
                  className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-xl border-0 bg-transparent hover:bg-white/5 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <div className="size-12 shrink-0 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-[#27272a]/50 group-hover:border-primary/30 transition-colors">
                    <PlaylistIcon width={18} height={18} className="text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate m-0">{playlist.name}</p>
                    <p className="text-xs text-muted m-0 mt-0.5">
                      {trackCount} track{trackCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPlaylistToDelete({ id: playlist.id, name: playlist.name })
                    }}
                    className="shrink-0 size-8 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all border-0 cursor-pointer"
                    aria-label="Delete playlist"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                  <ChevronRightIcon width={16} height={16} className="shrink-0 text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" />
                </div>
              )
            })
          ) : (
             <div className="px-3 py-6 bg-white/5 border border-dashed border-white/10 rounded-xl text-center">
                <p className="text-xs text-muted m-0">You haven&apos;t created any playlists yet.</p>
             </div>
          )}

          {sharedPlaylists.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs font-bold text-muted uppercase tracking-[0.15em] mb-4 px-3">Shared with you</h2>
              <div className="flex flex-col gap-1">
                {sharedPlaylists.map((playlist) => {
                  const trackCount = playlist._count?.tracks ?? playlist.tracks?.length ?? 0
                  return (
                    <div
                      key={playlist.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedPlaylistId(playlist.id)}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedPlaylistId(playlist.id)}
                      className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-xl border-0 bg-transparent hover:bg-white/5 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset"
                    >
                      <div className="size-12 shrink-0 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-[#27272a]/50 group-hover:border-primary/30 transition-colors">
                        <PlaylistIcon width={18} height={18} className="text-muted group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium truncate m-0">{playlist.name}</p>

                        </div>
                        <p className="text-xs text-muted m-0 mt-0.5">
                          {trackCount} track{trackCount !== 1 ? "s" : ""} • from {playlist.sharedBy}
                        </p>
                      </div>
                      <ChevronRightIcon width={16} height={16} className="shrink-0 text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {isCreating && <CreatePlaylistModal onClose={() => setIsCreating(false)} />}

      {playlistToDelete && (
        <DeleteConfirmModal
          title={`Delete "${playlistToDelete.name}"?`}
          message="This action cannot be undone. All songs in this playlist will be removed from this collection."
          isLoading={isDeleting}
          onCancel={() => setPlaylistToDelete(null)}
          onConfirm={async () => {
            setIsDeleting(true)
            try {
              const token = await getToken()
              const res = await deletePlaylist(token, playlistToDelete.id)
              if (!res.error) {
                removePlaylist(playlistToDelete.id)
                addToast("Playlist deleted successfully")
                setPlaylistToDelete(null)
              } else {
                addToast(res.error || "Failed to delete playlist", "error")
              }
            } catch {
              addToast("An error occurred while deleting", "error")
            } finally {
              setIsDeleting(false)
            }
          }}
        />
      )}
    </div>
  )
}
