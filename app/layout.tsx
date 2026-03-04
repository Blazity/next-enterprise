import "styles/tailwind.css"

import { NavBar } from "@/components/NavBar/NavBar"
import { NowPlaying } from "@/components/NowPlaying/NowPlaying"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface text-text-primary antialiased">
        <NowPlaying />
        <div className="flex min-h-screen flex-col md:flex-row">
          <NavBar />
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
        </div>
      </body>
    </html>
  )
}
