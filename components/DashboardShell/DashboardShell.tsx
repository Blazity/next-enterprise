"use client"

import { useRef, useState } from "react"
import type { ReactNode } from "react"

import { Sidebar } from "components/Sidebar/Sidebar"
import { TopNav } from "components/TopNav/TopNav"
import type { ActiveView } from "lib/constants"
import { useAppStore } from "store/useAppStore"
import { usePlaylistStore } from "store/usePlaylistStore"

interface DashboardShellProps {
  children: ReactNode
  activeView: ActiveView
  onNavClick: (view: ActiveView, id?: string) => void
  query: string
  onQueryChange: (value: string) => void
}

export function DashboardShell({ 
  children, 
  activeView, 
  onNavClick,
  query,
  onQueryChange
}: DashboardShellProps) {
  const { selectedPlaylistId, setSelectedPlaylistId } = usePlaylistStore()
  const { isSidebarCollapsed, toggleSidebar } = useAppStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="flex h-screen overflow-hidden box-border bg-bg">
      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeView={activeView}
        onNavClick={(view) => {
          onNavClick(view)
          setIsMobileMenuOpen(false)
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onSharedPlaylistClick={(id) => {
          setSelectedPlaylistId(id)
          onNavClick("playlists")
          setIsMobileMenuOpen(false)
        }}
        selectedPlaylistId={selectedPlaylistId}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden bg-bg relative">
        <TopNav
          query={query}
          inputRef={searchInputRef}
          onChange={onQueryChange}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-7 pb-[110px] md:pb-[96px]">
          {children}
        </main>
      </div>
    </div>
  )
}
