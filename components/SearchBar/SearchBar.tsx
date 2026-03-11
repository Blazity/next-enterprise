"use client"

import { Search as SearchIcon, X } from "lucide-react"
import { useCallback, useRef, useState } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear?: () => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, onClear, isLoading = false }: SearchBarProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        if (newValue.trim().length > 0) {
          onSearch(newValue.trim())
        }
      }, 300)
    },
    [onSearch]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (value.trim().length > 0) {
        onSearch(value.trim())
      }
    },
    [onSearch, value]
  )

  const handleClear = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    setValue("")
    if (onClear) onClear()
    inputRef.current?.focus()
  }, [onClear])

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl" id="search-form">
      <div className="relative">
        {/* Search Icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <SearchIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        </div>

        <input
          id="search-input"
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          className="focus:ring-aura-primary w-full rounded-full border border-slate-700/50 bg-slate-800/50 py-3 pr-12 pl-12 text-white placeholder-gray-400 shadow-lg backdrop-blur-sm transition-all hover:bg-slate-800/80 focus:bg-slate-800 focus:ring-2 focus:outline-none"
          placeholder="Search for tracks, artists, or albums..."
          autoComplete="off"
          spellCheck={false}
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          {isLoading ? (
            <div
              className="border-t-aura-primary h-5 w-5 animate-spin rounded-full border-2 border-zinc-600"
              role="status"
              aria-label="Loading"
            />
          ) : value.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </form>
  )
}
