"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "components/icons"
import { cn } from "lib/cn"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="size-10" />

  const isDark = resolvedTheme === "dark" || theme === "dark"

  return (
    <button
      onClick={() => setTheme(theme === "dark" || resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "size-10 rounded-full flex items-center justify-center text-primary/80 hover:text-primary hover:bg-surface-hover transition-all border-0 bg-transparent cursor-pointer"
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon width={20} height={20} />
      ) : (
        <MoonIcon width={20} height={20} />
      )}
    </button>
  )
}
