"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { Plus, X } from "lucide-react"
import { useState } from "react"

import { createPlaylist } from "lib/actions/playlists"
import { Playlist } from "lib/types"

interface CreatePlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (playlist: Playlist) => void
}

export function CreatePlaylistModal({ isOpen, onClose, onSuccess }: CreatePlaylistModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const playlist = await createPlaylist(name, description) as Playlist
      onSuccess(playlist)
      setName("")
      setDescription("")
      onClose()
    } catch (err) {
      console.error("Failed to create playlist:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl z-[151] animate-in zoom-in-95 fade-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-black text-white tracking-tight">
              Create Playlist
            </Dialog.Title>
            <Dialog.Close className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                Playlist Name
              </label>
              <input
                id="name"
                autoFocus
                placeholder="Give your playlist a name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-aura-primary transition-all pr-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                placeholder="Add an optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-aura-primary transition-all min-h-[100px] resize-none"
              />
            </div>

            <button
              disabled={isSubmitting || !name.trim()}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-white disabled:active:scale-100 mt-4 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Creating..." : (
                <>
                  <Plus size={20} />
                  <span>Create Playlist</span>
                </>
              )}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
