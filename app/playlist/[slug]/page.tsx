import type { Metadata } from "next"

import { ComingSoon } from "@/components/ComingSoon/ComingSoon"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.playlistTitle"],
}

export default function PlaylistPage() {
  return <ComingSoon titleKey="nav.playlists" />
}
