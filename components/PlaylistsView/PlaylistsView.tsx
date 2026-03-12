"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"

import { CreatePlaylistModal } from "components/CreatePlaylistModal/CreatePlaylistModal"
import { DeleteConfirmModal } from "components/DeleteConfirmModal/DeleteConfirmModal"
import { ChevronRightIcon, LinkIcon, PlaylistIcon, TrashIcon, UsersIcon } from "components/icons"
import { PlaylistDetail } from "components/PlaylistDetail/PlaylistDetail"
import { Skeleton } from "components/Skeleton/Skeleton"

import { deletePlaylist, getPlaylists, getSharedWithMe } from "lib/api/playlists"
import { cn } from "lib/cn"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { usePlaylistStore } from "store/usePlaylistStore"
import { useToastStore } from "store/useToastStore"

export function PlaylistsView() {
  const { getToken } = useAuth()
  const { requireAuth } = useRequireAuth()
  const {
    playlists,
    setPlaylists,
    sharedPlaylists,
    setSharedPlaylists,
    isLoading,
    setIsLoading,
    removePlaylist,
    selectedPlaylistId,
    setSelectedPlaylistId
  } = usePlaylistStore()
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
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight m-0">Your Playlists</h1>
          <p className="text-muted mt-1.5 m-0 text-sm sm:text-base">Create and manage your music collections.</p>
        </div>
        <button
          onClick={() => requireAuth(() => setIsCreating(true))}
          className="shrink-0 px-5 py-2.5 rounded-full border-0 bg-primary font-bold text-bg text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-glow-sm"
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
        <div className="text-center py-24 px-6 bg-surface-elevated/60 rounded-2xl border border-border border-dashed">
          <PlaylistIcon width={56} height={56} className="text-muted/60 mx-auto mb-5" />
          <p className="text-lg text-primary font-medium m-0">No playlists yet</p>
          <p className="text-sm text-muted mt-2 m-0 max-w-sm mx-auto">Create your first playlist and start adding songs.</p>
          <button
            onClick={() => requireAuth(() => setIsCreating(true))}
            className="mt-6 px-5 py-2.5 rounded-full border-0 bg-primary font-bold text-bg text-sm cursor-pointer hover:opacity-90 transition-opacity"
          >
            New Playlist
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1 max-w-2xl">
          {[...playlists, ...sharedPlaylists].map((playlist) => {
            const trackCount = playlist._count?.tracks ?? playlist.tracks?.length ?? 0
            const isShared = !!playlist.sharedBy
            return (
              <div
                key={playlist.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPlaylistId(playlist.id)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedPlaylistId(playlist.id)}
                className="flex items-center gap-3 w-full text-left py-3 px-3 rounded-xl border-0 bg-transparent hover:bg-primary/5 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <div className="size-12 shrink-0 rounded-lg bg-surface-elevated flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors">                  <PlaylistIcon width={18} height={18} className={cn("text-muted transition-colors", isShared ? "text-primary/70 group-hover:text-primary" : "group-hover:text-primary")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-primary font-medium truncate m-0">{playlist.name}</p>
                  <p className="text-xs text-muted m-0 mt-0.5 flex items-center gap-1.5">
                    {trackCount} track{trackCount !== 1 ? "s" : ""}
                    {isShared && (
                      <span className="flex items-center gap-1">
                        • from {playlist.sharedBy}
                        {playlist.shareType === "private" ? (
                          <UsersIcon width={10} height={10} className="text-primary/60" />
                        ) : (
                          <LinkIcon width={10} height={10} className="text-primary/60" />
                        )}
                      </span>
                    )}
                  </p>
                </div>

                {!isShared && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPlaylistToDelete({ id: playlist.id, name: playlist.name })
                    }}
                    className="shrink-0 size-8 rounded-lg flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-500/10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all border-0 cursor-pointer"
                    aria-label="Delete playlist"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                )}

                <ChevronRightIcon width={16} height={16} className="shrink-0 text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" />
              </div>
            )
          })}
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
