import type { Metadata } from "next"

import { SongsPageContent } from "@/components/SongsPageContent/SongsPageContent"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.songsTitle"],
}

export default function SongsPage() {
  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-4xl">
        <SongsPageContent />
      </div>
    </div>
  )
}
