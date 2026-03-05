"use client"

// TopNav — fixed top bar inside main content area, contains search input
// wednesday-design: dark elevated surface, green focus glow on input

import { type RefObject } from "react"

import { AuthButton } from "components/AuthButton/AuthButton"
import { CloseIcon, SearchIcon, SpinnerIcon } from "components/icons"

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
            <SpinnerIcon className="shrink-0 text-primary animate-spin-slow" />
          ) : (
            <SearchIcon className="shrink-0 text-muted" />
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
              <CloseIcon width={14} height={14} />
            </button>
          )}
        </div>
      </form>

      <div className="ml-auto flex items-center gap-3">
         <AuthButton />
      </div>
    </header>
  )
}
