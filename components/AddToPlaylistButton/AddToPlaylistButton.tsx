"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useUser } from "@clerk/nextjs"
import { Check, ListPlus, Plus, X } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { usePlaylistStore } from "@/store/playlistStore"
import type { Song } from "@/types/music"

interface AddToPlaylistButtonProps {
    song: Song
    className?: string
    dropdownPosition?: "top" | "bottom"
}

export function AddToPlaylistButton({ song, className, dropdownPosition = "bottom" }: AddToPlaylistButtonProps) {
    const { t } = useTranslation()
    const { user } = useUser()
    const posthog = usePostHog()
    const { playlists, fetchPlaylists, addSong, createPlaylist } = usePlaylistStore()

    const [isOpen, setIsOpen] = useState(false)
    const [feedback, setFeedback] = useState<{ playlistId: number; type: "success" | "error" | "duplicate" } | null>(null)
    const [showCreate, setShowCreate] = useState(false)
    const [newName, setNewName] = useState("")
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fetch playlists when dropdown opens
    useEffect(() => {
        if (isOpen && user?.id) {
            fetchPlaylists(user.id)
        }
    }, [isOpen, user?.id, fetchPlaylists])

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setShowCreate(false)
                setNewName("")
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [isOpen])

    // Clear feedback after delay
    useEffect(() => {
        if (!feedback) return
        const timer = setTimeout(() => setFeedback(null), 2000)
        return () => clearTimeout(timer)
    }, [feedback])

    const handleAdd = useCallback(
        async (playlistId: number) => {
            try {
                await addSong(playlistId, song)
                setFeedback({ playlistId, type: "success" })
                posthog?.capture("playlist_song_added", {
                    playlist_id: playlistId,
                    song_id: song.id,
                    song_title: song.title,
                })
            } catch (err) {
                const msg = err instanceof Error ? err.message : ""
                if (msg.includes("already") || msg.includes("Already")) {
                    setFeedback({ playlistId, type: "duplicate" })
                    posthog?.capture("playlist_song_add_duplicate", {
                        playlist_id: playlistId,
                        song_id: song.id,
                    })
                } else {
                    setFeedback({ playlistId, type: "error" })
                    posthog?.capture("playlist_song_add_failed", {
                        playlist_id: playlistId,
                        song_id: song.id,
                        error_message: msg || "unknown",
                    })
                }
            }
        },
        [addSong, posthog, song]
    )

    const handleQuickCreate = useCallback(async () => {
        if (!user?.id || !newName.trim()) return
        try {
            const created = await createPlaylist(user.id, newName.trim())
            await addSong(created.id, song)
            setFeedback({ playlistId: created.id, type: "success" })
            posthog?.capture("playlist_created_and_song_added", {
                playlist_id: created.id,
                playlist_name: created.name,
                song_id: song.id,
            })
            setNewName("")
            setShowCreate(false)
        } catch {
            posthog?.capture("playlist_quick_create_failed", {
                song_id: song.id,
            })
            /* error in store */
        }
    }, [user?.id, newName, createPlaylist, addSong, posthog, song])

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    const nextOpen = !isOpen
                    setIsOpen(nextOpen)
                    if (nextOpen) {
                        posthog?.capture("playlist_dropdown_opened", {
                            song_id: song.id,
                            dropdown_position: dropdownPosition,
                        })
                    }
                }}
                aria-label={t("addToPlaylist.title")}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
                <ListPlus size={18} />
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute right-0 z-50 w-56 rounded-xl border border-white/[0.08] bg-[#1a1a2e] py-1 shadow-2xl",
                        dropdownPosition === "top" ? "bottom-full mb-1" : "mt-1"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <p className="px-3 py-2 text-xs font-semibold tracking-wide text-white/50 uppercase">
                        {t("addToPlaylist.title")}
                    </p>

                    {/* Existing playlists */}
                    <div className="max-h-48 overflow-y-auto">
                        {playlists.length === 0 ? (
                            <p className="text-text-tertiary px-3 py-3 text-center text-xs">{t("addToPlaylist.noPlaylists")}</p>
                        ) : (
                            playlists.map((pl) => {
                                const fb = feedback?.playlistId === pl.id ? feedback.type : null
                                return (
                                    <button
                                        key={pl.id}
                                        onClick={() => handleAdd(pl.id)}
                                        disabled={fb === "success"}
                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/[0.06] disabled:opacity-60"
                                    >
                                        <span className="min-w-0 flex-1 truncate">{pl.name}</span>
                                        {fb === "success" && <Check size={14} className="text-green-400" />}
                                        {fb === "duplicate" && (
                                            <span className="text-[10px] text-amber-400">{t("addToPlaylist.alreadyAdded")}</span>
                                        )}
                                        {fb === "error" && <X size={14} className="text-red-400" />}
                                    </button>
                                )
                            })
                        )}
                    </div>

                    {/* Divider */}
                    <div className="mx-2 my-1 h-px bg-white/[0.06]" />

                    {/* Quick create */}
                    {showCreate ? (
                        <div className="flex items-center gap-2 px-3 py-2">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleQuickCreate()}
                                placeholder="Playlist name"
                                autoFocus
                                className="min-w-0 flex-1 rounded-md border border-white/[0.1] bg-white/[0.05] px-2 py-1 text-xs text-white placeholder-white/40 outline-none focus:border-white/20"
                            />
                            <button
                                onClick={handleQuickCreate}
                                disabled={!newName.trim()}
                                className="bg-accent rounded-md px-2 py-1 text-xs font-medium text-white disabled:opacity-40"
                            >
                                Add
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setShowCreate(true)
                                posthog?.capture("playlist_quick_create_opened", {
                                    song_id: song.id,
                                })
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                            <Plus size={14} />
                            {t("addToPlaylist.create")}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
