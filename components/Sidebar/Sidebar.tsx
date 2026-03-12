"use client"

// Sidebar — collapsible left nav, Spotify-style
// wednesday-design: dark surface (#111111), green active indicator, DM Sans
// wednesday-dev: NavItem extracted, active boolean prefix

import { useEffect, useState } from "react"
import { useFeatureFlagEnabled } from "posthog-js/react"

import {
  AlbumIcon,
  ArtistIcon,
  ChevronLeftIcon,
  DiscoverLogoIcon,
  HomeIcon,
  LinkIcon,
  MusicNoteIcon,
  PlaylistIcon,
  UsersIcon
} from "components/icons"
import { AuthButton } from "components/AuthButton/AuthButton"
import { ThemeToggle } from "components/ThemeToggle/ThemeToggle"
import { cn } from "lib/cn"
import type { ActiveView } from "lib/constants"
import { usePlaylistStore } from "store/usePlaylistStore"

interface SidebarProps {
  activeView: ActiveView
  onNavClick: (view: ActiveView) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onSharedPlaylistClick?: (id: string) => void
  selectedPlaylistId?: string | null
  isOpen?: boolean
  onClose?: () => void
}

interface NavItemProps {
  label: string
  isActive: boolean
  isCollapsed: boolean
  icon: React.ReactNode
  onClick: () => void
}

function NavItem({ label, isActive, isCollapsed, icon, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3.5 w-full bg-transparent border-0 rounded-lg cursor-pointer text-sm text-left relative transition-all duration-200",
        isCollapsed ? "px-0 py-3 justify-center" : "px-4 py-3.5",
        isActive ? "text-primary font-bold bg-primary/5" : "text-primary font-medium hover:bg-surface-hover"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-primary" />
      )}
      <span className="shrink-0 text-primary">{icon}</span>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  )
}

export function Sidebar({
  activeView,
  onNavClick,
  isCollapsed,
  onToggleCollapse,
  onSharedPlaylistClick,
  selectedPlaylistId,
  isOpen,
  onClose
}: SidebarProps) {
  const { playlists, sharedPlaylists } = usePlaylistStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const isPlaylistEnabled = (useFeatureFlagEnabled("playlist-feature") && mounted) ?? false


  const navItems: { label: string; view: ActiveView; icon: React.ReactNode }[] = [
    { label: "Home", view: "home", icon: <HomeIcon /> },
    { label: "Songs", view: "songs", icon: <MusicNoteIcon /> },
    ...(isPlaylistEnabled ? [{ label: "Playlists", view: "playlists" as ActiveView, icon: <PlaylistIcon /> }] : []),
    { label: "Albums", view: "albums", icon: <AlbumIcon /> },
    { label: "Artists", view: "artists", icon: <ArtistIcon /> },
  ]

  return (
    <aside
      className={cn(
        "shrink-0 bg-surface flex flex-col pt-8 pb-10 px-4 overflow-y-auto overflow-x-hidden transition-[width,transform] duration-300 ease-out z-[100] border-r border-border/50",
        isCollapsed ? "w-[80px]" : "w-[280px]",
        // Mobile behavior
        "fixed md:relative inset-y-0 left-0 -translate-x-full md:translate-x-0 shadow-2xl md:shadow-none",
        isOpen && "translate-x-0"
      )}
    >
      {/* Logo + collapse toggle */}
      <div className={cn(
        "flex items-center pb-8 pt-2 transition-all duration-300",
        isCollapsed ? "px-0 justify-center" : "px-3 gap-3"
      )}>
        <div className="size-[36px] rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 shadow-glow-sm">
          <DiscoverLogoIcon className="text-bg" width={22} height={22} />
        </div>
        {!isCollapsed && (
          <span className="text-[15px] font-bold text-primary truncate">Sonara</span>
        )}
        {!isCollapsed && <div className="flex-1" />}

        {/* Mobile close button / Desktop collapse toggle */}
        <button
          onClick={() => {
            if (onClose && window.innerWidth < 768) {
              onClose()
            } else {
              onToggleCollapse()
            }
          }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "size-8 md:size-6 rounded-md bg-surface-elevated md:bg-transparent border-0 cursor-pointer flex items-center justify-center text-muted hover:text-primary transition-all duration-300 shrink-0",
            isCollapsed && "mt-4"
          )}
        >
          <ChevronLeftIcon
            width={14}
            height={14}
            className={cn("transition-transform duration-300", isCollapsed && "rotate-180", onClose ? "hidden md:flex" : "flex")}
          />
          {onClose && (
            <span className="md:hidden">
              <ChevronLeftIcon width={16} height={16} />
            </span>
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-1.5 mt-4">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            label={item.label}
            isActive={activeView === item.view}
            isCollapsed={isCollapsed}
            icon={item.icon}
            onClick={() => onNavClick(item.view)}
          />
        ))}

        {/* Unified Playlists section */}
        {isPlaylistEnabled && (playlists.length > 0 || sharedPlaylists.length > 0) && (
          <div className="mt-8">
            {!isCollapsed && (
              <p className="px-4 text-[10px] font-bold text-primary uppercase tracking-[0.12em] mb-2">
                Your Library
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {[...playlists, ...sharedPlaylists].slice(0, 10).map((p) => {
                const isShared = 'sharedBy' in p && !!p.sharedBy
                const isActive = activeView === "playlists" && selectedPlaylistId === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => onSharedPlaylistClick?.(p.id)}
                    title={isCollapsed ? (isShared ? `${p.name} (from ${p.sharedBy})` : p.name) : undefined}
                    className={cn(
                      "flex items-center gap-3.5 w-full bg-transparent border-0 rounded-lg cursor-pointer text-sm text-left relative transition-all duration-200",
                      isCollapsed ? "px-0 py-2.5 justify-center" : "px-4 py-2.5",
                      isActive
                        ? "text-primary font-bold bg-surface-elevated"
                        : "text-primary font-normal hover:bg-surface-hover"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-primary" />
                    )}
                    <PlaylistIcon className="shrink-0 size-4 text-primary" />
                    {!isCollapsed && (
                      <div className="min-w-0 flex-1">
                        <p className="truncate m-0">{p.name}</p>
                        {isShared && (
                          <p className="text-[10px] text-primary/80 truncate m-0 font-normal flex items-center gap-1">
                            from {p.sharedBy}
                            {p.shareType === "private" ? (
                              <UsersIcon width={9} height={9} className="opacity-60" />
                            ) : (
                              <LinkIcon width={9} height={9} className="opacity-60" />
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}

              {!isCollapsed && (playlists.length + sharedPlaylists.length) > 10 && (
                <button
                  onClick={() => onNavClick("playlists")}
                  className="mx-4 mt-1 text-[11px] font-bold text-primary hover:underline transition-all border-0 bg-transparent cursor-pointer text-left w-fit"
                >
                  View all ({playlists.length + sharedPlaylists.length})
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to push Auth/Theme toggles to the bottom */}
      <div className="flex-1 min-h-[60px]" />

      {/* Footer controls */}
      <div className={cn(
        "flex items-center pt-6 pb-2 shrink-0 transition-all border-t border-border/50 mt-auto",
        isCollapsed ? "flex-col gap-4 px-0 justify-center" : "flex-row px-3 gap-3 justify-between"
      )}>
        <div className={cn("flex shrink-0", !isCollapsed && "flex-1")}>
          <AuthButton isCollapsed={isCollapsed} />
        </div>
        <ThemeToggle />
      </div>
    </aside>
  )
}
