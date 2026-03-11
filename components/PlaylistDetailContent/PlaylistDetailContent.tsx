"use client"

import { useFeatureFlag } from "@/hooks/useFeatureFlag"

import { ComingSoon } from "@/components/ComingSoon/ComingSoon"
import { PlaylistDetailView } from "@/components/PlaylistDetailView/PlaylistDetailView"

export function PlaylistDetailContent() {
    const flag = useFeatureFlag("playlist-add-feature")
    const playlistFeatureEnabled = flag === "on" || flag === true

    if (!playlistFeatureEnabled) {
        return <ComingSoon titleKey="nav.playlists" />
    }

    return <PlaylistDetailView variant="owned" />
}
