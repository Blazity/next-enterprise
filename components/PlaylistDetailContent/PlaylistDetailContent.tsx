"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { useUser } from "@clerk/nextjs"
import { ArrowLeft, Clock, ListMusic, Music, Search, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { useMusicStore } from "@/store/musicStore"
import { usePlaylistStore } from "@/store/playlistStore"
import { PLAY_STATE } from "@/types/music"

export function PlaylistDetailContent() {
    const { t } = useTranslation()
    const { slug } = useParams<{ slug: string }>()
    const playlistId = Number(slug)
    const { user } = useUser()

    const { currentPlaylist, isLoading, error, fetchPlaylist, removeSong } = usePlaylistStore()
    const { currentlyPlaying, playState, setPlayingTrack, togglePlay } = useMusicStore()

    const [removingTrackId, setRemovingTrackId] = useState<string | null>(null)

    useEffect(() => {
        if (playlistId) fetchPlaylist(playlistId)
    }, [playlistId, fetchPlaylist])

    const handleRemove = useCallback(
        async (trackId: string) => {
            setRemovingTrackId(trackId)
            try {
                await removeSong(playlistId, trackId)
            } finally {
                setRemovingTrackId(null)
            }
        },
        [playlistId, removeSong]
    )

    const handlePlaySong = useCallback(
        (song: NonNullable<typeof currentPlaylist>["songs"] extends (infer S)[] | undefined ? S : never) => {
            if (!song) return
            const mapped = {
                id: song.track_id,
                title: song.title,
                artist: { id: song.artist_name, name: song.artist_name },
                albumArt: song.album_art || "/placeholder.png",
                duration: song.duration || 0,
                previewUrl: song.preview_url || undefined,
                collectionName: song.collection_name || undefined,
            }
            if (currentlyPlaying?.id === mapped.id) {
                togglePlay()
            } else {
                setPlayingTrack(mapped)
            }
        },
        [currentlyPlaying, togglePlay, setPlayingTrack]
    )

    if (isLoading && !currentPlaylist) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="border-accent size-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
        )
    }

    if (error || !currentPlaylist) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
                <Link
                    href="/playlists"
                    className="text-text-tertiary hover:text-white mb-6 inline-flex items-center gap-2 text-sm transition-colors"
                >
                    <ArrowLeft size={16} />
                    {t("playlist.back")}
                </Link>
                <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
                    <ListMusic size={48} className="mb-4 text-white/20" />
                    <p className="text-lg font-medium text-white/60">{error || t("playlist.notFound")}</p>
                </div>
            </div>
        )
    }

    const songs = currentPlaylist.songs || []

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
            {/* Back link */}
            <Link
                href="/playlists"
                className="text-text-tertiary hover:text-white mb-6 inline-flex items-center gap-2 text-sm transition-colors"
            >
                <ArrowLeft size={16} />
                {t("playlist.back")}
            </Link>

            {/* Playlist header */}
            <div className="mb-8 flex items-start gap-5">
                <div className="from-accent/30 to-accent/10 flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg shadow-red-500/10">
                    <ListMusic size={36} className="text-accent" />
                </div>
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-white">{currentPlaylist.name}</h1>
                    {currentPlaylist.description && (
                        <p className="text-text-tertiary mt-1 text-sm">{currentPlaylist.description}</p>
                    )}
                    <p className="text-text-tertiary mt-2 text-xs">
                        {t("playlist.songs", { count: songs.length })}
                    </p>
                </div>
            </div>

            {/* Song list */}
            {songs.length === 0 ? (
                <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/[0.04]">
                        <Music size={28} className="text-white/20" />
                    </div>
                    <p className="text-lg font-medium text-white/60">{t("playlist.emptySongs")}</p>
                    <p className="text-text-tertiary mt-1 max-w-xs text-sm">{t("playlist.emptyHint")}</p>
                    <Link
                        href="/search"
                        className="bg-accent hover:bg-accent-hover mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors"
                    >
                        <Search size={16} />
                        {t("nav.search")}
                    </Link>
                </div>
            ) : (
                <div className="bg-surface-elevated overflow-hidden rounded-xl">
                    {songs.map((song, index) => {
                        const isPlaying = currentlyPlaying?.id === song.track_id && playState === PLAY_STATE.PLAYING
                        const isRemoving = removingTrackId === song.track_id
                        return (
                            <div
                                key={song.id}
                                className={cn(
                                    "group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04]",
                                    index < songs.length - 1 && "border-b border-white/[0.06]",
                                    isRemoving && "pointer-events-none opacity-40"
                                )}
                            >
                                {/* Position */}
                                <span
                                    className={cn(
                                        "w-5 text-center text-sm tabular-nums",
                                        isPlaying ? "text-accent font-bold" : "text-text-tertiary"
                                    )}
                                >
                                    {index + 1}
                                </span>

                                {/* Album art */}
                                <button
                                    onClick={() => handlePlaySong(song)}
                                    className="relative size-11 shrink-0 overflow-hidden rounded-lg"
                                >
                                    {song.album_art ? (
                                        <Image
                                            src={song.album_art}
                                            alt={`${song.title} album art`}
                                            fill
                                            className="object-cover"
                                            sizes="44px"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center bg-white/[0.06]">
                                            <Music size={18} className="text-white/30" />
                                        </div>
                                    )}
                                    {isPlaying && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <div className="flex items-end gap-[2px]">
                                                <span className="animate-eq-1 bg-accent inline-block w-[3px] rounded-full" />
                                                <span className="animate-eq-2 bg-accent inline-block w-[3px] rounded-full" />
                                                <span className="animate-eq-3 bg-accent inline-block w-[3px] rounded-full" />
                                            </div>
                                        </div>
                                    )}
                                </button>

                                {/* Song info */}
                                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handlePlaySong(song)}>
                                    <p className={cn("truncate text-[13px] font-medium", isPlaying ? "text-accent" : "text-text-primary")}>
                                        {song.title}
                                    </p>
                                    <p className="text-text-tertiary truncate text-xs">{song.artist_name}</p>
                                </div>

                                {/* Duration */}
                                {song.duration != null && (
                                    <span className="text-text-tertiary flex items-center gap-1 text-xs tabular-nums">
                                        <Clock size={12} />
                                        {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}
                                    </span>
                                )}

                                {/* Remove button */}
                                <button
                                    onClick={() => handleRemove(song.track_id)}
                                    disabled={isRemoving}
                                    aria-label={t("playlist.removeSong")}
                                    className="rounded-lg p-2 text-white/30 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
