import "styles/tailwind.css"
import { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Spotify Preview Player",
  description: "Search for tracks and play 30-second preview clips powered by the Spotify Web API",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-black font-sans text-white antialiased">{children}</body>
    </html>
  )
}
