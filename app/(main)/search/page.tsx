"use client"

import { RecentSongs } from "@/components/RecentSongs/RecentSongs"
import { SearchBar } from "@/components/SearchBar/SearchBar"
import { TrendingList } from "@/components/TrendingList/TrendingList"
import en from "@/i18n/locales/en.json"

export default function SearchPage() {
  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-text-primary text-2xl font-bold">{en["search.pageTitle"]}</h1>
        <SearchBar />
        <RecentSongs />
        <TrendingList />
      </div>
    </div>
  )
}

