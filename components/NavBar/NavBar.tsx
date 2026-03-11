"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useEffect } from "react"

import { UserButton, useUser } from "@clerk/nextjs"
import { Disc3, Home, ListMusic, Mic2, Music2, Search, Share2 } from "lucide-react"
import { usePostHog } from "posthog-js/react"

import { useFeatureFlag } from "@/hooks/useFeatureFlag"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import { usePlaylistStore } from "@/store/playlistStore"

const mainNav = [
  { href: "/", labelKey: "nav.home", Icon: Home },
  { href: "/search", labelKey: "nav.search", Icon: Search },
]

const mobileNav = [
  { href: "/", labelKey: "nav.home", Icon: Home },
  { href: "/search", labelKey: "nav.search", Icon: Search },
  { href: "/recently-added", labelKey: "nav.recentlyAdded", Icon: Disc3 },
  { href: "/artists", labelKey: "nav.artists", Icon: Mic2 },
  { href: "/songs", labelKey: "nav.songs", Icon: Music2 },
  { href: "/playlists", labelKey: "nav.playlists", Icon: ListMusic },
]

const libraryNav = [
  { href: "/recently-added", labelKey: "nav.recentlyAdded", Icon: Disc3 },
  { href: "/artists", labelKey: "nav.artists", Icon: Mic2 },
  { href: "/songs", labelKey: "nav.songs", Icon: Music2 },
  { href: "/playlists", labelKey: "nav.playlists", Icon: ListMusic },
]

export function NavBar() {
  const { t } = useTranslation()
  const { user } = useUser()
  const pathname = usePathname()
  const posthog = usePostHog()
  const playlistFeatureVariant = useFeatureFlag("playlist-add-feature")
  const playlistFeatureEnabled = playlistFeatureVariant === "on" || playlistFeatureVariant === true
  const { sharedPlaylists, fetchSharedPlaylists } = usePlaylistStore()
  const hasSharedPlaylists = sharedPlaylists.length > 0

  useEffect(() => {
    if (user?.id && !playlistFeatureEnabled) {
      fetchSharedPlaylists(user.id)
    }
  }, [user?.id, playlistFeatureEnabled, fetchSharedPlaylists])

  const captureNavClick = (href: string, section: "mobile" | "main" | "library") => {
    posthog?.capture("nav_item_clicked", {
      href,
      section,
      playlist_feature_variant: playlistFeatureVariant ?? "unknown",
    })
  }

  const playlistNavItem = playlistFeatureEnabled
    ? { href: "/playlists", labelKey: "nav.playlists", Icon: ListMusic }
    : hasSharedPlaylists
      ? { href: "/playlists", labelKey: "share.sharedWithMe", Icon: Share2 }
      : null

  const resolveNav = (items: typeof libraryNav) =>
    items.flatMap((item) => (item.href === "/playlists" ? (playlistNavItem ? [playlistNavItem] : []) : [item]))

  const filteredLibraryNav = resolveNav(libraryNav)
  const filteredMobileNav = resolveNav(mobileNav)

  return (
    <nav
      aria-label={t("nav.streamify")}
      className="bg-surface-sidebar/95 md:bg-surface-sidebar fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.06] backdrop-blur-xl md:static md:inset-x-auto md:z-auto md:w-[240px] md:shrink-0 md:border-t-0 md:border-r md:border-white/[0.06] md:backdrop-blur-none"
    >
      {/* ── Mobile bottom tab bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto px-2 py-2 md:hidden">
        {filteredMobileNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => captureNavClick(item.href, "mobile")}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-[68px] shrink-0 flex-col items-center gap-0.5 rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-accent" : "text-text-tertiary"
              )}
            >
              <item.Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{t(item.labelKey)}</span>
            </Link>
          )
        })}
        <div className="ml-auto shrink-0 pl-1">
          <UserButton />
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <div className="hidden h-full flex-col md:flex">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
          <div className="from-accent to-accent-hover flex size-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-red-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="white" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[17px] font-bold tracking-tight text-white">{t("nav.streamify")}</span>
        </div>

        {/* Main navigation */}
        <div className="space-y-0.5 px-3">
          {mainNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => captureNavClick(item.href, "main")}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive ? "bg-white/[0.08] text-white" : "text-text-secondary hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <item.Icon
                  size={20}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-accent" : "text-text-tertiary group-hover:text-white"
                  )}
                  strokeWidth={isActive ? 2.2 : 1.7}
                />
                <span>{t(item.labelKey)}</span>
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="mx-5 my-4 h-px bg-white/[0.06]" />

        {/* Library section */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-text-tertiary text-[11px] font-semibold tracking-widest uppercase">{t("nav.library")}</p>
          </div>
          <div className="space-y-0.5">
            {filteredLibraryNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => captureNavClick(item.href, "library")}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-text-secondary hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <item.Icon
                    size={20}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-accent" : "text-text-tertiary group-hover:text-white"
                    )}
                    strokeWidth={isActive ? 2.2 : 1.7}
                  />
                  <span>{t(item.labelKey)}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* User profile — pinned to bottom */}
        <div className="mt-auto border-t border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-3">
            <UserButton />
            {user?.firstName && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{user.firstName}</p>
                <p className="text-text-tertiary truncate text-[11px]">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
