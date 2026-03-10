"use client"
import { usePathname, useSearchParams } from "next/navigation"
import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"

export default function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      posthog.capture("$pageview", { $current_url: window.location.href })
    }
  }, [pathname, searchParams, posthog])

  return null
}
