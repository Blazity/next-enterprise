import { RecentlyPlayed } from "components/RecentlyPlayed/RecentlyPlayed"

export default function RecentlyPlayedPage() {
  return (
    <div className="h-full bg-[#dddce8] flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-80px] right-[28%] w-[420px] h-[420px] bg-purple-300/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-30px] w-[300px] h-[300px] bg-purple-400/35 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-[760px] h-[600px] mx-6 rounded-[28px] overflow-hidden shadow-2xl flex flex-col">
        <RecentlyPlayed />
      </div>
    </div>
  )
}
