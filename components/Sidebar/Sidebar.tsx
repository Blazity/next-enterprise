"use client"

// Sidebar — fixed left nav, Spotify-style
// wednesday-design: dark surface (#111111), green active indicator, DM Sans
// wednesday-dev: NavItem extracted, active boolean prefix

import { AlbumIcon, ArtistIcon, DiscoverLogoIcon, HomeIcon, MusicNoteIcon, SearchIcon } from "components/icons"
import { cn } from "lib/cn"
import type { ActiveView } from "lib/constants"

interface SidebarProps {
  activeView: ActiveView
  onNavClick: (view: ActiveView) => void
}

interface NavItemProps {
  label: string
  isActive: boolean
  icon: React.ReactNode
  onClick: () => void
}

function NavItem({ label, isActive, icon, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 w-full px-4 py-2.5 bg-transparent border-0 rounded-lg cursor-pointer text-sm text-left relative transition-colors duration-150",
        isActive ? "text-white font-bold" : "text-muted font-normal hover:text-white"
      )}
    >
      {/* Green left indicator for active */}
      {isActive && (
        <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-primary" />
      )}
      <span className={cn("shrink-0", isActive ? "opacity-100" : "opacity-70")}>{icon}</span>
      {label}
    </button>
  )
}

export function Sidebar({ activeView, onNavClick }: SidebarProps) {
  const navItems: { label: string; view: ActiveView; icon: React.ReactNode }[] = [
    { label: "Home", view: "home", icon: <HomeIcon /> },
    { label: "Search", view: "search", icon: <SearchIcon width={20} height={20} /> },
    { label: "Songs", view: "songs", icon: <MusicNoteIcon /> },
    { label: "Albums", view: "albums", icon: <AlbumIcon /> },
    { label: "Artists", view: "artists", icon: <ArtistIcon /> },
  ]

  return (
    <aside className="w-[220px] shrink-0 bg-[#111111] flex flex-col py-4 px-2 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 pb-6 pt-2">
        <div className="size-[30px] rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 shadow-glow-sm">
          <DiscoverLogoIcon className="text-white" />
        </div>
        <span className="text-[15px] font-bold text-white">Sonara</span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            label={item.label}
            isActive={activeView === item.view}
            icon={item.icon}
            onClick={() => onNavClick(item.view)}
          />
        ))}
      </nav>
    </aside>
  )
}
