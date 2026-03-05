import type { Metadata } from "next"

import { ComingSoon } from "@/components/ComingSoon/ComingSoon"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.recentlyAddedTitle"],
}

export default function RecentlyAddedPage() {
  return <ComingSoon titleKey="nav.recentlyAdded" />
}
