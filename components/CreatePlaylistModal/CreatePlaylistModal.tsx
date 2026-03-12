"use client"

// CreatePlaylistModal — wednesday-design: dark modal, green accents
// Creates a playlist and adds it to the Zustand store.

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { CloseIcon, SpinnerIcon } from "components/icons"
import { createPlaylist } from "lib/api/playlists"
import { cn } from "lib/cn"
import { usePlaylistStore } from "store/usePlaylistStore"
import { useToastStore } from "store/useToastStore"

interface CreatePlaylistModalProps {
  onClose: () => void
}

export function CreatePlaylistModal({ onClose }: CreatePlaylistModalProps) {
  const { getToken } = useAuth()
  const { addPlaylist } = usePlaylistStore()
  const { addToast } = useToastStore()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = await getToken()
      const result = await createPlaylist(token, name, description)

      if (result.error) {
        setError(result.error)
        addToast(result.error, "error")
      } else if (result.data) {
        addPlaylist(result.data)
        addToast("Playlist created successfully")
        onClose()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
      addToast(msg, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface border border-[#27272a] rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#27272a]">
          <h2 className="text-lg md:text-xl font-bold text-white m-0">Create Playlist</h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full border-0 bg-transparent flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="w-full bg-[#111111] border border-[#27272a] rounded-xl px-4 py-3 text-white placeholder:text-[#52525b] focus:outline-none focus:border-primary transition-colors"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add an optional description"
                className="w-full h-24 resize-none bg-[#111111] border border-[#27272a] rounded-xl px-4 py-3 text-white placeholder:text-[#52525b] focus:outline-none focus:border-primary transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {error && <p className="text-red-400 text-sm m-0">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border-0 bg-transparent text-sm font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className={cn(
                "min-w-[100px] h-[40px] px-5 rounded-full border-0 text-sm font-bold text-black transition-all duration-200 cursor-pointer flex items-center justify-center gap-2",
                !name.trim() || isSubmitting
                  ? "bg-[#3f3f46] text-[#71717a] cursor-not-allowed"
                  : "bg-primary hover:scale-105 active:scale-95"
              )}
            >
              {isSubmitting ? (
                <SpinnerIcon className="animate-spin text-black" width={16} height={16} />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
