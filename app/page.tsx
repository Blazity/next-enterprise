const recentlyPlayed = [
  { title: "Told You So", artist: "Paramore", bg: "bg-pink-300" },
  { title: "Airplane pt.2", artist: "BTS", bg: "bg-indigo-900" },
  { title: "Addict With A Pen", artist: "Twenty One Pilots", bg: "bg-teal-400" },
  { title: "The Night We Met", artist: "Lord Huron", bg: "bg-green-800" },
  { title: "Scary Love", artist: "The Neighbourhood", bg: "bg-yellow-100" },
  { title: "Born to die", artist: "Lana Del Rey", bg: "bg-stone-300" },
]

const queueItems = [
  { title: "If You Were A Home", artist: "Nick Camryn" },
  { title: "Naive", artist: "The Kooks" },
  { title: "NUMB", artist: "XXXTENTACION" },
  { title: "All For You", artist: "Years & Years" },
  { title: "Up In Flames", artist: "Ruelle" },
  { title: "Tchibo", artist: "Viktor Sheen" },
  { title: "Let Me Down Slowly", artist: "Alec Benjamin" },
  { title: "Lucky Strike", artist: "Troye Sivan" },
  { title: "Blood // Water", artist: "grandson" },
  { title: "lovely (with Khalid)", artist: "Billie Eilish" },
  { title: "Come Together", artist: "The Beatles" },
]

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer text-sm ${
        active ? "text-gray-800 font-medium" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <span className="text-xs">{label}</span>
    </div>
  )
}

