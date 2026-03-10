"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { CloseIcon, CopyIcon, SpinnerIcon, TrashIcon } from "components/icons"
import { getPlaylistShares, revokeShare, sharePlaylist } from "lib/api/playlists"
import type { PlaylistShare } from "lib/api/playlists"
import { cn } from "lib/cn"
import { useToastStore } from "store/useToastStore"

interface SharePlaylistModalProps {
  playlistId: string
  playlistName: string
  onClose: () => void
}

export function SharePlaylistModal({ playlistId, playlistName, onClose }: SharePlaylistModalProps) {
  const { getToken } = useAuth()
  const { addToast } = useToastStore()

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [shares, setShares] = useState<PlaylistShare[]>([])
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadShares() {
      try {
        const token = await getToken()
        const result = await getPlaylistShares(token, playlistId)
        if (result.data) {
          setShares(result.data)
        }
      } catch {
        console.error("Failed to load shares")
      } finally {
        setIsFetching(false)
      }
    }
    loadShares()
  }, [playlistId, getToken])

  async function handleShare(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setError(null)
    setShareUrl(null)

    try {
      const token = await getToken()
      const result = await sharePlaylist(token, playlistId, email)

      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setShareUrl(result.data.shareUrl)
        setShares((prev) => [...prev, result.data!.share])
        addToast("Playlist shared successfully")
        setEmail("")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRevoke(shareId: string) {
    try {
      const token = await getToken()
      const result = await revokeShare(token, playlistId, shareId)
      if (result.data) {
        setShares((prev) => prev.filter((s) => s.id !== shareId))
        addToast("Share revoked")
      } else if (result.error) {
        addToast(result.error, "error")
      }
    } catch {
      addToast("Failed to revoke share", "error")
    }
  }

  function copyToClipboard() {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      addToast("Link copied to clipboard!")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-surface border border-[#27272a] rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
          <h2 className="text-xl font-bold text-white m-0 truncate pr-4">Share "{playlistName}"</h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full border-0 bg-transparent flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Share Form */}
          <form onSubmit={handleShare} className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Share with someone by email
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-1 bg-[#111111] border border-[#27272a] rounded-xl px-4 py-2.5 text-white placeholder:text-[#52525b] focus:outline-none focus:border-primary transition-colors text-sm"
                disabled={isSubmitting}
                required
              />
              <button
                type="submit"
                disabled={!email.trim() || isSubmitting}
                className={cn(
                  "px-5 rounded-full border-0 text-sm font-bold text-black transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[80px]",
                  !email.trim() || isSubmitting
                    ? "bg-[#3f3f46] text-[#71717a] cursor-not-allowed"
                    : "bg-primary hover:scale-105 active:scale-95"
                )}
              >
                {isSubmitting ? (
                  <SpinnerIcon className="animate-spin text-black" width={16} height={16} />
                ) : (
                  "Share"
                )}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2 m-0">{error}</p>}
          </form>

          {/* Share URL Result */}
          {shareUrl && (
            <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl animate-fade-in">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 m-0">Generated Share Link</p>
              <div className="flex items-center gap-2 bg-[#111111] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-[#a1a1aa]">
                <span className="flex-1 truncate">{shareUrl}</span>
                <button
                  onClick={copyToClipboard}
                  className="size-7 rounded-md border-0 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center cursor-pointer"
                  title="Copy to clipboard"
                >
                  <CopyIcon width={14} height={14} />
                </button>
              </div>
              <p className="text-[10px] text-[#71717a] mt-2 m-0 italic">Only the recipient account can view this link.</p>
            </div>
          )}

          {/* Shared With List */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 m-0 uppercase tracking-widest text-[11px] text-muted">Shared With</h3>
            {isFetching ? (
              <div className="flex justify-center py-4">
                <SpinnerIcon className="animate-spin text-muted" width={20} height={20} />
              </div>
            ) : shares.length === 0 ? (
              <p className="text-sm text-muted italic m-0 py-2 border-t border-[#27272a]/30">Not shared with anyone yet.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {shares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between py-2 border-b border-[#27272a]/30 last:border-0 group">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate m-0">{share.sharedWith}</p>
                      <p className="text-[10px] text-muted m-0">Shared on {new Date(share.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleRevoke(share.id)}
                      className="size-8 rounded-lg border-0 bg-transparent text-[#71717a] hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Revoke access"
                    >
                      <TrashIcon width={14} height={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-[#111111]/50 border-t border-[#27272a] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-[#27272a] bg-transparent text-sm font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
