import { Sidebar } from "components/Sidebar/Sidebar"
import { Hero } from "components/Hero/Hero"
import { RecentlyPlayed } from "components/RecentlyPlayed/RecentlyPlayed"
import { PlayQueue } from "components/PlayQueue/PlayQueue"

export default function Web() {
  return (
    <div className="h-full bg-[#dddce8] flex items-center justify-center overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-[-80px] right-[28%] w-[420px] h-[420px] bg-purple-300/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-30px] w-[300px] h-[300px] bg-purple-400/35 rounded-full blur-2xl pointer-events-none" />

      {/* App shell */}
      <div className="w-full max-w-[1160px] h-[600px] mx-6 flex rounded-[28px] overflow-hidden shadow-2xl">
        <Sidebar />

        <main className="flex-1 bg-[#efede6] flex flex-col overflow-hidden min-w-0">
          <Hero />
          <RecentlyPlayed />
        </main>

        <PlayQueue />
      </div>
    </div>
  )
}
