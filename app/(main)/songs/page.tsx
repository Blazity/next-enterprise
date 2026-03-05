import type { Metadata } from "next"

import { ComingSoon } from "@/components/ComingSoon/ComingSoon"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.songsTitle"],
}

export default function SongsPage() {
  return <ComingSoon titleKey="nav.songs" />
}
