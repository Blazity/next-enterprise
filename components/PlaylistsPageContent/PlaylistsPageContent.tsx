"use client"

import { useCallback, useEffect, useState } from "react"

import Link from "next/link"

import { useUser } from "@clerk/nextjs"
import { AnimatePresence, motion } from "framer-motion"
import { ListMusic, MoreHorizontal, Pencil, Plus, Share2, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Spotlight } from "@/components/ui/spotlight"
import { useFeatureFlag } from "@/hooks/useFeatureFlag"
import { cn } from "@/lib/utils"
import { usePlaylistStore } from "@/store/playlistStore"

const stagger = {
  show: { transition: { staggerChildren: 0.04 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function PlaylistsPageContent() {
  const { t } = useTranslation()
  const { user } = useUser()
  const playlistFeatureVariant = useFeatureFlag("playlist-add-feature")
  const playlistFeatureEnabled = playlistFeatureVariant === "on" || playlistFeatureVariant === true
  const { playlists, sharedPlaylists, isLoading, error, fetchPlaylists, fetchSharedPlaylists, createPlaylist, updatePlaylist, deletePlaylist } =
    usePlaylistStore()

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

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-8 md:px-6">
      <div className="absolute inset-x-0 top-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(252, 60, 68, 0.07)" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="from-cyan-500 via-blue-500 to-indigo-500 relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-xl shadow-cyan-500/30">
            <div className="from-cyan-500/40 via-blue-500/40 to-indigo-500/40 absolute inset-0 animate-pulse rounded-xl bg-gradient-to-br blur-md" />
            <ListMusic size={24} className="relative z-10 text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t("nav.playlists")}</h1>
        </div>
        {playlistFeatureEnabled && (
          <button
            onClick={() => setShowCreate(true)}
            className="from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 relative overflow-hidden flex items-center gap-2 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">New Playlist</span>
          </button>
        )}
      </motion.div>

      {error && <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      {/* Create form */}
      <AnimatePresence>
        {playlistFeatureEnabled && showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]"
          >
            <div className="p-5">
              <h2 className="mb-4 text-lg font-semibold text-white">Create New Playlist</h2>
              <input
                type="text"
                placeholder="Playlist name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
                className="mb-3 w-full rounded-lg border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-accent/40"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="mb-4 w-full rounded-lg border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-accent/40"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="bg-accent hover:bg-accent-hover rounded-lg px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all duration-200 disabled:opacity-40 disabled:shadow-none"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist list */}
      {playlists.length === 0 && !showCreate ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-[30vh] flex-col items-center justify-center text-center"
        >
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/[0.04]">
            <ListMusic size={32} className="text-white/20" />
          </div>
          <p className="text-lg font-medium text-white/60">No playlists yet</p>
          {playlistFeatureEnabled && (
            <p className="text-text-tertiary mt-1 text-sm">Create your first playlist to get started</p>
          )}
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          {playlists.map((playlist) => (
            <motion.div key={playlist.id} variants={fadeUp}>
              <Link
                href={`/playlist/${playlist.id}`}
                className="group relative flex items-center gap-4 rounded-xl border border-transparent px-4 py-3.5 transition-all duration-200 hover:border-white/[0.06] hover:bg-white/[0.04]"
              >
                <div className="from-cyan-500/20 to-blue-500/10 flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ring-1 ring-cyan-500/30 group-hover:ring-cyan-400/50 transition-all duration-300">
                  <ListMusic size={22} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>

                {editingId === playlist.id ? (
                  <div className="flex flex-1 flex-col gap-2" onClick={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                      autoFocus
                      className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-sm text-white outline-none focus:border-accent/40"
                    />
                    <input
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                      placeholder="Description"
                      className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none focus:border-accent/40"
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
                      "rounded-lg p-2 text-white/40 transition-all duration-200 hover:bg-white/[0.06] hover:text-white",
                      "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                      menuOpenId === playlist.id && "opacity-100"
                    )}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  <AnimatePresence>
                    {menuOpenId === playlist.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-white/[0.08] bg-[#1a1a2e] py-1 shadow-xl shadow-black/40"
                      >
                        <button
                          onClick={() => startEdit(playlist)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/[0.06]"
                        >
                          <Pencil size={14} /> Rename
                        </button>
                        <button
                          onClick={() => handleDelete(playlist.id)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-white/[0.06]"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Shared with me */}
      {sharedPlaylists.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="mb-4 mt-10 text-lg font-semibold text-white">{t("share.sharedWithMe")}</h2>
          <div className="space-y-2">
            {sharedPlaylists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="group relative flex items-center gap-4 rounded-xl border border-transparent px-4 py-3.5 transition-all duration-200 hover:border-white/[0.06] hover:bg-white/[0.04]"
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
        </motion.div>
      )}
    </div>
  )
}
