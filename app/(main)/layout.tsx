import { NavBar } from "@/components/NavBar/NavBar"
import { NowPlaying } from "@/components/NowPlaying/NowPlaying"
import { NowPlayingSpacer } from "@/components/NowPlaying/NowPlayingSpacer"
import { UserSync } from "@/components/UserSync/UserSync"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserSync />
      <NowPlaying />
      <NowPlayingSpacer />
      <div className="flex min-h-screen flex-col md:flex-row">
        <NavBar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
      </div>
    </>
  )
}
