import { ClerkProvider } from "@clerk/nextjs"

import { AudioProvider } from "@/components/AudioProvider/AudioProvider"
import { I18nProvider } from "@/components/I18nProvider/I18nProvider"
import { PostHogProvider } from "@/components/PostHogProvider/PostHogProvider"

import "styles/tailwind.css"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#6366f1" },
        elements: { card: "bg-[#1a1a2e]", formButtonPrimary: "bg-[#6366f1] hover:bg-[#5558dd]" },
      }}
    >
      <html lang="en" className="dark">
        <body className="bg-surface text-text-primary antialiased">
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
