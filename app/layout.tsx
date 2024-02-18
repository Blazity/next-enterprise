import Navbar from "components/Navbar/Navbar"
import { Metadata } from "next"
import "styles/tailwind.css"

export const metadata: Metadata = {
  // title: "Next.js Enterprise Boilerplate",
  // twitter: {
  //   card: "summary_large_image",
  // },
  // openGraph: {
  //   url: "https://next-enterprise.vercel.app/",
  //   images: [
  //     {
  //       width: 1200,
  //       height: 630,
  //       url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
  //     },
  //   ],
  // },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
