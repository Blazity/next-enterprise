const browseItems = [
  { label: "Discover", active: true, icon: "♪" },
  { label: "Genres", icon: "◉" },
  { label: "Top Charts", icon: "↑↑" },
  { label: "Local Files", icon: "⊟" },
]

const yourMusicItems = [
  { label: "Favorites", icon: "♡" },
  { label: "History", icon: "↺" },
  { label: "Stations", icon: "⊕" },
]

const playlistItems = ["Favorites", "Daily Mix", "Gaming playlist"]

export function Sidebar() {
  return (
    <aside className="w-[200px] bg-white flex flex-col py-6 px-4 shrink-0 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-7">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
          </svg>
        </div>
        <span className="font-bold text-gray-800 text-sm">Aplayero</span>
      </div>

      {/* Browse Music */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 px-2">Browse Music</p>
        <nav className="space-y-0.5">
          {browseItems.map(({ label, active, icon }) => (
            <div
              key={label}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer text-xs ${
                active ? "text-gray-800 font-semibold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-[11px] w-4 text-center">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Your Music */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 px-2">Your Music</p>
        <nav className="space-y-0.5">
          {yourMusicItems.map(({ label, icon }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer text-xs text-gray-400 hover:text-gray-600"
            >
              <span className="text-[11px] w-4 text-center">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Your Playlists */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 px-2">Your Playlists</p>
        <nav className="space-y-0.5">
          {playlistItems.map((label) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer text-xs text-gray-400 hover:text-gray-600"
            >
              <span className="text-[11px] w-4 text-center">≡</span>
              <span>{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer text-xs text-gray-400 hover:text-gray-600">
            <span className="text-[11px] w-4 text-center">+</span>
            <span>Create a playlist</span>
          </div>
        </nav>
      </div>

      {/* Bottom album placeholder */}
      <div className="mt-auto rounded-xl overflow-hidden h-[88px] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shrink-0" />
    </aside>
  )
}
