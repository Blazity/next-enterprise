import type { Metadata } from "next"

import { GenresPageContent } from "@/components/GenresPageContent/GenresPageContent"

export const metadata: Metadata = {
  title: "Streamify — Genres",
  description: "Browse music by genre and discover new tracks.",
}

export default function GenresPage() {
  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-5xl">
        <GenresPageContent />
      </div>
    </div>
  )
}
