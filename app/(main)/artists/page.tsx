import type { Metadata } from "next"

import { ArtistsPageContent } from "@/components/ArtistsPageContent/ArtistsPageContent"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.artistsTitle"],
}

export default function ArtistsPage() {
  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-3xl">
        <ArtistsPageContent />
      </div>
    </div>
  )
}
