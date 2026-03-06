import { Metadata } from "next"

import { TrendingPageContent } from "@/components/TrendingPageContent/TrendingPageContent"
import en from "@/i18n/locales/en.json"

export const metadata: Metadata = {
  title: en["meta.trendingTitle"],
  description: en["meta.trendingDescription"],
}

export default function TrendingPage() {
  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-3xl">
        <TrendingPageContent />
      </div>
    </div>
  )
}
