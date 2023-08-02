import { Metadata } from "next"
import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"

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
        <div className="flex min-h-screen flex-col justify-between">
          <Navbar />
          <main className="mb-auto min-h-screen bg-primary-50">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
