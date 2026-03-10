import { ClerkProvider } from "@clerk/nextjs"
import { DM_Sans } from "next/font/google"
import type { Metadata } from "next"

import { MiniPlayer } from "components/MiniPlayer/MiniPlayer"
import { ToastContainer } from "components/Toast/ToastContainer"
import { CLERK_APPEARANCE } from "lib/constants"

import "styles/tailwind.css"

// wednesday-design TOKENS.md: DM Sans for body text, CSS variable for Tailwind
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sonara",
  description: "Discover music, search songs, albums and artists. Play 30-second previews powered by iTunes.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={CLERK_APPEARANCE}>
      <html lang="en" className={dmSans.variable}>
        <body className={`${dmSans.variable} font-sans antialiased bg-bg text-white`}>
          {children}
          <ToastContainer />
          <MiniPlayer />
        </body>
      </html>
    </ClerkProvider>
  )
}
