"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { CloseIcon, CopyIcon, LinkIcon, SpinnerIcon, TrashIcon } from "components/icons"
import { 
  enablePublicLink, 
  getPlaylistShares, 
  revokePublicLink, 
  revokeShare, 
  sharePlaylist 
} from "lib/api/playlists"
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
  const [isTogglingPublic, setIsTogglingPublic] = useState(false)
  const [shares, setShares] = useState<PlaylistShare[]>([])
  const [publicLink, setPublicLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadShares = useCallback(async () => {
    try {
      const token = await getToken()
      const result = await getPlaylistShares(token, playlistId)
      if (result.data) {
        // Find public link (sharedWith is null)
        const publicShare = result.data.find(s => !s.sharedWith)
        if (publicShare) {
          const frontendUrl = window.location.origin
          setPublicLink(`${frontendUrl}/playlist/shared/${publicShare.token}`)
        } else {
          setPublicLink(null)
        }
        
        // Private shares only
        setShares(result.data.filter(s => !!s.sharedWith && s.shareType === "private"))
      }
    } catch {
      console.error("Failed to load shares")
    } finally {
      setIsFetching(false)
    }
  }, [playlistId, getToken])

  useEffect(() => {
    loadShares()
  }, [loadShares])

  async function handleShare(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const token = await getToken()
      const result = await sharePlaylist(token, playlistId, email)

      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        if (result.data.status === 'shared') {
          addToast("Playlist shared! They've been notified.")
        } else if (result.data.status === 'invited') {
          addToast("Invite sent! They'll get access when they join Sonara.")
        }
        
        // Refresh shares list to reflect any changes if applicable
        loadShares()
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

  async function togglePublicLink() {
    setIsTogglingPublic(true)
    try {
      const token = await getToken()
      if (publicLink) {
        const result = await revokePublicLink(token, playlistId)
        if (result.data) {
          setPublicLink(null)
          addToast("Public link disabled")
        }
      } else {
        const result = await enablePublicLink(token, playlistId)
        if (result.data) {
          setPublicLink(result.data.publicShareUrl)
          addToast("Public link enabled")
        }
      }
    } catch {
      addToast("Failed to update public link", "error")
    } finally {
      setIsTogglingPublic(false)
    }
  }

  function copyToClipboard(url: string) {
    navigator.clipboard.writeText(url)
    addToast("Link copied to clipboard!")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
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
          {/* Public Link Section */}
          <div className="mb-6 p-4 bg-[#111111] border border-[#27272a] rounded-xl">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <LinkIcon className={cn("transition-colors", publicLink ? "text-primary" : "text-muted")} width={18} height={18} />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Public Link</span>
                </div>
                <button
                    onClick={togglePublicLink}
                    disabled={isTogglingPublic}
                    className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        publicLink ? "bg-primary" : "bg-[#27272a]",
                        isTogglingPublic && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <span
                        className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            publicLink ? "translate-x-5" : "translate-x-0"
                        )}
                    />
                </button>
             </div>
             
             {publicLink ? (
                <div className="animate-fade-in">
                    <div className="flex items-center gap-2 bg-black/40 border border-[#27272a] rounded-lg px-3 py-2 text-xs text-[#a1a1aa]">
                        <span className="flex-1 truncate">{publicLink}</span>
                        <button
                            onClick={() => copyToClipboard(publicLink)}
                            className="size-7 rounded-md border-0 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center cursor-pointer"
                            title="Copy to clipboard"
                        >
                            <CopyIcon width={14} height={14} />
                        </button>
                    </div>
                    <p className="text-[10px] text-[#71717a] mt-2 m-0 italic flex items-center gap-1">
                        <span className="size-1 rounded-full bg-green-500" />
                        Anyone with the link can view this playlist.
                    </p>
                </div>
             ) : (
                <p className="text-xs text-[#71717a] m-0">Enable public link to share with anyone without an account.</p>
             )}
          </div>

          <div className="h-px bg-[#27272a] mb-6" />

          {/* Share Form Section */}
          <div className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
              Invite People
            </label>
            <form onSubmit={handleShare} className="flex gap-2">
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
                  "px-6 rounded-full border-0 text-sm font-bold text-black transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[80px]",
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
            </form>
            {error && <p className="text-red-400 text-xs mt-2 m-0">{error}</p>}
          </div>

          {/* Shared With List */}
          <div>
            <h3 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4 m-0">People with access</h3>
            {isFetching ? (
              <div className="flex justify-center py-4">
                <SpinnerIcon className="animate-spin text-muted" width={20} height={20} />
              </div>
            ) : shares.length === 0 ? (
              <p className="text-xs text-muted italic m-0 py-4 border-t border-[#27272a]/30">No private shares yet.</p>
            ) : (
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {shares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between p-2 rounded-xl border border-transparent hover:bg-white/[0.03] last:border-0 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-[11px] font-bold text-primary border border-white/5 capitalize shrink-0">
                        {share.sharedWith?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate m-0 font-medium">{share.sharedWith}</p>
                        <p className="text-[10px] text-muted m-0">Invited on {new Date(share.createdAt).toLocaleDateString()}</p>
                      </div>
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
