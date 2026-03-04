"use client"

// TopNav — fixed top bar inside main content area, contains search input
// wednesday-design: dark elevated surface, green focus glow on input

import { type RefObject } from "react"

interface TopNavProps {
  query: string
  isLoading: boolean
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onSearch: (value: string) => void
}

export function TopNav({ query, isLoading, inputRef, onChange, onSearch }: TopNavProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const trimmed = query.trim()
      if (trimmed) onSearch(trimmed)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <header className="h-16 shrink-0 bg-[rgba(18,18,18,0.95)] backdrop-blur-md border-b border-border flex items-center px-7 gap-4 sticky top-0 z-[15]">
      <form onSubmit={handleSubmit} className="flex-1 max-w-[480px] flex items-center">
        <div className="flex items-center gap-2.5 w-full bg-surface-elevated rounded-full px-4 py-2 border border-border">
          {isLoading ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-primary animate-spin-slow"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="shrink-0 text-muted"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to play?"
            aria-label="Search music"
            className="flex-1 bg-transparent border-0 outline-none text-white text-sm"
          />

          {query && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="bg-transparent border-0 cursor-pointer text-muted hover:text-white flex items-center shrink-0 p-0 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </form>

      <span className="text-xs text-muted ml-auto">30s previews via iTunes</span>
    </header>
  )
}
