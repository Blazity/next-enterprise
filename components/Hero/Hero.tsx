export function Hero() {
  return (
    <div className="relative h-[260px] shrink-0 overflow-hidden">
      {/* Placeholder band photo — gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#dedad2] via-[#ccc9c0] to-[#bcb9b0]" />

      {/* Faux figure silhouettes */}
      <div className="absolute right-0 top-0 h-full w-[55%] flex items-end justify-end gap-2 pr-8 opacity-30">
        {[60, 80, 75, 65, 70, 85].map((h, i) => (
          <div key={i} className="bg-gray-500 rounded-t-full w-12" style={{ height: `${h}%` }} />
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
          This is The
          <br />
          Neigbourhood.
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
  )
}
