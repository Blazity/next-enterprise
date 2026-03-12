"use client"

// SearchBar — wednesday-design: large input, green primary focus ring, DM Sans font
// wednesday-dev: handleSubmit pattern, boolean isLoading prefix

import { useState } from "react"

import { SearchIcon } from "components/icons"
import { cn } from "lib/cn"

interface SearchBarProps {
  value: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export function SearchBar({ value, isLoading, onChange, onSubmit }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSubmit(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const trimmed = value.trim()
      if (trimmed) onSubmit(trimmed)
    }
  }

  const isDisabled = isLoading || !value.trim()

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[640px]">
      <div
        className={cn(
          "border rounded-[14px] transition-all duration-200",
          isFocused ? "border-primary" : "border-border"
        )}
      >
        <div className="flex items-center gap-3 bg-surface-elevated rounded-[14px] pl-5 pr-1.5 py-1.5">
          <SearchIcon width={18} height={18} className="shrink-0 text-muted" />

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search songs, artists, or albums"
            aria-label="Search music"
            className="flex-1 bg-transparent border-0 outline-none text-white text-base"
          />

          <button
            type="submit"
            disabled={isDisabled}
            className={cn(
              "px-5 py-2.5 rounded-[10px] text-sm font-semibold shrink-0 transition-all border-0",
              isDisabled
                ? "bg-surface text-muted cursor-not-allowed"
                : "bg-gradient-btn text-white cursor-pointer"
            )}
          >
            {isLoading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>
    </form>
  )
}