import type { Metadata } from "next"

import { PlaylistDetailContent } from "@/components/PlaylistDetailContent/PlaylistDetailContent"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.playlistTitle"],
}

export default function PlaylistPage() {
  return <PlaylistDetailContent />
}
