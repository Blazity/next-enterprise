const recentlyPlayed = [
  { title: "Told You So", artist: "Paramore", bg: "bg-pink-300" },
  { title: "Airplane pt.2", artist: "BTS", bg: "bg-indigo-900" },
  { title: "Addict With A Pen", artist: "Twenty One Pilots", bg: "bg-teal-400" },
  { title: "The Night We Met", artist: "Lord Huron", bg: "bg-green-800" },
  { title: "Scary Love", artist: "The Neighbourhood", bg: "bg-yellow-100" },
  { title: "Born to die", artist: "Lana Del Rey", bg: "bg-stone-300" },
]

export function RecentlyPlayed() {
  return (
    <div className="flex-1 bg-[#efede6] flex flex-col overflow-hidden min-w-0">
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

      {/* Album grid */}
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

      {/* Player bar */}
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
          {/* Progress bar */}
          <div className="flex items-center gap-3 w-full max-w-[340px]">
            <span className="text-[11px] text-gray-400 w-7 text-right">0:32</span>
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[14%] bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" />
            </div>
            <span className="text-[11px] text-gray-400 w-7">3:58</span>
          </div>
        </div>
      </div>
    </div>
  )
}
