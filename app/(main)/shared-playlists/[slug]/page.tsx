import type { Metadata } from "next"

import { SharedPlaylistDetailContent } from "@/components/SharedPlaylistDetailContent/SharedPlaylistDetailContent"

export const metadata: Metadata = {
  title: "Streamify — Shared Playlist",
}

export default function SharedPlaylistDetailPage() {
  return <SharedPlaylistDetailContent />
}
