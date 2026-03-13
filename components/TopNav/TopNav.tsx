import { Music4, User as UserIcon } from "lucide-react"
import { useState } from "react"

import { AuthOverlay } from "components/Auth/AuthOverlay"
import { useAuth } from "components/Providers/AuthProvider"
import { SearchBar } from "components/SearchBar/SearchBar"

interface TopNavProps {
  onHome?: () => void
  onSearch?: (query: string) => void
  onClearSearch?: () => void
  isSearchLoading?: boolean
}

export function TopNav({ onHome, onSearch, onClearSearch, isSearchLoading }: TopNavProps) {
  const { user, signOut } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (onHome) onHome()
  }

  return (
    <>
      <nav className="bg-aura-bg/95 sticky top-0 z-50 w-full border-b border-white/5 px-6 py-4 shadow-xl backdrop-blur-2xl">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-8">
          {/* Brand/Mobile Logo - Left Column */}
          <div className="flex-1 flex justify-start">
            <button onClick={handleHomeClick} className="lg:hidden flex items-center gap-2 group">
              <div className="from-aura-primary to-aura-secondary group-hover:shadow-aura-primary/50 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg transition-all">
                <Music4 className="h-5 w-5 text-white" />
              </div>
            </button>
          </div>

          {/* Global Search Bar - Center Column */}
          <div className="w-full max-w-2xl relative">
            <SearchBar 
              onSearch={onSearch || (() => {})} 
              onClear={onClearSearch} 
              isLoading={isSearchLoading}
            />
          </div>

          {/* Auth section - Right Column */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-6 flex-shrink-0">
            {/* Auth section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4 group cursor-pointer bg-white/5 hover:bg-white/10 p-1.5 pr-4 rounded-full border border-white/5 transition-all">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-aura-primary to-aura-secondary flex items-center justify-center border border-white/20 shadow-lg">
                    <UserIcon size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-white leading-none">{user.email?.split("@")[0]}</span>
                    <button 
                      onClick={() => signOut()}
                      className="text-[8px] font-bold text-aura-primary uppercase tracking-[0.1em] opacity-80"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-aura-primary hover:bg-aura-accent text-white text-[11px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full border border-aura-primary/20 transition-all active:scale-95 shadow-lg shadow-aura-primary/20"
                >
                  Join the Vibes
                </button>
              )}
            </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthOverlay isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}
