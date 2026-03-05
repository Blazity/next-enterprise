"use client"

import { UserButton } from "@clerk/nextjs"
import { Disc3, Home, Library, Mic2, Music2, Search } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

import { SearchBar } from "@/components/SearchBar/SearchBar"
import { cn } from "@/lib/utils"

const mainNav = [
  { href: "/", labelKey: "nav.home", Icon: Home },
  { href: "/search", labelKey: "nav.search", Icon: Search },
]

const mobileNav = [
  { href: "/", labelKey: "nav.home", Icon: Home },
  { href: "/search", labelKey: "nav.search", Icon: Search },
  { href: "/recently-added", labelKey: "nav.library", Icon: Library },
]

const libraryNav = [
  { href: "/recently-added", labelKey: "nav.recentlyAdded", Icon: Disc3 },
  { href: "/artists", labelKey: "nav.artists", Icon: Mic2 },
  { href: "/songs", labelKey: "nav.songs", Icon: Music2 },
]

export function NavBar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="border-border bg-surface-sidebar/95 md:bg-surface-sidebar fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-xl md:static md:inset-x-auto md:w-56 md:shrink-0 md:border-t-0 md:border-r">
      {/* Mobile bottom nav */}
      <div className="flex items-center justify-around py-2 md:hidden">
        {mobileNav.map((item) => {
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
        <UserButton />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden h-full flex-col overflow-y-auto md:flex">
        {/* User */}
        <div className="flex items-center gap-3 px-4 pt-4">
          <UserButton />
        </div>

        {/* Search */}
        <div
          className="px-4 pt-4 pb-2"
          onFocusCapture={() => {
            if (pathname !== "/search") router.push("/search")
          }}
        >
          <SearchBar className="[&_input]:py-2 [&_input]:text-xs" />
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
          {libraryNav.map((item) => {
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
      </div>
    </nav>
  )
}
