import { AudioProvider } from "@/components/AudioProvider/AudioProvider"
import { I18nProvider } from "@/components/I18nProvider/I18nProvider"
import { NavBar } from "@/components/NavBar/NavBar"
import { NowPlaying } from "@/components/NowPlaying/NowPlaying"
import { NowPlayingSpacer } from "@/components/NowPlaying/NowPlayingSpacer"

import "styles/tailwind.css"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface text-text-primary antialiased">
        <I18nProvider>
          <AudioProvider>
            <NowPlaying />
            <NowPlayingSpacer />
            <div className="flex min-h-screen flex-col md:flex-row">
              <NavBar />
              <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
            </div>
          </AudioProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
