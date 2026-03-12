"use client"

import { useEffect, useRef, useState } from "react"

import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
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
    fetchSearchHistory,
  } = useMusicStore()

  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const clerkId = user?.id

  // Fetch recent songs on mount
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
      {/* Animated glow ring */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(252, 60, 68, 0.3), 0 0 20px -5px rgba(252, 60, 68, 0.15)"
            : "0 0 0 0px rgba(252, 60, 68, 0), 0 0 0px 0px rgba(252, 60, 68, 0)",
        }}
        transition={{ duration: 0.3 }}
        className="rounded-xl"
      >
        <Search className={cn(
          "absolute top-1/2 left-3.5 size-4 -translate-y-1/2 transition-colors duration-200",
          isFocused ? "text-accent" : "text-text-tertiary"
        )} />
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t("search.placeholder")}
          className="bg-surface-elevated text-text-primary placeholder-text-tertiary hover:bg-surface-hover focus:bg-surface-hover w-full rounded-xl py-3 pr-10 pl-10 text-sm transition-all duration-200 outline-none"
        />
      </motion.div>
      {localQuery && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t("search.clear")}
          className="text-text-tertiary absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
