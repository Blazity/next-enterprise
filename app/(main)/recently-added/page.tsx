import type { Metadata } from "next"

import { RecentlyAddedContent } from "@/components/RecentlyAddedContent/RecentlyAddedContent"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.recentlyAddedTitle"],
}

export default function RecentlyAddedPage() {
  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-3xl">
        <RecentlyAddedContent />
      </div>
    </div>
  )
}
