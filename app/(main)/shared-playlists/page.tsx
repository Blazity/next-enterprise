import type { Metadata } from "next"

import { SharedPlaylistsPageContent } from "@/components/SharedPlaylistsPageContent/SharedPlaylistsPageContent"

export const metadata: Metadata = {
  title: "Streamify — Shared with Me",
}

export default function SharedPlaylistsPage() {
  return <SharedPlaylistsPageContent />
}
