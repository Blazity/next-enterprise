import { Home, Music4, Search } from "lucide-react"

interface TopNavProps {
  onHome?: () => void
}

export function TopNav({ onHome }: TopNavProps) {
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (onHome) onHome()
  }

  const focusSearch = () => {
    const searchInput = document.getElementById("search-input")
    if (searchInput) {
      searchInput.focus()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <nav className="bg-aura-bg/80 sticky top-0 z-50 w-full border-b border-white/5 px-6 py-3 shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <button onClick={handleHomeClick} className="group flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="from-aura-primary to-aura-secondary group-hover:shadow-aura-primary/50 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg transition-shadow">
            <Music4 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Aura<span className="text-aura-primary">Music</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 rounded-full border border-white/5 bg-black/20 p-1 sm:flex">
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
          <button
            onClick={focusSearch}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
    </nav>
  )
}
