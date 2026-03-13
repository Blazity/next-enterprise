import { Heart, Home, Library, Music, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

import { CreatePlaylistModal } from "components/Playlist/CreatePlaylistModal"
import { useAuth } from "components/Providers/AuthProvider"
import { deletePlaylist, getPlaylists } from "lib/actions/playlists"
import { Playlist } from "lib/types"

interface SidebarProps {
  onSelectPlaylist?: (playlistId: string | "liked" | "library" | "home") => void
  activeId?: string | "liked" | "library" | "home" | null
}

export function Sidebar({ onSelectPlaylist, activeId }: SidebarProps) {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchPlaylists = async () => {
    if (!user) {
      setPlaylists([])
      return
    }
    const data = await getPlaylists() as Playlist[]
    setPlaylists(data)
  }

  useEffect(() => {
    fetchPlaylists()
  }, [user])

  const handleDeletePlaylist = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this playlist?")) return
    try {
      await deletePlaylist(id)
      fetchPlaylists()
      if (activeId === id) onSelectPlaylist?.("library")
    } catch (err) {
      console.error("Failed to delete playlist:", err)
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-aura-bg border-r border-white/5 flex flex-col h-full overflow-hidden">
      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="h-10 w-10 bg-gradient-to-br from-aura-primary to-aura-secondary rounded-xl flex items-center justify-center shadow-lg shadow-aura-primary/20">
            <Music className="text-white h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter text-white leading-none uppercase">AURA<span className="text-aura-primary">MUSIC</span></h1>
          </div>
        </div>

        {/* Main Nav */}
        <div className="space-y-2">
          <button 
            onClick={() => onSelectPlaylist?.("home")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              !activeId || activeId === "home" 
                ? "bg-aura-primary text-white shadow-lg shadow-aura-primary/20 scale-[1.02]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="font-bold tracking-tight">Home</span>
          </button>
          
          <button 
            onClick={() => onSelectPlaylist?.("library")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeId === "library"
                ? "bg-aura-primary text-white shadow-lg shadow-aura-primary/20 scale-[1.02]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Library className="h-5 w-5" />
            <span className="font-bold tracking-tight">My Library</span>
          </button>
        </div>

        {/* Your Library Section */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-aura-primary/60">Your Music</h3>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black text-white hover:bg-aura-primary/10 transition-all uppercase tracking-widest bg-white/5 rounded-lg border border-aura-primary/20"
          >
            <Plus size={14} className="text-aura-primary" />
            <span>New Playlist</span>
          </button>

          <div className="space-y-1">
            <button 
              onClick={() => onSelectPlaylist?.("liked")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                activeId === "liked" ? "text-white bg-aura-primary/20 border border-aura-primary/10" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="h-8 w-8 rounded bg-gradient-to-br from-aura-primary to-aura-secondary flex items-center justify-center text-white shadow-md">
                <Heart size={14} fill="currentColor" />
              </div>
              <span className="text-sm font-bold tracking-tight">Liked Songs</span>
            </button>

            {playlists.map((playlist) => (
              <div key={playlist.id} className="group relative">
                <button 
                  onClick={() => onSelectPlaylist?.(playlist.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    activeId === playlist.id ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="h-8 w-8 rounded bg-aura-surface flex items-center justify-center text-aura-primary/60 group-hover:text-aura-primary transition-colors">
                    <Music size={14} />
                  </div>
                  <span className="text-sm font-bold tracking-tight truncate pr-6">{playlist.name}</span>
                </button>
                <button 
                  onClick={(e) => handleDeletePlaylist(e, playlist.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreatePlaylistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(p: Playlist) => {
          fetchPlaylists()
          onSelectPlaylist?.(p.id)
        }} 
      />

      <div className="p-4 border-t border-white/5">
        <div className="bg-gradient-to-r from-aura-primary/20 to-aura-secondary/20 rounded-xl p-4 border border-white/5">
          <p className="text-xs font-bold text-white mb-1">Aura Premium</p>
          <p className="text-[10px] text-slate-400 mb-3">Sync your music across all devices.</p>
          <button className="w-full py-2 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-slate-200 transition-colors">
            UPGRADE NOW
          </button>
        </div>
      </div>
    </aside>
  )
}
