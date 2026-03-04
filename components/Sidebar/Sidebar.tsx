"use client"

// Sidebar — fixed left nav, Spotify-style
// wednesday-design: dark surface (#111111), green active indicator, DM Sans
// wednesday-dev: NavItem extracted, active boolean prefix

import { cn } from "lib/cn"

import type { ActiveView } from "app/page"

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
    {
      label: "Home",
      view: "home",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      label: "Search",
      view: "search",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      label: "Songs",
      view: "songs",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      ),
    },
    {
      label: "Albums",
      view: "albums",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
        </svg>
      ),
    },
    {
      label: "Artists",
      view: "artists",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
  ]

  return (
    <aside className="w-[220px] shrink-0 bg-[#111111] flex flex-col py-4 px-2 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 pb-6 pt-2">
        <div className="size-[30px] rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 shadow-glow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <span className="text-[15px] font-bold text-white">Discover</span>
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
