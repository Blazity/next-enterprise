import type { Metadata } from "next"

import { PlaylistsPageContent } from "@/components/PlaylistsPageContent/PlaylistsPageContent"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.playlistTitle"],
}

export default function PlaylistsPage() {
  return <PlaylistsPageContent />
}
