import { Metadata } from "next"
import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import NextUiProvider from "../providers/NextUiProvider"

import "../styles/tailwind.css"

export const metadata: Metadata = {
  title: "IsaCon",
  description: "IsaCon Consulting",
  openGraph: {
    type: "website",
    url: "https://isacon.be",
    title: "IsaCon",
    description: "IsaCon Consulting",
    siteName: "IsaCon",
    images: [
      {
        url: "/Isacon logo RBG_1.png",
      },
    ],
  },
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NextUiProvider>
          <div className="flex min-h-screen flex-col justify-between bg-primary-50">
            <Navbar />
            <main className="h-[calc(100%-160px)]">{children}</main>
            <Footer />
          </div>
        </NextUiProvider>
      </body>
    </html>
  )
}
