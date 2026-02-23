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

export function PlayQueue() {
  return (
    <aside className="w-[200px] bg-[#3c3c3c] flex flex-col py-6 px-4 shrink-0 overflow-y-auto h-full">
      <h2 className="text-white font-semibold text-sm mb-4">Play Queue</h2>
      <p className="text-purple-400 text-xs font-medium mb-3">Favorites</p>

      {/* Currently playing */}
      <div className="flex items-center gap-2 mb-3">
        {/* Waveform bars */}
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
  )
}
