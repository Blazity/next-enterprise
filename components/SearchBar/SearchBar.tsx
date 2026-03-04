"use client"

import { Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { useMusicStore } from "@/store/musicStore"

export interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const { t } = useTranslation()
  const { searchQuery, setSearchQuery, searchItunes } = useMusicStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery)
      searchItunes(localQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery, setSearchQuery, searchItunes])

  const handleClear = () => {
    setLocalQuery("")
    setSearchQuery("")
    inputRef.current?.focus()
  }

  return (
    <div className={cn("relative w-full", className)}>
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
    </div>
  )
}
