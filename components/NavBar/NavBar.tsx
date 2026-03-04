"use client"

import { Disc3, Home, ListMusic, Mic2, Music2, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

const mainNav = [
  { href: "/", labelKey: "nav.home", Icon: Home },
  { href: "/search", labelKey: "nav.search", Icon: Search },
]

const libraryNav = [
  { href: "#", labelKey: "nav.recentlyAdded", Icon: Disc3 },
  { href: "#", labelKey: "nav.artists", Icon: Mic2 },
  { href: "#", labelKey: "nav.songs", Icon: Music2 },
]

const playlists = [
  "nav.playlist.chillVibes",
  "nav.playlist.workoutMix",
  "nav.playlist.lateNight",
  "nav.playlist.roadTrip",
  "nav.playlist.focusFlow",
]

export function NavBar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <nav className="border-border bg-surface-sidebar/95 md:bg-surface-sidebar fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-xl md:static md:inset-x-auto md:w-56 md:shrink-0 md:border-t-0 md:border-r">
      {/* Mobile bottom nav */}
      <div className="flex items-center justify-around py-2 md:hidden">
        {mainNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1 text-[10px] font-medium",
                isActive ? "text-accent" : "text-text-tertiary"
              )}
            >
              <item.Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden h-full flex-col overflow-y-auto md:flex">
        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <Link
            href="/search"
            className="bg-surface-elevated text-text-tertiary hover:bg-surface-hover flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          >
            <Search size={14} />
            <span>{t("nav.search")}</span>
          </Link>
        </div>

        {/* Streamify section */}
        <div className="px-2 pt-3">
          <p className="text-text-tertiary mb-1 px-3 text-[11px] font-semibold tracking-wider uppercase">
            {t("nav.streamify")}
          </p>
          {mainNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"
                )}
              >
                <item.Icon size={18} className={isActive ? "text-accent" : ""} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{t(item.labelKey)}</span>
              </Link>
            )
          })}
        </div>

        {/* Library section */}
        <div className="px-2 pt-5">
          <p className="text-text-tertiary mb-1 px-3 text-[11px] font-semibold tracking-wider uppercase">
            {t("nav.library")}
          </p>
          {libraryNav.map((item) => (
            <Link
              key={item.labelKey}
              href={item.href}
              className="text-text-secondary flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-white/5 hover:text-white"
            >
              <item.Icon size={18} strokeWidth={1.8} />
              <span>{t(item.labelKey)}</span>
            </Link>
          ))}
        </div>

        {/* Playlists section */}
        <div className="px-2 pt-5">
          <p className="text-text-tertiary mb-1 px-3 text-[11px] font-semibold tracking-wider uppercase">
            {t("nav.playlists")}
          </p>
          {playlists.map((key) => (
            <Link
              key={key}
              href="#"
              className="text-text-secondary flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors hover:bg-white/5 hover:text-white"
            >
              <ListMusic size={16} strokeWidth={1.8} className="text-text-tertiary shrink-0" />
              <span className="truncate">{t(key)}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
