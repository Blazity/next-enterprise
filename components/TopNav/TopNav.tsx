"use client"

// TopNav — fixed top bar inside main content area, contains search input
// wednesday-design: dark elevated surface, amber focus glow on input

import { type RefObject } from "react"

import { AuthButton } from "components/AuthButton/AuthButton"
import { CloseIcon, MenuIcon, SearchIcon } from "components/icons"
import { useTypingPlaceholder } from "lib/hooks/useTypingPlaceholder"

interface TopNavProps {
  query: string
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onMenuClick?: () => void
}

export function TopNav({ query, inputRef, onChange, onMenuClick }: TopNavProps) {
  const typingPlaceholder = useTypingPlaceholder()

  return (
    <header className="h-16 shrink-0 bg-[rgba(18,18,18,0.95)] backdrop-blur-md border-b border-border flex items-center px-4 md:px-8 gap-4 sticky top-0 z-[15]">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="md:hidden size-10 rounded-full flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-all border-0 bg-transparent cursor-pointer"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      )}
      <div className="flex-1 max-w-[480px] flex items-center">
        <div className="flex items-center gap-2.5 w-full bg-surface-elevated rounded-full px-4 py-2 border border-border">
          <SearchIcon className="shrink-0 text-muted" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder={typingPlaceholder || "What do you want to play?"}
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
      </div>

      <div className="ml-auto flex items-center gap-3">
         <AuthButton />
      </div>
    </header>
  )
}
