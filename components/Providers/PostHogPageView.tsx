"use client"
import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { usePostHog } from "posthog-js/react"

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
