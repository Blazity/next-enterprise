"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useUser } from "@clerk/nextjs"
import { Clock, Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { useMusicStore } from "@/store/musicStore"

export interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const { t } = useTranslation()
  const { user } = useUser()
  const {
    searchQuery,
    setSearchQuery,
    searchItunes,
    searchHistory,
    fetchSearchHistory,
    saveSearchToHistory,
  } = useMusicStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const clerkId = user?.id

  // Fetch search history on mount when user is available
  useEffect(() => {
    if (clerkId) {
      fetchSearchHistory(clerkId)
    }
  }, [clerkId, fetchSearchHistory])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery)
      searchItunes(localQuery)

      // Save to search history if query is meaningful
      if (localQuery.trim().length >= 2 && clerkId) {
        saveSearchToHistory(clerkId, localQuery.trim())
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery, setSearchQuery, searchItunes, clerkId, saveSearchToHistory])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClear = () => {
    setLocalQuery("")
    setSearchQuery("")
    inputRef.current?.focus()
  }

  const handleRecentClick = useCallback(
    (query: string) => {
      setLocalQuery(query)
      setIsFocused(false)
      inputRef.current?.focus()
    },
    [setLocalQuery]
  )

  // Show recent searches when focused, no query typed, and history exists
  const showRecent = isFocused && !localQuery.trim() && searchHistory.length > 0

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <label htmlFor="search-input" className="sr-only">
        {t("search.label")}
      </label>
      <Search className="text-text-tertiary absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
      <input
        ref={inputRef}
        id="search-input"
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={t("search.placeholder")}
        className="bg-surface-elevated text-text-primary placeholder-text-tertiary ring-accent/50 hover:bg-surface-hover focus:bg-surface-hover w-full rounded-xl py-3 pr-10 pl-10 text-sm transition-all outline-none focus:ring-2"
      />
      {localQuery && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t("search.clear")}
          className="text-text-tertiary absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>
      )}

      {/* Recent Searches Dropdown */}
      {showRecent && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1a2e]/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 px-4 pt-3 pb-2">
            <Clock size={14} className="text-white/40" />
            <span className="text-xs font-medium tracking-wide text-white/40 uppercase">
              Recent Searches
            </span>
          </div>
          <ul className="py-1">
            {searchHistory.map((query, i) => (
              <li key={`${query}-${i}`}>
                <button
                  type="button"
                  onClick={() => handleRecentClick(query)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <Search size={14} className="shrink-0 text-white/30" />
                  <span className="truncate">{query}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
