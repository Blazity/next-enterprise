"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect } from "react"

import { useUser } from "@clerk/nextjs"
import { ArrowLeft, Clock, ListMusic, Music, Share2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { useMusicStore } from "@/store/musicStore"
import { usePlaylistStore } from "@/store/playlistStore"
import { PLAY_STATE } from "@/types/music"

export function SharedPlaylistDetailContent() {
    const { t } = useTranslation()
    const { slug } = useParams<{ slug: string }>()
    const playlistId = Number(slug)
    const { user } = useUser()

    const { currentPlaylist, isLoading, error, fetchPlaylist } = usePlaylistStore()
    const { currentlyPlaying, playState, setPlayingTrack, togglePlay } = useMusicStore()

    useEffect(() => {
        if (playlistId && user?.id) fetchPlaylist(playlistId, user.id)
    }, [playlistId, user?.id, fetchPlaylist])

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
                    href="/shared-playlists"
                    className="text-text-tertiary hover:text-white mb-6 inline-flex items-center gap-2 text-sm transition-colors"
                >
                    <ArrowLeft size={16} />
                    {t("share.sharedWithMe")}
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
            <Link
                href="/shared-playlists"
                className="text-text-tertiary hover:text-white mb-6 inline-flex items-center gap-2 text-sm transition-colors"
            >
                <ArrowLeft size={16} />
                {t("share.sharedWithMe")}
            </Link>

            {/* Playlist header */}
            <div className="mb-8 flex items-start gap-5">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-500/10 shadow-lg shadow-blue-500/10">
                    <Share2 size={36} className="text-blue-400" />
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

            {/* Shared indicator */}
            <p className="text-text-tertiary mb-6 flex items-center gap-2 text-xs">
                <Share2 size={14} className="text-blue-400" />
                {t("share.sharedPlaylist")}
            </p>

            {/* Song list */}
            {songs.length === 0 ? (
                <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/[0.04]">
                        <Music size={28} className="text-white/20" />
                    </div>
                    <p className="text-lg font-medium text-white/60">{t("playlist.emptySongs")}</p>
                </div>
            ) : (
                <div className="bg-surface-elevated overflow-hidden rounded-xl">
                    {songs.map((song, index) => {
                        const isPlaying = currentlyPlaying?.id === song.track_id && playState === PLAY_STATE.PLAYING
                        return (
                            <div
                                key={song.id}
                                className={cn(
                                    "group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04]",
                                    index < songs.length - 1 && "border-b border-white/[0.06]"
                                )}
                            >
                                <span
                                    className={cn(
                                        "w-5 text-center text-sm tabular-nums",
                                        isPlaying ? "text-accent font-bold" : "text-text-tertiary"
                                    )}
                                >
                                    {index + 1}
                                </span>

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

                                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handlePlaySong(song)}>
                                    <p className={cn("truncate text-[13px] font-medium", isPlaying ? "text-accent" : "text-text-primary")}>
                                        {song.title}
                                    </p>
                                    <p className="text-text-tertiary truncate text-xs">{song.artist_name}</p>
                                </div>

                                {song.duration != null && (
                                    <span className="text-text-tertiary flex items-center gap-1 text-xs tabular-nums">
                                        <Clock size={12} />
                                        {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
