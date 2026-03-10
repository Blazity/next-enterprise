"use client"

import { Sidebar } from "components/Sidebar/Sidebar"
import { TopNav } from "components/TopNav/TopNav"
import { usePlaylistStore } from "store/usePlaylistStore"
import type { ActiveView } from "lib/constants"
import { useState, useRef } from "react"

interface DashboardShellProps {
  children: React.ReactNode
  activeView: ActiveView
  onNavClick: (view: ActiveView) => void
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
  const { sharedPlaylists, selectedPlaylistId, setSelectedPlaylistId } = usePlaylistStore()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="flex h-screen overflow-hidden pb-[72px] box-border bg-bg">
      <Sidebar
        activeView={activeView}
        onNavClick={onNavClick}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        sharedPlaylists={sharedPlaylists}
        selectedPlaylistId={selectedPlaylistId}
        onSharedPlaylistClick={(id) => {
          setSelectedPlaylistId(id)
          onNavClick("playlists")
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden bg-bg">
        <TopNav
          query={query}
          inputRef={searchInputRef}
          onChange={onQueryChange}
        />

        <main className="flex-1 overflow-y-auto px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  )
}
