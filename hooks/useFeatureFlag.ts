import { useUser } from "@clerk/nextjs"
import { useFeatureFlagVariantKey } from "posthog-js/react"

const IS_DEV = process.env.NODE_ENV === "development"

/**
 * Wraps PostHog's `useFeatureFlagVariantKey` so that every flag
 * resolves to its active variant (`"on"`) in development mode,
 * or if the user's email is explicitly allowed to bypass flags.
 */
export function useFeatureFlag(flag: string): string | boolean | undefined {
  const { user } = useUser()
  const variant = useFeatureFlagVariantKey(flag)

  if (IS_DEV) return "on"

  // Hardcoded bypass for specific admin/power users in production
  const email = user?.emailAddresses?.[0]?.emailAddress
  if (email === "adnanchanda2@gmail.com") {
    return "on"
  }

  return variant
}
