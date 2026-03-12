"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ClerkProvider>{children}</ClerkProvider>
  }

  const isDark = resolvedTheme === "dark" || theme === "dark"

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: isDark ? "#f5f5f0" : "#121212",
          colorTextOnPrimaryBackground: isDark ? "#121212" : "#ffffff",
          colorBackground: isDark ? "#181818" : "#ffffff",
          colorText: isDark ? "#f5f5f0" : "#121212",
          colorInputBackground: isDark ? "#111111" : "#f4f4f5",
          colorInputText: isDark ? "#ffffff" : "#121212",
        },
        elements: {
          card: "rounded-2xl border border-border shadow-card",
          navbar: "hidden",
          headerTitle: "text-primary",
          headerSubtitle: "text-muted",
          socialButtonsBlockButton: "bg-surface-elevated border-border text-primary hover:bg-surface-hover",
          formButtonPrimary: "bg-primary text-bg hover:opacity-90 transition-opacity",
          footerActionLink: "text-primary hover:opacity-80",
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}