function SidebarSection({ title, items, isPlaylist = false }: { title: string; items: string[]; isPlaylist?: boolean }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 px-2">{title}</p>
      <nav>
        {items.map((item) => (
          <div
            key={item}
            className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer text-xs ${
              item === "Discover" ? "text-gray-800 font-semibold" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-gray-300 text-[11px]">{isPlaylist ? "≡" : "•"}</span>
            <span>{item}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default function Web() {
  return (
    <div className="h-full bg-[#dddce8] flex items-center justify-center overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-[-80px] right-[28%] w-[420px] h-[420px] bg-purple-300/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-30px] w-[300px] h-[300px] bg-purple-400/35 rounded-full blur-2xl pointer-events-none" />

      {/* App shell */}
      <div className="w-full max-w-[1160px] h-[600px] mx-6 flex rounded-[28px] overflow-hidden shadow-2xl">

        {/* ── Left Sidebar ── */}
        <aside className="w-[200px] bg-white flex flex-col py-6 px-4 shrink-0">
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
              {[
                { label: "Discover", active: true, icon: "♪" },
                { label: "Genres", icon: "◉" },
                { label: "Top Charts", icon: "↑↑" },
                { label: "Local Files", icon: "⊟" },
              ].map(({ label, active, icon }) => (
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
              {[
                { label: "Favorites", icon: "♡" },
                { label: "History", icon: "↺" },
                { label: "Stations", icon: "⊕" },
              ].map(({ label, icon }) => (
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
              {["Favorites", "Daily Mix", "Gaming playlist"].map((label) => (
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

        {/* ── Main Content ── */}
        <main className="flex-1 bg-[#efede6] flex flex-col overflow-hidden min-w-0">

          {/* Hero Banner */}
          <div className="relative h-[260px] shrink-0 overflow-hidden">
            {/* Placeholder band photo — gradient silhouettes */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#dedad2] via-[#ccc9c0] to-[#bcb9b0]" />
            {/* Faux figure silhouettes */}
            <div className="absolute right-0 top-0 h-full w-[55%] flex items-end justify-end gap-2 pr-8 opacity-30">
              {[60, 80, 75, 65, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className="bg-gray-500 rounded-t-full w-12"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            {/* Top-right icons */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button className="w-8 h-8 bg-white/70 backdrop-blur rounded-full flex items-center justify-center text-gray-500 text-sm hover:bg-white/90 transition">
                ⌕
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 ring-2 ring-white/60" />
            </div>

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-10 z-10">
              <div className="w-14 h-1.5 bg-purple-500 rounded-full mb-4" />
              <h1 className="text-[38px] font-extrabold text-gray-800 leading-none tracking-tight">
                This is The<br />Neigbourhood.
              </h1>
              <p className="text-gray-500 mt-2 text-[13px]">This is The Neigbourhood.</p>
              <p className="text-gray-400 text-[12px]">The essential tracks, all in one playlist.</p>
              <p className="text-purple-500 text-[11px] mt-1">38 songs, 2h 25min</p>
              <div className="flex items-center gap-3 mt-5">
                <button className="bg-purple-500 hover:bg-purple-600 text-white pl-5 pr-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition">
                  Listen
                  <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-purple-500 text-[10px] ml-0.5">▶</span>
                  </span>
                </button>
                <button className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-400 transition text-sm">
                  ♡
                </button>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-gray-200/70 bg-[#efede6]/80 px-8 shrink-0">
            {["Recently played", "Featured", "Recommended"].map((tab, i) => (
              <button
                key={tab}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition ${
                  i === 0
                    ? "border-gray-400 text-gray-600"
                    : "border-transparent text-gray-400 hover:text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Recently Played Grid */}
          <div className="flex-1 overflow-y-auto px-8 py-5 min-h-0">
            <p className="text-purple-500 text-sm font-semibold mb-4">Recently played</p>
            <div className="grid grid-cols-6 gap-4">
              {recentlyPlayed.map((item) => (
                <div key={item.title} className="flex flex-col cursor-pointer group">
                  <div
                    className={`aspect-square rounded-2xl ${item.bg} mb-2 shadow-sm group-hover:shadow-md transition-shadow`}
                  />
                  <p className="text-[11px] font-semibold text-gray-700 truncate">{item.title}</p>
                  <p className="text-[10px] text-gray-400 truncate">{item.artist}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Player Bar */}
          <div className="bg-[#efede6]/90 border-t border-gray-200/60 px-8 py-3 shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              {/* Controls */}
              <div className="flex items-center gap-5">
                <button className="text-gray-400 hover:text-gray-600 text-sm transition">⇄</button>
                <button className="text-gray-400 hover:text-gray-600 text-base transition">⏮</button>
                <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:shadow-lg transition text-base">
                  ⏸
                </button>
                <button className="text-gray-400 hover:text-gray-600 text-base transition">⏭</button>
                <button className="text-gray-400 hover:text-gray-600 text-sm transition">↻</button>
              </div>
              {/* Progress */}
              <div className="flex items-center gap-3 w-full max-w-[340px]">
                <span className="text-[11px] text-gray-400 w-7 text-right">0:32</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[14%] bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" />
                </div>
                <span className="text-[11px] text-gray-400 w-7">3:58</span>
              </div>
            </div>
          </div>
        </main>

        {/* ── Right Sidebar — Play Queue ── */}
        <aside className="w-[200px] bg-[#3c3c3c] flex flex-col py-6 px-4 shrink-0 overflow-y-auto">
          <h2 className="text-white font-semibold text-sm mb-4">Play Queue</h2>
          <p className="text-purple-400 text-xs font-medium mb-3">Favorites</p>

          {/* Currently playing */}
          <div className="flex items-center gap-2 mb-3">
            {/* Waveform animation */}
            <div className="flex gap-[2px] items-end h-4 shrink-0">
              {[40, 100, 70, 55, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-purple-400 rounded-full"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">Jumpsuit</p>
              <p className="text-gray-400 text-[10px] truncate">Twenty One Pilots</p>
            </div>
            <span className="text-gray-400 text-[10px] shrink-0">0:32</span>
          </div>

          {/* Queue list */}
          <div className="space-y-2.5">
            {queueItems.map((item) => (
              <div key={item.title} className="cursor-pointer hover:opacity-80 transition">
                <p className="text-white text-[11px] font-medium truncate">{item.title}</p>
                <p className="text-gray-400 text-[10px] truncate">{item.artist}</p>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  )
}
