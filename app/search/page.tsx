import { Metadata } from "next"

import { SearchBar } from "@/components/SearchBar/SearchBar"
import { TrendingList } from "@/components/TrendingList/TrendingList"

export const metadata: Metadata = {
  title: "Streamify — Search",
  description: "Search for songs and discover trending tracks.",
}

export default function SearchPage() {
  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-text-primary text-2xl font-bold">Search</h1>
        <SearchBar />
        <TrendingList />
      </div>
    </div>
  )
}
