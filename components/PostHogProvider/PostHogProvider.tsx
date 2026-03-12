"use client"

import { useEffect } from "react"

import { useAuth, useUser } from "@clerk/nextjs"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    loaded: (client) => {
      const debugWindow = window as Window & { posthog?: unknown }
      debugWindow.posthog = client
      if (process.env.NODE_ENV !== "production") {
        console.info("[PostHog] initialized", {
          host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
          loaded: client.__loaded,
        })
      }
    },
  })
}

function PostHogPageView() {
  const posthogClient = usePostHog()

  useEffect(() => {
    if (!posthogClient) return

    const handleRouteChange = () => {
      posthogClient.capture("$pageview", {
        $current_url: window.location.href,
      })
    }

    handleRouteChange()
  }, [posthogClient])

  return null
}

function PostHogIdentify() {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser()
  const posthogClient = usePostHog()

  useEffect(() => {
    if (!posthogClient || !isUserLoaded) return

    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress
      const name = user.fullName

      if (process.env.NODE_ENV !== "production") {
        console.log("[PostHog] Identifying user:", { id: user.id, email })
      }

      posthogClient.identify(user.id, {
        email,
        name,
        $email: email, // Standard PostHog person property
      })

      // Ensure person-property based flag conditions (e.g. email) are available immediately.
      posthogClient.setPersonPropertiesForFlags({ email, name, $email: email }, false)

      // Re-evaluate flags for the identified person so targeting rules apply immediately.
      posthogClient.reloadFeatureFlags()
    } else if (isUserLoaded && !isSignedIn) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[PostHog] User signed out or not logged in, resetting client.")
      }
      posthogClient.reset()
      posthogClient.reloadFeatureFlags()
    }
  }, [posthogClient, isUserLoaded, isSignedIn, user])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      <PostHogIdentify />
      {children}
    </PHProvider>
  )
}
