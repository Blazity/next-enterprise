"use client"

import { useCallback, useEffect, useState } from "react"

import Link from "next/link"

import { useUser } from "@clerk/nextjs"
import { ListMusic, MoreHorizontal, Pencil, Plus, Share2, Trash2 } from "lucide-react"
import { useFeatureFlag } from "@/hooks/useFeatureFlag"
import { useTranslation } from "react-i18next"

import { ComingSoon } from "@/components/ComingSoon/ComingSoon"
import { cn } from "@/lib/utils"
import { usePlaylistStore } from "@/store/playlistStore"

export function PlaylistsPageContent() {
  const { t } = useTranslation()
  const { user } = useUser()
  const playlistFeatureVariant = useFeatureFlag("playlist-add-feature")
  const playlistFeatureEnabled = playlistFeatureVariant === "on" || playlistFeatureVariant === true
  const { playlists, sharedPlaylists, isLoading, error, fetchPlaylists, fetchSharedPlaylists, createPlaylist, updatePlaylist, deletePlaylist } =
    usePlaylistStore()
  const hasSharedPlaylists = sharedPlaylists.length > 0

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchPlaylists(user.id)
      fetchSharedPlaylists(user.id)
    }
  }, [user?.id, fetchPlaylists, fetchSharedPlaylists])

  const handleCreate = useCallback(async () => {
    if (!user?.id || !newName.trim()) return
    try {
      await createPlaylist(user.id, newName.trim(), newDesc.trim() || undefined)
      setNewName("")
      setNewDesc("")
      setShowCreate(false)
    } catch {
      /* error is in store */
    }
  }, [user?.id, newName, newDesc, createPlaylist])

  const handleUpdate = useCallback(async () => {
    if (!editingId || !editName.trim() || !user?.id) return
    try {
      await updatePlaylist(editingId, { name: editName.trim(), description: editDesc.trim() || undefined }, user.id)
      setEditingId(null)
    } catch {
      /* error is in store */
    }
  }, [editingId, editName, editDesc, updatePlaylist, user?.id])

  const handleDelete = useCallback(
    async (id: number) => {
      if (!user?.id) return
      try {
        await deletePlaylist(id, user.id)
        setMenuOpenId(null)
      } catch {
        /* error is in store */
      }
    },
    [deletePlaylist, user?.id]
  )

  const startEdit = (playlist: { id: number; name: string; description: string | null }) => {
    setEditingId(playlist.id)
    setEditName(playlist.name)
    setEditDesc(playlist.description || "")
    setMenuOpenId(null)
  }

  if (isLoading && playlists.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-accent size-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    )
  }

  // If the flag is off and there are no shared playlists at all, show Coming Soon
  if (!playlistFeatureEnabled && !hasSharedPlaylists) {
    return <ComingSoon titleKey="nav.playlists" />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t("nav.playlists")}</h1>
        {playlistFeatureEnabled && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-accent hover:bg-accent-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <Plus size={18} />
            New Playlist
          </button>
        )}
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      {/* Create form — only visible when feature is enabled */}
      {playlistFeatureEnabled && showCreate && (
        <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Create New Playlist</h2>
          <input
            type="text"
            placeholder="Playlist name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
            className="mb-3 w-full rounded-lg border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/20"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="mb-4 w-full rounded-lg border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/20"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="bg-accent hover:bg-accent-hover rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-40"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreate(false)
                setNewName("")
                setNewDesc("")
              }}
              className="rounded-lg px-5 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Playlist list — only visible when feature is enabled */}
      {playlistFeatureEnabled && (playlists.length === 0 && !showCreate ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
          <ListMusic size={48} className="mb-4 text-white/20" />
          <p className="text-lg font-medium text-white/60">No playlists yet</p>
          <p className="text-text-tertiary mt-1 text-sm">Create your first playlist to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className="group relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-white/[0.04]"
            >
              <div className="from-accent/20 to-accent/5 flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                <ListMusic size={22} className="text-accent" />
              </div>

              {editingId === playlist.id ? (
                <div className="flex flex-1 flex-col gap-2" onClick={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                    autoFocus
                    className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-sm text-white outline-none focus:border-white/20"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                    placeholder="Description"
                    className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleUpdate()
                      }}
                      className="bg-accent rounded-md px-3 py-1 text-xs font-medium text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setEditingId(null)
                      }}
                      className="rounded-md px-3 py-1 text-xs text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{playlist.name}</p>
                  <p className="text-text-tertiary truncate text-xs">
                    {playlist.description || `${playlist.song_count || 0} songs`}
                  </p>
                </div>
              )}

              <span className="text-text-tertiary text-xs">{playlist.song_count || 0} songs</span>

              {/* Menu */}
              <div className="relative" onClick={(e) => e.preventDefault()}>
                <button
                  onClick={() => setMenuOpenId(menuOpenId === playlist.id ? null : playlist.id)}
                  className={cn(
                    "rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white",
                    "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                    menuOpenId === playlist.id && "opacity-100"
                  )}
                >
                  <MoreHorizontal size={18} />
                </button>
                {menuOpenId === playlist.id && (
                  <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-white/[0.08] bg-[#1a1a2e] py-1 shadow-xl">
                    <button
                      onClick={() => startEdit(playlist)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.06]"
                    >
                      <Pencil size={14} /> Rename
                    </button>
                    <button
                      onClick={() => handleDelete(playlist.id)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-white/[0.06]"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ))}

      {/* Shared with me */}
      {sharedPlaylists.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 text-lg font-semibold text-white">{t("share.sharedWithMe")}</h2>
          <div className="space-y-2">
            {sharedPlaylists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="group relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5">
                  <Share2 size={22} className="text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{playlist.name}</p>
                  <p className="text-text-tertiary truncate text-xs">
                    Shared by: {playlist.shared_by_name?.trim() || playlist.shared_by_email || 'Unknown'}
                  </p>
                </div>
                <span className="text-text-tertiary text-xs">{playlist.song_count || 0} songs</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
