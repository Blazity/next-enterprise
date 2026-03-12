import { Suspense } from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"


import { MiniPlayer } from "components/MiniPlayer/MiniPlayer"
import PostHogPageView from "components/Providers/PostHogPageView"
import { PostHogProvider } from "components/Providers/PostHogProvider"
import { ThemeProvider } from "components/Providers/ThemeProvider"
import { ToastContainer } from "components/Toast/ToastContainer"
import { ClerkThemeProvider } from "../components/Providers/ClerkThemeProvider"

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
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ClerkThemeProvider>
            <PostHogProvider>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>
              {children}
            </PostHogProvider>
            <ToastContainer />
            <MiniPlayer />
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
