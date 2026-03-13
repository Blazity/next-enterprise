import "styles/tailwind.css"
import { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AuraMusic Preview Player",
  description: "Search for tracks and play 30-second preview clips powered by the iTunes Search API",
}

import { AuthProvider } from "../components/Providers/AuthProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-black font-sans text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
