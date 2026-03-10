"use client"

import { useFeatureFlag } from "@/hooks/useFeatureFlag"

import { ComingSoon } from "@/components/ComingSoon/ComingSoon"
import { PlaylistDetailView } from "@/components/PlaylistDetailView/PlaylistDetailView"

export function PlaylistDetailContent() {
    const playlistFeatureEnabled = useFeatureFlag("playlist-add-feature") === "on"

    if (!playlistFeatureEnabled) {
        return <ComingSoon titleKey="nav.playlists" />
    }

    return <PlaylistDetailView variant="owned" />
}
