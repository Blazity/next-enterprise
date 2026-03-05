import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"

import "styles/tailwind.css"

import { MiniPlayer } from "components/MiniPlayer/MiniPlayer"

// wednesday-design TOKENS.md: DM Sans for body text, CSS variable for Tailwind
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Music Discovery",
  description: "Search songs, albums and artists. Play 30-second previews powered by iTunes.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        {children}
        {/* MiniPlayer is a client component — mounted in layout to share Zustand state across all routes */}
        <MiniPlayer />
      </body>
    </html>
  )
}
