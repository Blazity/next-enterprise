import { Geist } from "next/font/google"

import { ClerkProvider } from "@clerk/nextjs"

import { AudioProvider } from "@/components/AudioProvider/AudioProvider"
import { I18nProvider } from "@/components/I18nProvider/I18nProvider"
import { PostHogProvider } from "@/components/PostHogProvider/PostHogProvider"
import { cn } from "@/lib/utils"

import "styles/tailwind.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#06b6d4" },
        elements: { card: "bg-[#0f172a]", formButtonPrimary: "bg-[#06b6d4] hover:bg-[#0891b2]" },
      }}
    >
      <html lang="en" className={cn("dark", "font-sans", "overflow-hidden", geist.variable)}>
        <body className="bg-surface text-text-primary antialiased overflow-hidden h-screen w-screen">
          <PostHogProvider>
            <I18nProvider>
              <AudioProvider>{children}</AudioProvider>
            </I18nProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
