"use client"

// Sidebar — collapsible left nav, Spotify-style
// wednesday-design: dark surface (#111111), green active indicator, DM Sans
// wednesday-dev: NavItem extracted, active boolean prefix

import { AlbumIcon, ArtistIcon, ChevronLeftIcon, DiscoverLogoIcon, HomeIcon, MusicNoteIcon, PlaylistIcon, SearchIcon } from "components/icons"
import { cn } from "lib/cn"
import type { ActiveView } from "lib/constants"
import { useFeatureFlagEnabled } from "posthog-js/react"
import { usePlaylistStore } from "store/usePlaylistStore"
import type { Playlist } from "lib/api/playlists"

interface SidebarProps {
  activeView: ActiveView
  onNavClick: (view: ActiveView) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  sharedPlaylists?: (Playlist & { sharedBy: string; shareId: string })[]
  onSharedPlaylistClick?: (id: string) => void
  selectedPlaylistId?: string | null
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

export function Sidebar({ 
  activeView, 
  onNavClick, 
  isCollapsed, 
  onToggleCollapse,
  sharedPlaylists = [],
  onSharedPlaylistClick,
  selectedPlaylistId
}: SidebarProps) {
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

        {/* Shared with you section */}
        {isPlaylistEnabled && sharedPlaylists.length > 0 && (
          <div className="mt-6">
            {!isCollapsed && (
              <p className="px-4 text-[10px] font-bold text-muted uppercase tracking-[0.12em] mb-2">
                Shared with you
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {sharedPlaylists.slice(0, 2).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSharedPlaylistClick?.(p.id)}
                  title={isCollapsed ? `${p.name} (from ${p.sharedBy})` : undefined}
                  className={cn(
                    "flex items-center gap-3.5 w-full bg-transparent border-0 rounded-lg cursor-pointer text-sm text-left relative transition-all duration-200",
                    isCollapsed ? "px-0 py-2.5 justify-center" : "px-4 py-2.5",
                    activeView === "playlists" && selectedPlaylistId === p.id 
                      ? "text-white font-bold bg-white/5" 
                      : "text-muted font-normal hover:text-white hover:bg-white/5"
                  )}
                >
                  {activeView === "playlists" && selectedPlaylistId === p.id && (
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-primary" />
                  )}
                  <PlaylistIcon className={cn("shrink-0 size-4", (activeView === "playlists" && selectedPlaylistId === p.id) ? "opacity-100 text-primary" : "opacity-70")} />
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="truncate m-0">{p.name}</p>
                      <p className="text-[10px] text-muted truncate m-0 font-normal">from {p.sharedBy}</p>
                    </div>
                  )}
                </button>
              ))}

              {!isCollapsed && sharedPlaylists.length > 2 && (
                <button
                  onClick={() => onNavClick("playlists")}
                  className="mx-4 mt-1 text-[11px] font-bold text-muted hover:text-white transition-colors border-0 bg-transparent cursor-pointer text-left w-fit"
                >
                  View all ({sharedPlaylists.length})
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}
