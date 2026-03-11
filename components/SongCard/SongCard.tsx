"use client"

import Image from "next/image"

import { cva, type VariantProps } from "class-variance-authority"
import { usePostHog } from "posthog-js/react"

import { useFeatureFlag } from "@/hooks/useFeatureFlag"
import { useTranslation } from "react-i18next"

import { AddToPlaylistButton } from "@/components/AddToPlaylistButton/AddToPlaylistButton"
import { PlayButton } from "@/components/PlayButton/PlayButton"
import { cn } from "@/lib/utils"
import type { Song } from "@/types/music"

const songCard = cva(["group", "relative", "transition-all", "duration-200"], {
  variants: {
    variant: {
      featured: ["flex", "flex-col", "cursor-pointer"],
      trending: [
        "flex",
        "flex-row",
        "items-center",
        "gap-3",
        "rounded-xl",
        "px-3",
        "py-2.5",
        "cursor-pointer",
        "w-full",
        "hover:bg-surface-hover",
      ],
    },
  },
  defaultVariants: {
    variant: "featured",
  },
})

export interface SongCardProps extends VariantProps<typeof songCard> {
  song: Song
  isPlaying?: boolean
  onPlay?: () => void
  className?: string
  rank?: number
  subtitle?: string
  showAddToPlaylist?: boolean
}

function EqBars() {
  return (
    <div className="flex items-end gap-[2px]">
      <span className="animate-eq-1 bg-accent inline-block w-[3px] rounded-full" />
      <span className="animate-eq-2 bg-accent inline-block w-[3px] rounded-full" />
      <span className="animate-eq-3 bg-accent inline-block w-[3px] rounded-full" />
    </div>
  )
}

export function SongCard({ song, isPlaying = false, onPlay, variant, className, rank, subtitle, showAddToPlaylist = false }: SongCardProps) {
  const { t } = useTranslation()
  const posthog = usePostHog()
  const playlistFeatureVariant = useFeatureFlag("playlist-add-feature")
  const playlistFeatureEnabled = playlistFeatureVariant === "on" || playlistFeatureVariant === true
  const canShowPlaylist = showAddToPlaylist && playlistFeatureEnabled

  const handlePlayAction = (source: "card" | "button" | "keyboard") => {
    posthog?.capture("song_play_interaction", {
      song_id: song.id,
      artist_name: song.artist.name,
      card_variant: variant ?? "featured",
      source,
      was_playing: isPlaying,
    })
    onPlay?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handlePlayAction("keyboard")
    }
  }
  const songLabel = t("songCard.playSong", { title: song.title, artist: song.artist.name })

  if (variant === "trending") {
    return (
      <div
        className={cn(songCard({ variant }), className)}
        onClick={() => handlePlayAction("card")}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={songLabel}
      >
        {rank != null && (
          <span
            className={cn(
              "w-5 text-center text-sm tabular-nums",
              isPlaying ? "text-accent font-bold" : "text-text-tertiary"
            )}
          >
            {rank}
          </span>
        )}
        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg">
          <Image src={song.albumArt} alt={`${song.title} album art`} fill className="object-cover" sizes="44px" />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <EqBars />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-[13px] font-medium", isPlaying ? "text-accent" : "text-text-primary")}>
            {song.title}
          </p>
          <p className="text-text-tertiary truncate text-xs">{song.artist.name}</p>
        </div>
        <span className="text-text-tertiary text-xs tabular-nums">
          {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          {canShowPlaylist && <AddToPlaylistButton song={song} />}
          <PlayButton isPlaying={isPlaying} onToggle={() => handlePlayAction("button")} size="sm" />
        </div>
      </div>
    )
  }

  // Featured variant — large Apple Music style card
  return (
    <div
      className={cn(songCard({ variant }), "w-full", className)}
      onClick={() => handlePlayAction("card")}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={songLabel}
    >
      <div className="relative aspect-square w-full">
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <Image
            src={song.albumArt}
            alt={`${song.title} album art`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
          {/* Bottom gradient with text overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 pt-16">
            <p className="text-lg font-bold text-white drop-shadow-lg">{song.title}</p>
            <p className="text-sm text-white/70">{song.artist.name}</p>
            {subtitle && <p className="mt-0.5 text-xs text-white/50">{subtitle}</p>}
          </div>
        </div>
        {/* Play button on hover */}
        <div
          className="absolute right-3 bottom-3 z-10 flex items-center gap-2 opacity-100 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          {canShowPlaylist && <AddToPlaylistButton song={song} dropdownPosition="top" />}
          <PlayButton isPlaying={isPlaying} onToggle={() => handlePlayAction("button")} size="md" />
        </div>
        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute bottom-20 left-4 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1">
            <EqBars />
            <span className="text-accent text-[11px] font-medium">{t("songCard.playing")}</span>
          </div>
        )}
      </div>
    </div>
  )
}
