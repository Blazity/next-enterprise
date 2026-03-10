"use client"

// Sidebar — collapsible left nav, Spotify-style
// wednesday-design: dark surface (#111111), green active indicator, DM Sans
// wednesday-dev: NavItem extracted, active boolean prefix

import { AlbumIcon, ArtistIcon, ChevronLeftIcon, DiscoverLogoIcon, HomeIcon, MusicNoteIcon, PlaylistIcon, SearchIcon } from "components/icons"
import { cn } from "lib/cn"
import type { ActiveView } from "lib/constants"
import { useFeatureFlagEnabled } from "posthog-js/react"

interface SidebarProps {
  activeView: ActiveView
  onNavClick: (view: ActiveView) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
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
        isCollapsed ? "px-0 py-2.5 justify-center" : "px-4 py-2.5",
        isActive ? "text-white font-bold" : "text-muted font-normal hover:text-white"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-primary" />
      )}
      <span className={cn("shrink-0", isActive ? "opacity-100" : "opacity-70")}>{icon}</span>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  )
}

export function Sidebar({ activeView, onNavClick, isCollapsed, onToggleCollapse }: SidebarProps) {
  const isPlaylistEnabled = useFeatureFlagEnabled("playlist-feature") ?? false

  const navItems: { label: string; view: ActiveView; icon: React.ReactNode }[] = [
    { label: "Home", view: "home", icon: <HomeIcon /> },
    { label: "Search", view: "search", icon: <SearchIcon width={20} height={20} /> },
    { label: "Songs", view: "songs", icon: <MusicNoteIcon /> },
    ...(isPlaylistEnabled ? [{ label: "Playlists", view: "playlists" as ActiveView, icon: <PlaylistIcon /> }] : []),
    { label: "Albums", view: "albums", icon: <AlbumIcon /> },
    { label: "Artists", view: "artists", icon: <ArtistIcon /> },
  ]

  return (
    <aside
      className={cn(
        "shrink-0 bg-[#111111] flex flex-col py-4 px-2 overflow-y-auto overflow-x-hidden transition-[width] duration-300 ease-out",
        isCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo + collapse toggle */}
      <div className={cn(
        "flex items-center pb-6 pt-2 transition-all duration-300",
        isCollapsed ? "px-0 justify-center" : "px-4 gap-2.5"
      )}>
        <div className="size-[30px] rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 shadow-glow-sm">
          <DiscoverLogoIcon className="text-white" />
        </div>
        {!isCollapsed && (
          <span className="text-[15px] font-bold text-white truncate">Sonara</span>
        )}
        {!isCollapsed && <div className="flex-1" />}
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "size-6 rounded-md bg-transparent border-0 cursor-pointer flex items-center justify-center text-muted hover:text-white transition-all duration-300 shrink-0",
            isCollapsed && "mt-4"
          )}
        >
          <ChevronLeftIcon
            width={14}
            height={14}
            className={cn("transition-transform duration-300", isCollapsed && "rotate-180")}
          />
        </button>
      </div>

      <nav className="flex flex-col gap-0.5">
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
      </nav>
    </aside>
  )
}
