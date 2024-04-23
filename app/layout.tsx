import { Metadata } from "next"
import { env } from "env.mjs"
import "styles/tailwind.css"

export const metadata: Metadata = {
  title: {
    default: "Blazity | next-enterprise",
    template: "Blazity | %s",
  },
  description: "Blazity next-js boilerplate for enterprise applications",
  keywords: "next-js, next-enterprise, blazity, boilerplate, enterprise",
  icons: "/logo.png",
  openGraph: {
    images: "/logo.png",
    type: "website",
  },
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_BASE_URL || "http://localhost:3000"),
  twitter: {
    images: "/logo.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
